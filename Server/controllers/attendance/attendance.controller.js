const prisma = require("../../config/prisma.config");
const moment=require("moment");

const helper = require("../../utils/attendance.util");
const commonUtil = require("../../utils/common.util");
/*
    1. check if he is right on time according to his shift
        - if arrived early than time-duration allowed in shift, decline recording the attendance
        - if departed late than time-duration allowed in shift, decline recording the attendance
    2. late office policy is applied if he is late
        -late office policy is also applied if he leaves early.  
    3. the policy is applied based on how late is he (kitna late aya h wo)
    4. absent and half-day will be decided based on punch-out.
    5. absent and half-day will also be decided based on manual punch-out.

*/ 
// 
const recordOnlineAttendance = async(req,res)=>{
    try {
        const {employeeId} = req.body;
        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is required.",
            });
        }
        const currentTimestamp = new Date();
        const currentDate = new Date(moment(currentTimestamp).format('YYYY-MM-DD'));

        // console.log(currentDate);

        const employee = await prisma.employee.findFirst({
            where:{id:employeeId},
            select:{
                isActive:true,
                employeeWorkDetail:{
                    select:{
                        officeTimePolicy:true,
                        shift:true
                    }
                }
            }
        })

        // console.log(employee);
                        
        if(!employee.isActive){
            return res.status(400).json({
                success:false,
                message:"Employee is not active anymore. Can't record attendance."
            });
        }

        // console.log(employee)
        //check if the employee is eligible to mark attendance
        //check according to shift - max early check
        const currTime = moment(currentTimestamp).format('HH:mm');
        const currTimeMin = commonUtil.timeDurationInMinutes('00:00',currTime);

        if(currTimeMin < commonUtil.timeDurationInMinutes('00:00',employee.employeeWorkDetail.shift.maxEarlyAllowed)){

            // console.log(currTime);
            // console.log(employee.shift.maxEarlyAllowed);
            // console.log(currTimeMin, commonUtil.timeDurationInMinutes('00:00',employee.shift.maxEarlyAllowed));
            return res.status(401).json({
                success:false,
                message:"Punch-In too early, attendance not recorded."
            });
        }
        // //stop execution here for testing purpose
        // console.log("H1")
        // return res.status(200).json({
        //     message:"Execution Stopped here."
        // })
        // throw new Error("Execution Stopped HERE!")

        //attendance logic

        let attendanceRecord = await prisma.attendance.findFirst({
           where:{ 
                employeeId : employeeId,
                date : currentDate
            }
        });

        if(!attendanceRecord){
            attendanceRecord = {
                employeeId:employeeId,
                date:currentDate,
                punchInTime:currentTimestamp,
                status:'Present',     //do not fetch the id or use query until the time of saving in database.

                // statusId: (await prisma.attendance_status.findUnique({
                //     where:{name:"Present"},
                //     select:{id:true}
                // }))?.id
            };
            //check for time-policy and set penalty if time-policy is violated.
            let response = await helper.applyLateArrivalPenalty(employee,currentTimestamp);
            if(response.status==="success" && response.data!=null){
                attendanceRecord.penalty = response.data;
                if(response.data.deduction>=0.5){
                    attendanceRecord.status = "P/2"
                }
                if(response.data.deduction===1){
                    attendanceRecord.status = "Absent"
                }
            }
            else if(response.status==="error"){
                throw response.error
            }

            // console.log("Hi 2")
            // console.log("attendance record...",attendanceRecord);
           
            // console.log({employeeId:attendanceRecord.employeeId,
            //     date:attendanceRecord.date,
            //     punchInTime:attendanceRecord.punchInTime,
            //     penaltyIsPenalized:attendanceRecord.penalty?.isPenalized,
            //     penaltyReason:attendanceRecord.penalty?.reason,
            //     penaltyDeduction:attendanceRecord.penalty?.deduction,}
            // );


            // return res.status(200).json({
            //     message:"Execution Stopped here."
            // })
            
            const isSaved = await prisma.attendance.create({
                data:{
                    // employeeId:attendanceRecord.employeeId,
                    employee:{connect:{id:attendanceRecord.employeeId}},
                    date:attendanceRecord.date,
                    punchInTime:attendanceRecord.punchInTime,
                    penaltyIsPenalized:attendanceRecord.penalty?.isPenalized,
                    penaltyReason:attendanceRecord.penalty?.reason,
                    penaltyDeduction:attendanceRecord.penalty?.deduction,
                    status:{
                        connect:{name:attendanceRecord.status}
                        // connectOrCreate: {
                        //     where: { name: attendanceRecord.status }, // Try to connect if it exists
                        //     create: { name: attendanceRecord.status } // Otherwise, create a new status
                        // }
                    }
                }
            })
            if(isSaved){
                return res.status(201).json({
                    success:true,
                    message:"Punch-in Time Recorded Successfully!",
                    data:isSaved
                });
            }
            else{
                throw new Error("Couldn't Store record Punch-in.");
            }
        }

        if(!attendanceRecord.punchOutTime){
            //check shift - max late Allowed
            if(currTimeMin > commonUtil.timeDurationInMinutes('00:00',employee.employeeWorkDetail.shift.maxLateAllowed)){
                return res.status(401).json({
                    success:false,
                    message:"Punch-Out too late, attendance not recorded."
                });
            }
            attendanceRecord.punchOutTime = currentTimestamp;

            //calculate total work minutes
            // if punch-in is before shift time, then total work minutes will be calculated from shift-start-time.
            // if punch-out is after shift time, then we will use shift-end-time.
            let punchIn, punchOut;
            if(commonUtil.timeDurationInMinutes(employee.employeeWorkDetail.shift.startTime,moment(attendanceRecord.punchInTime).format("HH:mm"))<0)
            {
                punchIn = employee.employeeWorkDetail.shift.startTime;
            }
            else{
                punchIn = moment(attendanceRecord.punchInTime).format("HH:mm");
            }

            if(commonUtil.timeDurationInMinutes(employee.employeeWorkDetail.shift.endTime,moment(attendanceRecord.punchOutTime).format("HH:mm"))>0){
                punchOut = employee.employeeWorkDetail.shift.endTime;
            }
            else{
                punchOut = moment(attendanceRecord.punchOutTime).format("HH:mm");
            }
            const totalMinutes = commonUtil.timeDurationInMinutes(punchIn,punchOut);

            //early departure penalty
            const response = helper.applyEarlyDeparturePenalty(employee,totalMinutes);
            if(response.isPenalized)
            {
                attendanceRecord.penalty = response;
                if(response.deduction>=0.5){
                    attendanceRecord.status = "P/2"
                }
                if(response.deduction===1){
                    attendanceRecord.status = "Absent"
                }
            }
            attendanceRecord.totalMinutes = totalMinutes;
            attendanceRecord.updatedById= employeeId;   

            const isSaved = await prisma.attendance.update({
                where:{
                    id:attendanceRecord.id
                },
               data:{
                    punchOutTime:attendanceRecord.punchOutTime,
                    totalMinutes:attendanceRecord.totalMinutes,
                    penaltyIsPenalized:attendanceRecord.penalty?.isPenalized,
                    penaltyReason:attendanceRecord.penalty?.reason,
                    penaltyDeduction:attendanceRecord.penalty?.deduction,
                    status:{
                        connectOrCreate: {
                            where: { name: attendanceRecord.status }, // Try to connect if it exists
                            create: { name: attendanceRecord.status } // Otherwise, create a new status
                        }
                    },
                    updatedBy:{connect:{id:attendanceRecord.updatedById}}
               }
            });
            if(isSaved){
                return res.status(200).json({
                    success: true,
                    message: "Punch-out recorded successfully.",
                    data: isSaved,
                });
            }
        }
        // If both punch-in and punch-out are already recorded && {multi-punch=true}
        if(employee.employeeWorkDetail.officeTimePolicy.multiPunch){
            attendanceRecord.punchOutTime = currentTimestamp;

            let punchIn, punchOut;
            if(commonUtil.timeDurationInMinutes(employee.employeeWorkDetail.shift.startTime,moment(attendanceRecord.punchInTime).format("HH:mm"))<0)
            {
                punchIn = employee.employeeWorkDetail.shift.startTime;
            }
            else{
                punchIn = moment(attendanceRecord.punchInTime).format("HH:mm");
            }

            if(commonUtil.timeDurationInMinutes(employee.employeeWorkDetail.shift.endTime,moment(attendanceRecord.punchInTime).format("HH:mm"))>0){
                punchOut = employee.employeeWorkDetail.shift.endTime;
            }
            else{
                punchOut = moment(attendanceRecord.punchOutTime).format("HH:mm");
            }

            const totalMinutes = commonUtil.timeDurationInMinutes(punchIn,punchOut);

            //early departure penalty
            const response = helper.applyEarlyDeparturePenalty(employee,totalMinutes);
            console.log(response);
            if(response.isPenalized)
            {
                attendanceRecord.penalty = response;
                if(response.deduction>=0.5){
                    attendanceRecord.status = "P/2"
                }
                if(response.deduction===1){
                    attendanceRecord.status = "Absent"
                }
            }

            attendanceRecord.totalMinutes = totalMinutes;
            attendanceRecord.updatedById= employeeId;

            const isSaved = await prisma.attendance.update({
                where:{
                    id:attendanceRecord.id
                },
               data:{
                    punchOutTime:attendanceRecord.punchOutTime,
                    totalMinutes:attendanceRecord.totalMinutes,
                    penaltyIsPenalized:attendanceRecord.penalty?.isPenalized,
                    penaltyReason:attendanceRecord.penalty?.reason,
                    penaltyDeduction:attendanceRecord.penalty?.deduction,
                    status:{
                        connectOrCreate: {
                            where: { name: attendanceRecord.status }, // Try to connect if it exists
                            create: { name: attendanceRecord.status } // Otherwise, create a new status
                        }
                    },
                    updatedBy:{connect:{id:attendanceRecord.updatedById}}
               }
            })
            if(isSaved){
                console.log(attendanceRecord.toObject());

                return res.status(200).json({
                    success: true,
                    message: "Punch-out updated successfully.",
                    data: isSaved,
                });
            }
        }
        else{
            // If both punch-in and punch-out are already recorded && {multi-punch=false}
            return res.status(400).json({
                success: false,
                message: "Attendance already recorded for today.",
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while recording attendance.",
            error: error.message,
        });
    }
}

