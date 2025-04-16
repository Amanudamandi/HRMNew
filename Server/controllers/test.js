const prisma = require("../config/prisma.config");

const tester = async(employeeId)=>{


    const employee = await prisma.employee.findFirst({
        where:{id:employeeId},
        select:{
            isActive:true,
            employeeWorkDetail:{
                select:{
                    officeTimePolicy:{
                        select:{}
                    },
                    shift:true
                }
            }
        }
    });

    console.log(employee);
}

module.exports=tester;



