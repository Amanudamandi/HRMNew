const moment = require("moment");
const helper = require("../utils/common.util");
const prisma = require("../config/prisma.config");


const applyLateArrivalPenalty = async(employee,punchInTime)=>{
    try {
        const employeeId = employee.id;
        const shiftStart = employee.employeeWorkDetail.shift.startTime;
        const officePolicy = employee.employeeWorkDetail.officeTimePolicy;
        const permittedLateArrival = officePolicy.permittedLateArrival;
        
        // Convert times to minutes
        const punchInMinutes = moment(punchInTime).hours() * 60 + moment(punchInTime).minutes();
        const shiftStartMinutes = moment(shiftStart, "HH:mm").hours() * 60 + moment(shiftStart, "HH:mm").minutes();
        const allowedLateMinutes = moment(permittedLateArrival, "HH:mm").hours() * 60 + moment(permittedLateArrival, "HH:mm").minutes();
    
        // Get late days count in the current month
        const firstDayOfMonth = moment(punchInTime).startOf("month").toDate();
        // const lastDayOfMonth = moment(punchInTime).endOf("month").toDate();
        const lastDayOfMonth = punchInTime;

        // If punch-in is beyond the allowed late arrival time
        if (punchInMinutes > (shiftStartMinutes + allowedLateMinutes)) {
            let deduction = 0;
            let reason = "Late Arrival";

            if (!officePolicy.lateComingRule) {
                if ((officePolicy.lateArrival1) && (punchInMinutes > (shiftStartMinutes + (moment(officePolicy.lateArrival1, "HH:mm").hours() * 60) + moment(officePolicy.lateArrival1, "HH:mm").minutes()))) {
                    deduction = parseFloat(officePolicy.dayDeduct1/100);
                }
                if ((officePolicy.lateArrival2)&&(punchInMinutes > (shiftStartMinutes + (moment(officePolicy.lateArrival2, "HH:mm").hours() * 60) + moment(officePolicy.lateArrival2, "HH:mm").minutes()))) {
                    deduction = parseFloat(officePolicy.dayDeduct2/100);
                }
                if ((officePolicy.lateArrival3)&&(punchInMinutes > (shiftStartMinutes + (moment(officePolicy.lateArrival3, "HH:mm").hours() * 60) + moment(officePolicy.lateArrival3, "HH:mm").minutes()))) {
                    deduction = parseFloat(officePolicy.dayDeduct3/100);
                }
                if ((officePolicy.lateArrival4)&&(punchInMinutes > (shiftStartMinutes + (moment(officePolicy.lateArrival4, "HH:mm").hours() * 60) + moment(officePolicy.lateArrival4, "HH:mm").minutes()))) {
                    deduction = parseFloat(officePolicy.dayDeduct4/100);
                }
            } else {
                    // const lateDaysThisMonth = await prisma.attendance.count({
                    //     where:{
                    //         employeeId,
                    //         date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
                    //         punchInTime: { 
                    //             // gt: moment(shiftStart, "HH:mm").add(allowedLateMinutes, "minutes").toDate() 
                    //             // moment(punchInTime) > moment(`${moment(punchInTime).format("YYYY-MM-DD")} ${shiftStart}`).add(allowedLateMinutes, "minutes").toDate()
                    //         }
                    //     }
                    // });

                    const allPunchesThisMonth = await prisma.attendance.findMany({
                        where:{
                            employeeId,
                            date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
                        },
                        select:{
                            punchInTime:true
                        }
                    });
                    // console.log("All Punch this month ",allPunchesThisMonth.length);

                    // return;

                    const lateDaysThisMonth = allPunchesThisMonth.filter(({ punchInTime }) => {
                        const punchDate = moment(punchInTime).format("YYYY-MM-DD");
                        const lateThreshold = moment(`${punchDate} ${shiftStart}`, "YYYY-MM-DD HH:mm")
                          .add(allowedLateMinutes, "minutes")
                          .toDate();
                      
                        return punchInTime > lateThreshold;
                    }).length;

                    // console.log("lateDaysThisMonth   ",lateDaysThisMonth);

                if (lateDaysThisMonth > officePolicy.allowedLateDaysInMonth){
                    if(officePolicy.continuous){
                        deduction = parseFloat(officePolicy.salaryCutPercentage/100);
                        reason = "Excessive Late Arrivals";
                    }
                    else if(lateDaysThisMonth % officePolicy.allowedLateDaysInMonth == 1){
                        deduction = parseFloat(officePolicy.salaryCutPercentage/100);
                        reason = "Excessive Late Arrivals";
                    }
                }
            }
            let isPenalized = deduction>0 ? true:false;

            return {
                status:"success",
                message: "Penalty Applicable",
                data :{
                    isPenalized:isPenalized,
                    deduction:deduction,
                    reason:reason
                }
            }
        }
        return {
            status:"success",
            message: "No Penalty",
            data : null
        }
    } catch (error) {
        return {
            status:"error",
            message: "An error occured while evaluating penalty",
            error:error,
        }
    }
}

const applyEarlyDeparturePenalty = (employee,totalWorkedMinutes)=>{
    // const employeeId = employee._id;
    const officePolicy = employee.employeeWorkDetail.officeTimePolicy;

    // Convert pByTwo & absent thresholds to minutes
    const pByTwoMinutes = helper.timeDurationInMinutes('00:00',officePolicy.pByTwo);
    const absentMinutes = helper.timeDurationInMinutes('00:00',officePolicy.absent);

    let deduction = 0;
    let reason = "";

    if (totalWorkedMinutes < absentMinutes) {
        deduction = 1; // Mark as absent (1 full-day deduction)
        reason = "Marked as Absent due to Early Departure";
    } else if (totalWorkedMinutes < pByTwoMinutes) {
        deduction = 0.5; // Mark as half-day (0.5 deduction)
        reason = "Marked as Half-Day due to Early Departure";
    }

    let isPenalized = deduction > 0 ? true: false;
    return {
        isPenalized,
        deduction:deduction,
        reason
    };
}

