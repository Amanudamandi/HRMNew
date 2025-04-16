const prisma = require("../../config/prisma.config");
const bcrypt = require("bcrypt");
const {createAccessToken,createRefreshToken} = require("../../utils/tokenGeneration");

const addAdmin = async(req,res)=>{
    try {
        const {employeeCode,password,name}= req.body;

        const requiredFields = [
            "employeeCode","password","name"
        ];
        const missingFields = requiredFields.filter((field)=>(!req.body[field]));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following fields are required ${missingFields.join(", ")}.`
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newAdmin = await prisma.employee.create({
            data:{
                name,
                employeeCode,
                password:hashedPassword,
                isAdmin:true
            }
        })

        if(newAdmin){
            return res.status(200).json({
                success:true,
                message:"New Admin Created Successfully!",
                data:newAdmin
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Unable to create a new admin."
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Couldn't Add an Admin.",
            error:error.message
        });
    }
}

//incomplete login
const login= async(req,res)=>{
    try {
        let {employeeCode, password}= req.body;
        
        employeeCode=String(employeeCode).trim();
        password=String(password).trim();
        if(!employeeCode || !password){
            return res.status(400).json({
                success:false,
                message : "Both employee code and password are required!"
            });
        }

        const empData= await prisma.employee.findUnique({
            where:{employeeCode:employeeCode},
            // include:{employeeWorkDetail:true}
            select:{
                id:true,
                name:true,
                employeeCode:true,
                password:true,
                isActive:true,
                isAdmin:true,
                employeeWorkDetail:{
                    select:{
                        department:true,
                        designation:true
                    }
                }
            }
        });

        // console.log("empData....",empData);

        if(!empData){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials! Wrong or Invalid Employee Code.."
            })
        }


        //don't check emp is admin right now

        //but perform other checks
        const isMatch = await bcrypt.compare(password,empData.password);
        // console.log(isMatch);
        if(!isMatch){
            return res.status(401).json({
                success : false,
                message : "Invalid credentials! Wrong Password."
            });
        }

        if(!empData.isActive){
            return res.status(400).json({
                success : false,
                message : "Your account is no longer active, and login is not permitted."
            });
        }

        const options ={
            withCredentials:true,
            httpOnly:true,
            secure:false
        };
        const accessTokenData= {
            id:empData.id,
            employeeCode:empData.employeeCode,
            // isAdmin:empData.isAdmin,
            // role: isAdmin? "Admin" : empData.department.department
            role: empData.isAdmin ? "Admin" : empData.employeeWorkDetail.department.department
        }
        const accessToken = createAccessToken(accessTokenData);
        const refreshToken = createRefreshToken(empData.employeeCode);

        // const setRefreshToken = await Employee.findByIdAndUpdate(empData._id,{refreshToken:refreshToken},{new:true});
        const setRefreshToken = await prisma.employee.update({
            where: { id: empData.id },
            data: { refreshToken: refreshToken },
          });
        if(!setRefreshToken){
            return res.status(401).json({
                success:false,
                message: "Login Failed! Please Try Again"
            });
        }

        return res.status(200)
        .cookie("accessToken",`Bearer ${accessToken}`,options)
        .cookie("refreshToken",`Bearer ${refreshToken}`,options)
        .json({
            success:true,
            message:"Login Successful",
            data : {
                employeeCode : empData.employeeCode,
                name : empData.name,
                isAdmin : empData.isAdmin
            }
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error, Couldn't Login.",
            error : error.message
        });
    }
}

const logout = async(req,res)=>{
    try {
        const employeeId =  req.employeeId;
        console.log(employeeId)
        const empLogout = await prisma.employee.update({
            where: { id: employeeId },
            data: { refreshToken: null },
          });

        if(empLogout){
            const options ={
                withCredentials:true,
                httpOnly:true,
                secure:false
            }
        
            return res
            .status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json({
                success:true,
                message:"User Logged Out"
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message: "Logout Failed! Please Try Again"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error, Couldn't Logout.",
            error : error.message
        });
    }
}

const registerEmp = async(req,res)=>{
    try {
        const employeeId = req.employeeId;
        
        const {
            joiningFormId,
            name,
            employeeCode,
            biometricPunchId,

            reportingManagerId,
            shiftId,
            officeTimePolicyId,
            branchId,
            workTypeId,
        }= req.body;

        const requiredFields=[
            "joiningFormId",
            "name",
            "employeeCode",
            "biometricPunchId",

            "reportingManagerId",
            "shiftId",
            "officeTimePolicyId",
            "branchId",
            "workTypeId",
        ];
        const missingFields = requiredFields.filter((field)=>(!req.body[field]));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following fields are missing : ${missingFields.join(", ")}`
            });
        }

        //pre-registration validations
        //is joininig form approved
        const isApproved = await prisma.joining_form.findFirst({
            where:{id:joiningFormId},
            select:{
                status:true
            }
        });
        if(!isApproved || isApproved.status!=="Approved"){
            return res.status(400).json({
                success:false,
                message:"Joining is not yet approved."
            });
        }

        //is joiningForm already used in employee -- testing only
        const isAlreadyUsedJoiningForm = await prisma.employee.findUnique({
            where:{joiningFormId:joiningFormId}
        });

        if(isAlreadyUsedJoiningForm){
            return res.status(400).json({
                success:false,
                message:"Joining Form id Already used.",
                data:isAlreadyUsedJoiningForm
            });
        }
        
        //is exist with same employee-id or punch-id
        const isAlreadyRegistered = await prisma.employee.findFirst({
            where:{
                OR:[
                    {employeeCode:employeeCode},
                    {biometricPunchId:biometricPunchId}
                ]
            },
            select:{
                employeeCode:true,
                biometricPunchId:true
            }
        });
        if(isAlreadyRegistered){
            return res.status(400).json({
                success:false,
                message:"Employee already registered with same employee-code or biometric-punch-id.",
                data:isAlreadyRegistered
            });
        }

        //create employee-id
        //update - provide the employee-id wherever needed in related table.
        //update the related ids in employee table.
        const hashedPassword = await bcrypt.hash(employeeCode,10);

        const createNewEmp = await prisma.employee.create({
            data:{
                name,
                employeeCode,
                password:hashedPassword,
                biometricPunchId,
                joiningFormId,
                updatedById:employeeId
            }
        });

        const relatingJoiningForm = await prisma.joining_form.update({
            where:{id:joiningFormId},
            data:{
                candidatePersonalDetail: {
                    update: { employeeId: createNewEmp.id }
                },
                candidateBankDetail: {
                    update: { employeeId: createNewEmp.id }
                },
                candidateAttachmentDetail: {
                    update: { employeeId: createNewEmp.id }
                },
                candidateSalaryDetail: {
                    update: { employeeId: createNewEmp.id }
                },
                candidateWorkDetail: {
                    update: { 
                        employeeId: createNewEmp.id,
                        reportingManagerId,
                        shiftId,
                        officeTimePolicyId,
                        branchId,
                        workTypeId,
                     }
                }
            },
            select:{
                candidatePersonalDetail:{select:{id:true}},
                candidateBankDetail:{select:{id:true}},
                candidateAttachmentDetail:{select:{id:true}},
                candidateSalaryDetail:{ select:{id:true}},
                candidateWorkDetail:{ select:{id:true}},
            }
        });

        const relatingEmployee = await prisma.employee.update({
            where:{id:createNewEmp.id},
            data:{
                employeePersonalDetailId:relatingJoiningForm.candidatePersonalDetail.id,
                employeeBankDetailId:relatingJoiningForm.candidateBankDetail.id,
                employeeAttachmentDetailId:relatingJoiningForm.candidateAttachmentDetail.id,
                employeeWorkDetailId:relatingJoiningForm.candidateWorkDetail.id,
                employeeSalaryDetailId:relatingJoiningForm.candidateSalaryDetail.id,
            },
            select:{
                id:true,
                name:true,
                employeeCode:true,
                isActive:true,
                biometricPunchId:true
            }
        });


        if(relatingEmployee){
            return res.status(200).json({
                success:true,
                message:"Employee Registered Successfully !",
                data:relatingEmployee
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Employee Not Registered!",
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Employee Not Registered!",
            error:error.message
        });
    }
}

