const prisma = require("../../config/prisma.config");

const moment = require("moment");
const xlsx = require("xlsx");


//calculates late time (difference between shift-time and punch-in time)
function calcLate(shiftStartTime,punchInTime){
    // console.log("shiftStartTime ",shiftStartTime);
    // console.log("punchInTime ",punchInTime);
    if(shiftStartTime=="" || (shiftStartTime instanceof Date))
    {return `00:00`}

    const shiftHr = parseInt(shiftStartTime.split(':')[0]);
    const shiftMin = parseInt(shiftStartTime.split(':')[1]);

    let isPM = punchInTime.slice(-2)==='PM'? true:false;
    let punchHr = parseInt(punchInTime.slice(0,5).split(':')[0]);
    let punchMin = parseInt(punchInTime.slice(0,5).split(':')[1]);

    if(isPM) {punchHr+=12};
    
    if(punchHr<shiftHr){
        return `00:00`
    }
    return `${punchHr-shiftHr}:${punchMin-shiftMin}`
}

const downloadDailyReport = async(req,res)=>{
    try {
        function writeDownloadBuffer(arr,reportType){
            const worksheet =xlsx.utils.json_to_sheet(arr);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook,worksheet,reportType);
        
            const myBuffer = xlsx.write(workbook,{bookType:'xlsx', type:'buffer'});
            const fileName = `${reportType}_Entries_${moment().format("DD-MM-YYYY hh:mm A")}.xlsx`;
            // console.log(fileName);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
            return myBuffer;
        }

        const {date,empArr,reportType}= req.body;
        
        if(!reportType && !empArr){
            return res.status(400).json({
                success:false,
                message:"Either Emp-Arr or Report-Type is required!"
            });
        }

        const currDate= date? new Date(moment(date).format("YYYY-MM-DD")) : new Date(moment().format("YYYY-MM-DD"));

        const responseRecord = await prisma.attendance.findMany({
            where:{date:currDate},
            select:{
                date:true,
                punchInTime:true,
                punchOutTime:true,
                totalMinutes:true,

                status:{
                    select:{name:true}
                },
                employee:{
                    select:{
                        id:true,
                        name:true,
                        employeeCode:true,
                        employeeWorkDetail:{
                            select:{
                                shift:{select:{startTime:true}},
                                department:{select:{department:true}}
                            }
                        }
                    }
                }
            }
        });
        
        //selected employee
        if(empArr && Array.isArray(empArr) && empArr.length!=0){

            const empData = await prisma.employee.findMany({
                where:{ isAdmin:false,
                        isActive:true
                     },
                select:{
                    id:true,
                    employeeCode:true,
                    name:true,
                    employeeWorkDetail:{
                        select:{
                            department:{select:{department:true}}
                        }
                    }
                    }
            });
            

            let generalData = responseRecord.filter((record) => {
                return empArr.some((emp) => {
                    return (emp.id === record.employee.id.toString())
                })});
            generalData = generalData.map((d)=> ({
                Emp_Code : d.employee.employeeCode,
                Name : d.employee.name,
                Department : d.employee.employeeWorkDetail.department.department,
                // Reporting_Manager : d.employeeId.reportingManager?.name || "",
                In_Time: moment(d.punchInTime).format("hh:mm A"),
                Status : 'Present'
            }));

            let genData = empData.filter((data) => {
                return empArr.some((emp) => {
                    return emp.id === data.id.toString()
                })});

            genData = genData.map((d)=> ({
                Emp_Code : d.employeeCode,
                Name : d.name,
                Department : d.employeeWorkDetail.department.department,
                // Reporting_Manager : d.reportingManager?.name || "",
                Status : 'Absent'
            }));

            const finalArr=[
                ...genData,
                ...generalData
            ];

            // return res.status(200).json({
            //     success:true,
            //     message:"Execution stopped here intentionally.",
            //     data:generalData
            // })            

            const myBuffer = writeDownloadBuffer(finalArr,'Selected');
            return res.status(200).send(myBuffer);

        }
        
        //present report
        if(responseRecord.length>0 &&(String(reportType).toLowerCase()==='present')){
            //logic to show present
            const presentData = responseRecord.map((record)=>{
                return {
                    empCode : record.employee.employeeCode,
                    name : record.employee.name,
                    department : record.employee.employeeWorkDetail.department.department,
                    // reportingManager : record.employee.reportingManager.name,
                    inTime: moment(record.punchInTime).format("hh:mm A"), //startTime
                    lateTime: calcLate((record.employee.employeeWorkDetail.shift?.startTime || ""),moment(record.punchInTime).format("hh:mm A")),
                    outTime: record.punchOutTime ? moment(record.punchOutTime).format("hh:mm A") : "NA",
                    workingHour : `${String(Math.floor(record.totalMinutes/60)).padStart(2,'0')}:${String(record.totalMinutes%60).padStart(2,'0')}`
                }
            });

            // return res.status(200).json({
            //     success:true,
            //     message:"Execution stopped here intentionally.",
            //     data:presentData
            // })

            const myBuffer = writeDownloadBuffer(presentData,reportType);
            return res.status(200).send(myBuffer);
        }
       
        //absent report
        if(String(reportType).toLowerCase()==='absent'){

            const empData = await prisma.employee.findMany({
                where:{ isAdmin:false,
                        isActive:true
                     },
                select:{
                    employeeCode:true,
                    name:true,
                    employeeWorkDetail:{
                        select:{
                            department:{select:{department:true}}
                        }
                    }
                    }
            });
            const absentData = empData.filter((emp)=>{
                return !responseRecord.some(record=> {return record.employee.employeeCode===emp.employeeCode})
            });

            const absentArr = absentData.map((d)=>({
                Emp_Code : d.employeeCode,
                Name : d.name,
                Department : d.employeeWorkDetail.department.department,
                // Reporting_Manager : d.reportingManager?.name || "",
                Status : 'Absent'
            }));

            // return res.status(200).json({
            //     success:true,
            //     message:"Execution stopped here intentionally.",
            //     data:absentArr
            // })

            const myBuffer = writeDownloadBuffer(absentArr,reportType);
            return res.status(200).send(myBuffer);
        }

        //mispunch report
        if(String(reportType).toLowerCase()==='mispunch'){
            // console.log("In Mispunch ")
            const misPunchData = responseRecord.filter((record)=> !record.punchOutTime);

            const misPunchArr = misPunchData.map((record)=>({
                Emp_Code : record.employee.employeeCode,
                Name : record.employee.name,
                Department : record.employee.employeeWorkDetail.department?.department || "",
                // Reporting_Manager : record.employeeId.reportingManager?.name || "",
                In_Time: moment(record.punchInTime).format("hh:mm A"),
                Out_Time : "",
                Status : 'Mis-Punch'
            }));

            // return res.status(200).json({
            //     success:true,
            //     message:"Execution stopped here intentionally.",
            //     data:misPunchArr
            // })

            const myBuffer = writeDownloadBuffer(misPunchArr,reportType);
            return res.status(200).send(myBuffer);
        }

        return res.status(400).json({
            success:false,
            message:"No Record Found",
            data:responseRecord
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Could Not Download.",
            error:error.message
        });
    }
}

module.exports={
    downloadDailyReport
}