const recalculateAttendance = async(policyId)=>{
    try {
        if(!policyId){
            return {
                success:false,
                message:"Policy Id is needed to recalculate the attendance."
            }
        }
        const whereCondition = { ...(policyId?{officeTimePolicyId:policyId}:{})}

        //find all employees associated with the policy 
        const employees = await prisma.emp_work_detail.findMany({
            where:whereCondition,
            select:{employeeId:true}
        });
        // console.log(employees);

        const employeeIdArr = employees.map((d)=>d.employeeId);
        // console.log(employeeIdArr);

        // find the attendance of those associated employees
        const attendanceRecords = await prisma.attendance.findMany({
            where:{employeeId:{in:employeeIdArr}},
            select:{
                id:true,
                date:true,
                punchInTime:true,
                punchOutTime:true,
                totalMinutes:true,
                penaltyIsPenalized:true,
                penaltyDeduction:true,
                penaltyReason:true,
                status:true,
                employee:{
                    select:{
                        id:true,
                        name:true,
                        employeeWorkDetail:{
                            select:{
                                shift:true,
                                officeTimePolicy:true
                            }
                        }
                    }
                },
            }
        });

        const updates=[];
        for(let record of attendanceRecords){
            let newPenalty= { isPenalized: false, reason: "", deduction: 0 };
            let newStatus="Present";

            //---------------------x checking and applying late arrival penalty x--------------
            let response=await applyLateArrivalPenalty(record.employee,record.punchInTime);
            if(response.status==="success" && response.data!=null){
                newPenalty = response.data;
                if(response.data.deduction>=0.5){
                    newStatus = "P/2"
                }
                if(response.data.deduction===1){
                    newStatus = "Absent"
                }
            }
            else if(response.status==="error"){
                throw response.error
            }

            //---------------------x checking and applying early departure penalty x------------
            if(record.punchOutTime){
                let punchIn, punchOut;
                if(helper.timeDurationInMinutes(record.employee.employeeWorkDetail.shift.startTime,moment(record.punchInTime).format("HH:mm"))<0)
                {
                    punchIn = record.employee.employeeWorkDetail.shift.startTime;
                }
                else{
                    punchIn = moment(record.punchInTime).format("HH:mm");
                }
    
                if(helper.timeDurationInMinutes(record.employee.employeeWorkDetail.shift.endTime,moment(record.punchOutTime).format("HH:mm"))>0){
                    punchOut = record.employee.employeeWorkDetail.shift.endTime;
                }
                else{
                    punchOut = moment(record.punchOutTime).format("HH:mm");
                }
                const totalMinutes = helper.timeDurationInMinutes(punchIn,punchOut);

                let nextResponse = applyEarlyDeparturePenalty(record.employee,totalMinutes);
                if(nextResponse.isPenalized)
                {
                    newPenalty = nextResponse;
                    if(nextResponse.deduction>=0.5){
                        newStatus = "P/2"
                    }
                    if(nextResponse.deduction===1){
                        newStatus = "Absent"
                    }
                }     
            }
            //Update only if penalty has changed, if changes found, then push them to updates arr.
            if (
                newPenalty.isPenalized !== record.penaltyIsPenalized ||
                newPenalty.reason !== record.penaltyReason ||
                newPenalty.deduction !== Number(record.penaltyDeduction) ||
                newStatus !== record.status.name
            ){
                //push into updates
                updates.push({
                    id:record.id,
                    newPenalty:newPenalty,
                    newStatus:newStatus,
                });
            }
        }
        console.log("update arr length ",updates.length);

        if(updates.length>0){

            const updateTransaction = await prisma.$transaction(
                updates.map(update => (
                    prisma.attendance.update({
                        where:{id:update.id},
                        data:{
                           penaltyIsPenalized:update.newPenalty.isPenalized,
                           penaltyDeduction:update.newPenalty.deduction,
                           penaltyReason:update.newPenalty.reason,
                           status:{
                                connectOrCreate:{
                                    where:{name:update.newStatus},
                                    create:{name:update.newStatus}
                                }
                           }
                        }
                    })
                ))
            );

            if(updateTransaction){
                return {
                    success:true,
                    message:"Attendance Recalculation & Updation Transaction Completed Successfully.",
                    count:updates.length
                }
            }
            else{
                return {
                    success:false,
                    message:"Attendance Recalculation Transaction Failed."
                }
            }
        }

        return {
            success:true,
            message:"Attendance Recalculation & Updation Transaction Completed Successfully.",
            count:updates.length
        }
    } catch (error) {
        console.log(error);
        throw new Error(`Recalculation failed: ${error.message}`);
    }
}

//---------------------unit testing of late arrival penalty---------------------
// const attTime=new Date();
// console.log("Time Right Now = ",moment(attTime).format("hh:mm A"))
// // "2025-03-27T05:21:49.000Z"
// applyLateArrivalPenalty(employee,attTime)
// .then(data=> console.log(data))
// .catch(err=> console.log("Error handled ",err))


//------------------------unit testing for attendance recalculation--------------
// const policyId = "06015286-b7d1-4ce6-8cbf-0d135a525f5c";
// ;(
//     async()=>{
//         console.log(await recalculateAttendance(policyId));
//     }
// )()

module.exports = {
    applyLateArrivalPenalty,
    applyEarlyDeparturePenalty,
    recalculateAttendance
}