const showEmployee = async(req,res)=>{
    try {
        const {id}= req.query;
        // const whereCondition = {
        //     ...(id ? {id}:{})
        // };

        if(id){
            const empDetail=await prisma.employee.findFirst({
                where:{id},
                select:{
                    id:true,
                    name:true ,
                    employeeCode:true,
                    biometricPunchId:true,
                    joiningFormId:true,

                    employeePersonalDetail:true,
                    employeeBankDetail:true,
                    employeeAttachmentDetail:true,
                    employeeSalaryDetail:true,
                    employeeWorkDetail:{
                        select:{
                            company:{select:{name:true}},
                            branch:{select:{
                                name:true,
                                address:true,
                                pin:true
                            }},
                            department:{select:{department:true}},
                            designation:{select:{name:true}},
                            companyPhoneNum:true,
                            companyEmail:true,
                            joiningDate:true,

                            qualification:{select:{name:true}},
                            degree:{select:{name:true}},

                            reportingManager:{select:{name:true}},
                            joiningHr:{select:{name:true}},
                            officeTimePolicy:{select:{policyName:true}},
                            shift:{select:{name:true}},
                            workType:{select:{workType:true}},

                            lastAppraisalDate:true,
                            regisnationDate:true,
                        }
                    }
                }
            });
            // console.log(empDetail)
            if(empDetail){
                return res.status(200).json({
                    success:true,
                    message:"Employee Detail",
                    data:empDetail
                })
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Unable to fetch employee data using Id"
                })
            }
        }


        const allEmp = await prisma.employee.findMany({
            where:{
                isActive:true,
            },
            select:{
                id:true,
                name:true ,
                employeeCode:true,
                biometricPunchId:true,
                employeeWorkDetail:{
                    select:{
                        company:{select:{name:true}},
                        department:{select:{department:true}},
                        designation:{select:{name:true}},
                        reportingManager:{select:{name:true}}
                    }
                }
            }
        });

        if(allEmp){
            return res.status(200).json({
                success:true,
                message:"List of all Employees",
                data:allEmp
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Unable to fetch employee data"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! No Employee Data",
            error:error.message
        })
    }
}