const recordAttendanceFromMachine = async(data)=>{
    try {
        const punchID = data.userId;
        const attTime = data.attTime;

        console.log(punchID, attTime);
        if(!punchID || !attTime){
            return {
                success:false,
                message:"Provide both parameters to the function, PunchID, attTime",
            }
        }

        const employee = await prisma.employee.findFirst({
            where:{biometricPunchId:punchID},
            select:{
                id:true,
                employeeCode:true,
                name:true,
                isActive:true,
                employeeWorkDetail:{
                    select:{
                        officeTimePolicy:true,
                        shift:true
                    }
                }
            }
        });
        // console.log("employee ",employee);
        // console.log("attTime  ",attTime);
        if(!employee){
            return {
            success:false,
                message:"This employee is currently not in the database.",
            }
        }
        if(!employee.isActive){
            return {
                success:false,
                message:"You are no longer active, hence your attendance is not marked.",
            };
        }
        
        const currentDate = new Date(moment(attTime).format("YYYY-MM-DD"));
        const currentTime = moment(attTime).format("HH:mm");
        const currTimeMin = commonUtil.timeDurationInMinutes('00:00',currentTime);

        if(currTimeMin < commonUtil.timeDurationInMinutes('00:00',employee.employeeWorkDetail.shift.maxEarlyAllowed)){
            // console.log(employee.shift.maxEarlyAllowed);
            // console.log(currTimeMin, commonUtil.timeDurationInMinutes('00:00',employee.shift.maxEarlyAllowed));
            return {
                success:false,
                message:"Punch-In too early, attendance not recorded."
            };
        }

        let attendanceRecord = await prisma.attendance.findFirst({
            where:{
                employeeId : employee.id,
                date :currentDate
            }
        });

        if(!attendanceRecord){
            attendanceRecord= {
                employeeId:employee.id,
                date:currentDate,
                punchInTime:attTime,
                status:"Present",
            };

            // console.log("new attendance record ",attendanceRecord);

            //check for time-policy
            let response = await helper.applyLateArrivalPenalty(employee,attTime);
            if(response==="success" && response.data!=null){
                attendanceRecord.penalty=response.data;
                if(response.data.deduction>=0.5){
                    attendanceRecord.status= "P/2"
                }
                if(response.data.deduction==1){
                    attendanceRecord.status = "Absent"
                }
            }
            else if(response.status==="error"){
                throw response.error
            }

            // console.log("attendance record before it is being saved.");
            const isSaved = await prisma.attendance.create({
                /////////////////////////////////////
                data:{
                    employee:{connect:{id:attendanceRecord.employeeId}},
                    date:attendanceRecord.date,
                    punchInTime:attendanceRecord.punchInTime,
                    penaltyIsPenalized:attendanceRecord.penalty?.isPenalized,
                    penaltyReason:attendanceRecord.penalty?.reason,
                    penaltyDeduction:attendanceRecord.penalty?.deduction,
                    status:{connect:{name:attendanceRecord.status}}
                }
            }) 
                            

            if(isSaved){
                // console.log("is Saved Data ",isSaved);
                return {
                    success:true,
                    message:`Punch-In Time for ${employee.name} Recorded Successfully!`,
                    data:isSaved
                }
            }
            else{
                console.log(isSaved);
                throw new Error("Couldn't Store Punch-In Record.")
            }
        }

        if(!attendanceRecord.punchOutTime){
            if(currTimeMin > commonUtil.timeDurationInMinutes('00:00',employee.employeeWorkDetail.shift.maxLateAllowed)){
                return {
                    success:false,
                    message:"Punch-Out too late, attendance not recorded. Contact your admin for support."
                };
            }
            attendanceRecord.punchOutTime = attTime;

            let punchIn, punchOut;
            if(commonUtil.timeDurationInMinutes(employee.employeeWorkDetail.shift.startTime,moment(attendanceRecord.punchInTime).format("HH:mm"))<0)
            {
                punchIn = employee.employeeWorkDetail.shift.startTime;
            }
            else{
                punchIn = moment(attendanceRecord.punchInTime).format("HH:mm");
            }

            if(commonUtil.timeDurationInMinutes(employee.employeeWorkDetail.shift.endTime,moment(attendanceRecord.punchOutTime).format("HH:mm"))>0){
                punchOut = employee.employeeWorkDetail.shift.endTime;
            }
            else{
                punchOut = moment(attendanceRecord.punchOutTime).format("HH:mm");
            }
            const totalMinutes = commonUtil.timeDurationInMinutes(punchIn,punchOut);
            
            attendanceRecord.totalMinutes = totalMinutes;
            attendanceRecord.updatedById= employee.id;   

            const updationData = {
                punchOutTime:attendanceRecord.punchOutTime,
                totalMinutes:attendanceRecord.totalMinutes,
                updatedBy:{connect:{id:attendanceRecord.updatedById}}
            };

            //early departure penalty
            const response = helper.applyEarlyDeparturePenalty(employee,totalMinutes);
            if(response.isPenalized)
            {
                attendanceRecord.penalty = response;
                if(response.deduction>=0.5){
                    attendanceRecord.status = "P/2"
                }
                if(response.deduction===1){
                    attendanceRecord.status = "Absent"
                }

                //now update the updation Data
                updationData.penaltyIsPenalized=attendanceRecord.penalty?.isPenalized;
                updationData.penaltyReason=attendanceRecord.penalty?.reason;
                updationData.penaltyDeduction=attendanceRecord.penalty?.deduction;

                if(attendanceRecord.status){
                    updationData.status={
                        connectOrCreate: {
                            where: { name: attendanceRecord?.status }, // Try to connect if it exists
                            create: { name: attendanceRecord?.status } // Otherwise, create a new status
                        }
                    }            
                }
            }

            const isSaved = await prisma.attendance.update({
                where:{id:attendanceRecord.id},
                data:updationData
            });
            if(isSaved){
                return {
                    success: true,
                    message: `Punch-out for ${employee.name} recorded successfully.`,
                    data: isSaved,
                };
            }
        }

        // If both punch-in and punch-out are already recorded && {multi-punch=true}
        if(employee.employeeWorkDetail.officeTimePolicy.multiPunch){
            if(currTimeMin > commonUtil.timeDurationInMinutes('00:00',employee.employeeWorkDetail.shift.maxLateAllowed)){
                return {
                    success:false,
                    message:"Punch-Out too late, attendance not recorded. Don't worry your previous punch-out is still with us."
                };
            }

            console.log("attendance REcord .............",attendanceRecord);

            attendanceRecord.punchOutTime = attTime;

            let punchIn, punchOut;
            if(commonUtil.timeDurationInMinutes(employee.employeeWorkDetail.shift.startTime,moment(attendanceRecord.punchInTime).format("HH:mm"))<0)
            {
                punchIn = employee.employeeWorkDetail.shift.startTime;
            }
            else{
                punchIn = moment(attendanceRecord.punchInTime).format("HH:mm");
            }

            if(commonUtil.timeDurationInMinutes(employee.employeeWorkDetail.shift.endTime,moment(attendanceRecord.punchInTime).format("HH:mm"))>0){
                punchOut = employee.employeeWorkDetail.shift.endTime;
            }
            else{
                punchOut = moment(attendanceRecord.punchOutTime).format("HH:mm");
            }

            const totalMinutes = commonUtil.timeDurationInMinutes(punchIn,punchOut);

            attendanceRecord.totalMinutes = totalMinutes;
            attendanceRecord.updatedById = employee.id;

            const updationData = {
                punchOutTime:attendanceRecord.punchOutTime,
                totalMinutes:attendanceRecord.totalMinutes,
                updatedBy:{connect:{id:attendanceRecord.updatedById}}

                // penaltyIsPenalized:attendanceRecord.penalty?.isPenalized,
                // penaltyReason:attendanceRecord.penalty?.reason,
                // penaltyDeduction:attendanceRecord.penalty?.deduction,
                // status:{
                //     connectOrCreate: {
                //         where: { name: attendanceRecord.status }, // Try to connect if it exists
                //         create: { name: attendanceRecord.status } // Otherwise, create a new status
                //     }
                // },
            };
            
            //early departure penalty
            const response = helper.applyEarlyDeparturePenalty(employee,totalMinutes);
            console.log(response);
            if(response.isPenalized){
                attendanceRecord.penalty = response;
                if(response.deduction>=0.5){
                    attendanceRecord.status = "P/2"
                }
                if(response.deduction===1){
                    attendanceRecord.status = "Absent"
                }
                
                //now update the updation Data
                updationData.penaltyIsPenalized=attendanceRecord.penalty?.isPenalized;
                updationData.penaltyReason=attendanceRecord.penalty?.reason;
                updationData.penaltyDeduction=attendanceRecord.penalty?.deduction;

                if(attendanceRecord.status){
                    updationData.status={
                        connectOrCreate: {
                            where: { name: attendanceRecord?.status }, // Try to connect if it exists
                            create: { name: attendanceRecord?.status } // Otherwise, create a new status
                        }
                    }            
                }
            }



            console.log("updation Data........",);
            console.log("employee.....",employee);
            const isSaved = await prisma.attendance.update({
                where:{id:attendanceRecord.id},
                data:updationData
                // {
                //     punchOutTime:attendanceRecord.punchOutTime,
                //     totalMinutes:attendanceRecord.totalMinutes,
                //     penaltyIsPenalized:attendanceRecord.penalty?.isPenalized,
                //     penaltyReason:attendanceRecord.penalty?.reason,
                //     penaltyDeduction:attendanceRecord.penalty?.deduction,
                //     status:{
                //         connectOrCreate: {
                //             where: { name: attendanceRecord?.status }, // Try to connect if it exists
                //             create: { name: attendanceRecord?.status } // Otherwise, create a new status
                //         }
                //     },
                //     updatedBy:{connect:{id:attendanceRecord.updatedById}}
                // }
            });
            if(isSaved){
                return {
                    success: true,
                    message: `Punch-out for ${employee.name} updated successfully.`,
                    data: isSaved,
                };
            }
        }
        else{
            // If both punch-in and punch-out are already recorded && {multi-punch=false}
            return {
                success: false,
                message: "Attendance already recorded for today.",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            success:false,
            message:"An error occured while recording attendance.",
            error:error.message
        };
    }
}

const viewAttendance = async(req,res)=>{
    try {
        // we can add more filters 
        // but check is 
        let {startDate,endDate,employeeCode,penaltyApplied}=req.body;

        startDate= startDate? new Date(moment(startDate).format("YYYY-MM-DD")) :false;
        endDate= endDate? new Date(moment(endDate).format("YYYY-MM-DD")) :false;
        
        const attendanceRecords = await prisma.attendance.findMany({
            where:{
                AND:[
                    (startDate && endDate) ? {date:{gte:startDate, lte:endDate}} : {},

                    (employeeCode) ? {employee:{employeeCode:employeeCode} } : {},

                    (penaltyApplied) ? {penaltyIsPenalized:penaltyApplied} : {}
                ]
            },
            select:{
                id:true,
                date:true,
                employee:{
                    select:{
                        name:true,
                        employeeCode:true,
                    }
                },
                punchInTime:true,
                punchOutTime:true,
                totalMinutes:true,
                status:{
                    select:{name:true}
                },
                penaltyDeduction:true,
                penaltyReason:true,
            }
        })


        if(attendanceRecords){

            const showableData = attendanceRecords.map((record)=>({
                attId:record.id,
                date:moment(record.date).format("YYYY-MM-DD"),
                empName:record.employee.name,
                employeeCode:record.employee.employeeCode,
                punchIn:moment(record.punchInTime).format("hh:mm ss A"),
                punchOut:moment(record.punchOutTime)?.format("hh:mm ss A"),
                working_Hrs:`${Math.floor(record.totalMinutes/60)} Hrs & ${record.totalMinutes%60} Minutes`,
                attStatus : record.status.name,
                penaltyReason:record.penaltyReason,
                penaltyDeduction:record.penaltyDeduction
            }));

            showableData.sort((a,b)=>(new Date(a.date) - new Date(b.date)))

            return res.status(200).json({
                success:true,
                message:"Attendance Data Found.",
                data:showableData
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"No Data Found",
            });
        }

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Couldn't show attendance.",
            error:error.message
        });
    }
}

module.exports ={
    recordOnlineAttendance,
    recordAttendanceFromMachine,
    viewAttendance
}