const showJoiningHr = async(req,res)=>{
    try {
        //use admin id to join the first hr, else normal HRs.
        const allHr = await prisma.employee.findMany({
            where:{
                employeeWorkDetail:{
                    department:{
                        department:"HR"
                    }
                }
            },
            select:{
                id:true,
                name:true,
                employeeCode:true
            }
        });
        console.log(allHr);
        if(allHr.length===0){
            const useAdmin = await prisma.employee.findUnique({
                where:{employeeCode:"ADMIN-001"},
                select:{
                    id:true,
                    name:true,
                    employeeCode:true
                }
            });
            if(useAdmin){
                return res.status(200).json({
                    success:true,
                    message:"Admin Data",
                    data:[useAdmin]
                })
            }
            else{
                return res.status(400).json({
                    success:true,
                    message:"Couldn't find HR data.",
                })
            }
        }
        else{
            return res.status(200).json({
                success:true,
                message:"List of all the current HR",
                data:allHr
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Can't find hr data",
            error:error.message
        })
    }
}

const updateEmpPersonalData = async(req,res)=>{
    try {
        const employeeId = req.employeeId;

        const {
            employeeID,
            name,
            father_husbandName,
            dateOfBirth,
            gender,
            maritalStatus,
            bloodGroup,
            personalPhoneNumber,
            personalEmail,
            currentAddress,
            currentState,
            currentCity,
            currentPinCode,
            permanentAddress,
            permanentState,
            permanentCity,
            permanentPinCode,
            panCard,
            aadharCard,
            emergencyContact,
        }=req.body;

        const requiredFields = [
            "employeeID","name","father_husbandName","dateOfBirth","gender",
            "maritalStatus","bloodGroup","personalPhoneNumber","personalEmail",
            "currentAddress","currentState","currentCity","currentPinCode",
            "permanentAddress","permanentState","permanentCity","permanentPinCode",
            "panCard","aadharCard","emergencyContact"
        ];
        const missingFields=requiredFields.filter((field)=>(!req.body[field]));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following fields are missing: ${missingFields.join(", ")}`
            });
        }

        //check for aadhar and pan uniqueness
        //perform type-validation checks for phone, aadhar,bankAccount and pan
        if(personalPhoneNumber.length!==10 || !Number.isInteger(Number(personalPhoneNumber))){
            return res.status(400).json({
                success:false,
                message:"Invalid Phone-Number Format"
            });
        }
        if(aadharCard.length!==12 || !Number.isInteger(Number(aadharCard))){
            return res.status(400).json({
                success:false,
                message:"Invalid Aadhar-Card Format"
            });
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const isValidPAN = (pan) => panRegex.test(pan);
        if(!isValidPAN(panCard)){
            return res.status(400).json({
                success:false,
                message:"Invalid Pan-Card Format"
            });
        }

        const pincodeRegex = /^[1-9][0-9]{5}$/;
        if(!pincodeRegex.test(currentPinCode) || !pincodeRegex.test(permanentPinCode)){
            return res.status(400).json({
                success:false,
                message:"Incorrect Pincode Format."
            });
        }

        //dateOfBirth
        let correctDateofBirth;
        if(!(dateOfBirth instanceof Date)){ 
            correctDateofBirth = new Date(dateOfBirth);
        }
        else{
            correctDateofBirth=dateOfBirth;
        }
        if(isNaN(correctDateofBirth.getTime())){
            return res.status(400).json({
                success:false,
                message:"You messed up with the date-string of dateOfBirth."
            });
        }

        //check if employeeExists or not
        const isValidEmployee = await prisma.emp_personal_detail.findFirst({
            where:{employeeId:employeeID}
        });
        if(!isValidEmployee){
            return res.status(400).json({
                success:false,
                message:"The employee you want to update does not exist in the database. Please check the employeeID you are sending."
            });
        }

        const selfId = isValidEmployee.id;
        //check if panCard, aadharCard, phoneNumber exists or not.
        const doesPhoneNumExists = await prisma.emp_personal_detail.findFirst({
            where:{
                personalPhoneNum:personalPhoneNumber,
                NOT:{id:selfId}
            }
        });
        if(doesPhoneNumExists){
            console.log("Phone Num Already Exists");
            return res.status(400).json({
                success:false,
                message:`Someone '${doesPhoneNumExists.name}' is already using this phone number as personal contact. Contact Admin.`
            });
        }

        const doesAadharExists = await prisma.emp_personal_detail.findFirst({
            where:{
                aadharCard:aadharCard,
                NOT:{id:selfId}
            }
        });
        if(doesAadharExists){
            console.log("Aadhar Already Exists");
            return res.status(400).json({
                success:false,
                message:`Someone '${doesAadharExists.name}' is already using this Aadhar-Card. Contact Admin.`
            });
        }

        const doesPancardExists = await prisma.emp_personal_detail.findFirst({
            where:{
                panCard:panCard,
                NOT:{id:selfId}
            }
        });
        if(doesPancardExists){
            console.log("Aadhar Already Exists");
            return res.status(400).json({
                success:false,
                message:`Someone '${doesPancardExists.name}' is already using this Pan-Card. Contact Admin.`
            });
        }

        //update the data
        const isUpdated = await prisma.emp_personal_detail.update({
            where:{employeeId:employeeID},
            data:{
                name,
                father_husbandName,
                dateOfBirth:correctDateofBirth,
                personalPhoneNum:personalPhoneNumber,
                personalEmail,
                panCard,
                aadharCard,
                gender,
                maritalStatus,
                bloodGroup,
                emergencyContact,
                currentAddress:{
                    address:currentAddress,
                    city:currentCity,
                    state:currentState,
                    pincode:currentPinCode
                },
                permanentAddress:{
                    address:permanentAddress,
                    city:permanentCity,
                    state:permanentState,
                    pincode:permanentPinCode
                },

                updatedById:employeeId
            }
        });

        if(isUpdated){
            return res.status(200).json({
                success:true,
                message:"Employee's Personal Data Updated Successfully!",
                data:isUpdated
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Employee's personal data couldn't be updated."
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error ! Couldn't update employee's personal data.",
            error:error.message
        });
    }
}

module.exports={
    addAdmin,
    login,
    logout,
    registerEmp,
    showEmployee,
    showJoiningHr,
    updateEmpPersonalData
}

/*

"employeeID":"",
"name":"",
"father_husbandName":"",
"dateOfBirth":"",
"gender":"",
"maritalStatus":"",
"bloodGroup":"",
"personalPhoneNumber":"",
"personalEmail":"",
"currentAddress":"",
"currentState":"",
"currentCity":"",
"currentPinCode":"",
"permanentAddress":"",
"permanentState":"",
"permanentCity":"",
"permanentPinCode":"",
"panCard":"",
"aadharCard":"",
"emergencyContact":"",

*/