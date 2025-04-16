const prisma = require("../../config/prisma.config");
const {joining_form_status} = require("@prisma/client");
const handleBase64Images = require("../../middlewares/base64ImageHandler");
const { fields } = require("../../middlewares/multer.middleware");

const addJoiningForm = async(req,res)=>{
    try {
        const {
            name,
            father_husbandName,
            dateOfBirth,
            gender,
            maritalStatus,
            bloodGroup,
            personalPhoneNum,
            personalEmail,
            currentAddress,
            currentState,
            currentCity,
            currentPinCode,
            permanentAddress,
            permanentState,
            permanentCity,
            permanentPinCode,

            bankName,
            branchName,
            bankAccount,
            bankIFSC,
            bankAccountHolderName,
            bankAddress,
            panCard,
            aadharCard,
            uanNumber,
            emergencyContact,
            aadharCardAttachment,
            panCardAttachment,
            bankAttachment,
            photoAttachment,
            signatureAttachment,
            class10Attachment,
            class12Attachment,
            graduationAttachment,
            postGraduationAttachment,
        }=req.body;

        const requiredFields =[
            "name",
            "father_husbandName",
            "dateOfBirth",
            "gender",
            "maritalStatus",
            "bloodGroup",
            "personalPhoneNum",
            "personalEmail",
            "currentAddress",
            "currentState",
            "currentCity",
            "currentPinCode",
            "permanentAddress",
            "permanentState",
            "permanentCity",
            "permanentPinCode",

            "bankName",
            "branchName",
            "bankAccount",
            "bankIFSC",
            "bankAccountHolderName",
            "bankAddress",
            "panCard",
            "aadharCard",
            // "uanNumber",
            "emergencyContact",
            // "aadharCardAttachment",
            // "panCardAttachment",
            // "bankAttachment",
            "photoAttachment",
            "signatureAttachment",
            // "class10Attachment",
            // "class12Attachment",
            // "graduationAttachment",
            // "postGraduationAttachment",
        ];
        const missingFields = requiredFields.filter((field)=>(!req.body[field]));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following fields are missing : ${missingFields.join(", ")}`
            });
        }

        //perform type-validation checks for phone, aadhar,bankAccount and pan
        if(personalPhoneNum.length!==10 || !Number.isInteger(Number(personalPhoneNum))){
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

        if(!Number.isInteger(Number(bankAccount))){
            return res.status(400).json({
                success:false,
                message:"Invalid Bank-Account Format"
            });
        }
        //check for unique credentials
        //phone num, aadhar, pan, bank
        const doesPhoneNumExists = await prisma.joining_form.findFirst({
            where:{
                candidatePersonalDetail:{personalPhoneNum:personalPhoneNum},
                status:{not:joining_form_status.Rejected}
            },
            include:{candidatePersonalDetail:true}
        });
        if(doesPhoneNumExists){
            console.log("Phone Num Already Exists");
            return res.status(400).json({
                success:false,
                message:"Joining form already submitted with same Phone Num details. Contact your HR"
            });
        }

        const doesAadharExists = await prisma.joining_form.findFirst({
            where:{
                candidatePersonalDetail:{aadharCard:aadharCard},
                status:{not:joining_form_status.Rejected}
            },
            include:{candidatePersonalDetail:true}
        });
        if(doesAadharExists){
            console.log("aadhar Card Already Exists");
            return res.status(400).json({
                success:false,
                message:"Joining form already submitted with same aadhar details. Contact your HR"
            });
        }

        const doesPanExists = await prisma.joining_form.findFirst({
            where:{
                candidatePersonalDetail:{panCard:panCard},
                status:{not:joining_form_status.Rejected}
            },
            include:{candidatePersonalDetail:true}
        });
        if(doesPanExists){
            console.log("pan Card Already Exists");
            return res.status(400).json({
                success:false,
                message:"Joining form already submitted with same pan card detail. Contact your HR"
            });
        }

        const doesBankAccountExists = await prisma.joining_form.findFirst({
            where:{
                candidateBankDetail:{bankAccount:bankAccount},
                status:{not:joining_form_status.Rejected}
            },
            include:{candidateBankDetail:true}
        });
        if(doesBankAccountExists){
            console.log("Bank Account Already Exists");
            return res.status(400).json({
                success:false,
                message:"Joining form already submitted with same bank account detail. Contact your HR"
            });
        }

        //make sure if the base 64 value come in array or not?
        const aadharCardImage = aadharCardAttachment ? await handleBase64Images([aadharCardAttachment], "aadharCardAttachments") : [];
        const panCardImage = panCardAttachment ? await handleBase64Images([panCardAttachment], "panCardAttachments") : [];
        const bankAccountImage = bankAttachment ? await handleBase64Images([bankAttachment], "bankAttachments") : [];
        const photoImage = photoAttachment ? await handleBase64Images([photoAttachment], "photoAttachments") : [];
        const signatureImage = signatureAttachment ? await handleBase64Images([signatureAttachment], "signatureAttachment") : []; 

        const class10Image =class10Attachment? await handleBase64Images([class10Attachment],"class10Attachments") : [];
        const class12Image =class12Attachment? await handleBase64Images([class12Attachment],"class12Attachments") : [];
        const graduationImage = graduationAttachment? await handleBase64Images([graduationAttachment],"graduationAttachments") :[];
        const postGraduationImage = postGraduationAttachment? await handleBase64Images([postGraduationAttachment],"postGraduationAttachments"):[];

        // attachment urls
        const aadharCardUrl = aadharCardImage.length>0 ? `${req.protocol}://${req.get("host")}/uploads/aadharCardAttachments/${aadharCardImage[0].fileName}` : null;
        const panCardUrl = panCardImage.length>0 ? `${req.protocol}://${req.get("host")}/uploads/panCardAttachments/${panCardImage[0].fileName}` : null;
        const bankAccountUrl = bankAccountImage.length>0 ? `${req.protocol}://${req.get("host")}/uploads/bankAttachments/${bankAccountImage[0].fileName}` : null;
        const photoUrl = photoImage.length>0 ? `${req.protocol}://${req.get("host")}/uploads/photoAttachments/${photoImage[0].fileName}` : null;
        const class10Url = class10Image.length>0 ? `${req.protocol}://${req.get("host")}/uploads/class10Attachments/${class10Image[0].fileName}` :null;
        const class12Url = class12Image.length>0 ? `${req.protocol}://${req.get("host")}/uploads/class12Attachments/${class12Image[0].fileName}`:null;
        const graduationUrl = graduationImage.length>0 ? `${req.protocol}://${req.get("host")}/uploads/graduationAttachments/${graduationImage[0].fileName}`:null;
        const postGraduationUrl = postGraduationImage.length>0 ? `${req.protocol}://${req.get("host")}/uploads/postGraduationAttachments/${postGraduationImage[0].fileName}`:null;
        const signatureUrl = signatureImage.length>0 ? `${req.protocol}://${req.get("host")}/uploads/signatureAttachment/${signatureImage[0].fileName}`:null;

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

        //formData
        const formData ={
            name,
            father_husbandName,
            dateOfBirth,
            gender,
            maritalStatus,
            bloodGroup,
            personalPhoneNum,
            personalEmail,
            currentAddress,
            currentState,
            currentCity,
            currentPinCode,
            permanentAddress,
            permanentState,
            permanentCity,
            permanentPinCode,

            bankName,
            branchName,
            bankAccount,
            bankIFSC,
            bankAccountHolderName,
            bankAddress,
            panCard,
            aadharCard,
            uanNumber:uanNumber?uanNumber:null,
            emergencyContact,
            aadharCardAttachment:aadharCardUrl,
            panCardAttachment:panCardUrl,
            bankAttachment:bankAccountUrl,
            class10Attachment:class10Url,
            class12Attachment:class12Url,
            graduationAttachment:graduationUrl,
            postGraduationAttachment:postGraduationUrl,
            photoAttachment:photoUrl,
            signatureAttachment : signatureUrl
        };
        
        const newJoiningForm = await prisma.joining_form.create({
            data:{
                formData:formData,
                uanNumber:uanNumber,

                candidatePersonalDetail:{
                    create:{
                        name,
                        father_husbandName,
                        dateOfBirth:correctDateofBirth,
                        personalPhoneNum,
                        personalEmail,
                        panCard,
                        aadharCard, 
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
                            pincode:permanentPinCode,
                        },
                        gender,
                        maritalStatus,
                        bloodGroup,
                        emergencyContact,
                    }
                },
                candidateBankDetail:{
                    create:{
                        bankName,
                        branchName,
                        bankAccount,
                        bankIFSC,
                        bankAccountHolderName,
                        bankAddress
                    }
                },
                candidateAttachmentDetail:{
                    create:{
                        aadharCardAttachment:aadharCardUrl,
                        panCardAttachment:panCardUrl,
                        bankAttachment:bankAccountUrl,
                        class10Attachment:class10Url,
                        class12Attachment:class12Url,
                        graduationAttachment:graduationUrl,
                        postGraduationAttachment:postGraduationUrl,
                        photoAttachment:photoUrl,
                        signatureAttachment : signatureUrl
                    }
                },
            },
            include: {
                candidatePersonalDetail: true,
                candidateBankDetail: true,
                candidateAttachmentDetail: true,
            }
        });

        if(newJoiningForm){
            return res.status(200).json({
                success:true,
                message:"Joining Form Saved Successfully !",
                data:newJoiningForm
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Failed to save joining form"
            });
        }

    } catch (error) {
        console.log(error);
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: "Please upload an image less than 2MB!",
                error: error.message
            });
            }

        return res.status(500).json({
            success:false,
            message : "Internal Server Error",
            error: error.message
        });
    }
}

const showAllJoiningForms = async(req,res)=> {
    try {
        const {status,id}=req.query;
       
        const whereCondition = {
            ...(status? {status: joining_form_status[status]}:{}),
            ...(id ? {id}:{})
        };
        const response = await prisma.joining_form.findMany({
            where:whereCondition,
            select:{
                id:true,
                status:true,
                createdAt:true,
                candidatePersonalDetail:{
                    select:
                    {name:true,
                    father_husbandName:true,
                    dateOfBirth:true,
                    personalPhoneNum:true,
                    personalEmail:true,
                    panCard:true,
                    aadharCard:true,
                    permanentAddress:true,
                    currentAddress:true,
                    gender:true,
                    maritalStatus:true,
                    bloodGroup:true,
                    emergencyContact:true,}
                },
                candidateBankDetail:{
                    select:
                    {bankName:true,
                    branchName:true,
                    bankAccount:true,
                    bankIFSC:true,
                    bankAccountHolderName:true,
                    bankAddress:true,}
                },
                candidateAttachmentDetail:{
                    select:
                    {aadharCardAttachment:true,
                    panCardAttachment:true,
                    bankAttachment:true,
                    photoAttachment:true,
                    signatureAttachment:true,
                    class10Attachment:true,
                    class12Attachment:true,
                    graduationAttachment:true,
                    postGraduationAttachment:true,}
                }
            }
        });
        
        if(response){
            return res.status(200).json({
                success:true,
                message :`Joining Forms till now with: ${status?status:""}${id?id:""}, count:${response.length}`,
                data: response || []
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message :"DB Issue! Couldn't fetch joining form data",
                data: []
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error: error.message
        })
    }
}
// approval = employee registration
const joiningFormRejection = async(req,res)=> {
    try {
        const employeeId = req.employeeId;
        const {formId} = req.query;
        if(!formId){
            return res.status(400).json({
                success:false,
                message:"Form id is required"
            });
        }

        const currentStatus = await prisma.joining_form.findFirst({
            where:{id:formId},
            select:{status:true}
        });

        if(!currentStatus || currentStatus.status!=="Pending"){
            return res
            .status(400)
            .json({
                success:false,
                message:`You may not reject this joining form now as it is already ${currentStatus}.`
            });
        }

        const isRejected = await prisma.joining_form.update({
            where:{id:formId},
            data:{
                status:joining_form_status.Rejected,
                updatedById:employeeId
            }
        });

        if(isRejected){
            return res.status(200).json({
                success:true,
                message:"Joining Form Rejected.",
                data:{
                    id:isRejected.id,
                    candidateName:isRejected.formData.name,
                    appliedOn:isRejected.createdAt,
                    status:isRejected.status
                }
            });
        }
        else{
            return res.status(400).json({
                success:true,
                message:"DB Issue! Joining Form NOT Rejected."
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error: error.message
        });
    }
}

const joiningFormApproval = async(req,res)=> {
    try {
        const employeeId = req.employeeId;
        console.log(employeeId);

        //take the remaining data from the HR and also the joining form pdf document.
        const {formId,
            companyId,
            department,
            designation,
            joiningHR,
            interviewDate,
            joiningDate, 
            employeeType,
            modeOfRecruitment,
            reference,
            officialContact,
            officialEmail,
            ctc,
            inHand,
            employeeESI,
            employeePF,
            employerESI,
            employerPF,
        } = req.body;

        const requiredFields= [
            "formId",
            "companyId",
            "department",
            "designation",
            "joiningHR",
            "joiningDate", 
           
            "ctc",
            "inHand",
            "employeeESI",
            "employeePF",
            "employerESI",
            "employerPF",
        ]

        const missingFields = requiredFields.filter(field =>
            (!Object.prototype.hasOwnProperty.call(req.body,field))
        );
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`The following fields are missing ${missingFields.join(", ")}`
            })
        } 

        const salary=[
            "ctc",
            "inHand",
            "employeeESI",
            "employeePF",
            "employerESI",
            "employerPF",
        ];
        const notValidNums = salary.filter((d)=>(isNaN(req.body[d])));
        if(notValidNums.length>0){
            return res.status(400).json({
                success:false,
                message:`The following fields are have invalid type ${notValidNums.join(", ")}`
            })
        }


        //don't approve if already rejected
        const currentStatus = await prisma.joining_form.findFirst({
            where:{id:formId},
            select:{status:true}
        });
        // console.log(currentStatus);
        if(!currentStatus || currentStatus.status!=="Pending"){
            return res
            .status(400)
            .json({
                success:false,
                message:`You may not approve this joining form now as it is already ${currentStatus.status}.`
            });
        }

        //if admin id is provided for approval then check it has to be for Hr Dept and used only once
        const admin = await prisma.employee.findUnique({
            where:{employeeCode:"ADMIN-001"},
            select:{id:true}
        });
        if(admin.id===joiningHR){
            const isUsedBefore = await prisma.emp_work_detail.findFirst({
                where:{joiningHrId:admin.id}
            });

            if(isUsedBefore){
                return res.status(400).json({
                    success:false,
                    message:"Admin-Id can't be used for approval more than once."
                });
            }
            else{
                // beingUsedFor hr dept
                const HrDept = await prisma.department.findUnique({
                    where:{department:"HR"},
                    select:{id:true}
                });

                if(department!==HrDept.id){
                    return res.status(400).json({
                        success:false,
                        message:"You can not use admin id to approve for any other department, other than HR."
                    })
                }
            }
        }

        const correctJoiningDate = new Date(joiningDate);
        const correctInterviewDate =interviewDate ? new Date(interviewDate) : null;

        const isApproved = await prisma.joining_form.update({
            where:{id:formId},
            data:{
                status:joining_form_status.Approved,
                interviewDate:correctInterviewDate,
                joiningDate:correctJoiningDate, 
                modeOfRecruitment,
                reference,
                updatedById:employeeId,

                candidateWorkDetail:{
                    create:{
                        companyId:companyId,
                        departmentId:department,
                        designationId:designation,
                        joiningHrId:joiningHR,

                        joiningDate:correctJoiningDate,
                        
                        companyPhoneNum:officialContact,
                        companyEmail:officialEmail,
                        updatedById:employeeId
                    }
                },
                candidateSalaryDetail:{
                    create:{
                        ctc : Number(ctc),
                        inHand : Number(inHand),
                        employeeESI : Number(employeeESI),
                        employeePF : Number(employeePF),
                        employerESI : Number(employerESI),
                        employerPF : Number(employerPF),
                        updatedById : employeeId
                    }
                }
            },
            include:{
                candidateWorkDetail:true,
                candidateSalaryDetail:true
            }
        });
        
        if (isApproved){
            return res.status(200).json({
                success:true,
                message:"Joining Form Approved",
                data: isApproved
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Failed to approve joining form."
            });
        }

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        });
    }
}

const setJoiningFormStatusToPending = async(req,res)=>{
    try {
        const {formId} = req.query;
        if(!formId){
            return res.status(400).json({
                success:false,
                message:"Form id is required"
            });
        }

        // check if the approved candidate has become employee or not
        const isEmp= await prisma.emp_work_detail.findFirst({
            where:{joiningId:formId},
            select:{employeeId:true}
        });

        if(isEmp){
            return res.status(400).json({
                success:false,
                message:"The joining form that you wish to change to pending has already become an employee.",
            });
        }

        const setPending = await prisma.joining_form.update({
            where:{id:formId},
            data:{
                status:joining_form_status.Pending,
                interviewDate:null,
                joiningDate:null, 
                modeOfRecruitment:null,
                reference:null,
                updatedById:null,

                    // Remove related candidate details
                candidateWorkDetail: {
                    deleteMany: {}
                },
                candidateSalaryDetail: {
                    deleteMany: {}
                }
            },
            include: {
                candidateWorkDetail: true,
                candidateSalaryDetail: true
            }                    
        })

        if(setPending){
            return res.status(200).json({
                success:true,
                message:"Joining Form is Set to Pending.",
                data:setPending
            });
        }
        else{ throw new Error("Something went wrong while setting the status pending the Joining Form.")}
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error: error.message
        });
    }
}

module.exports={
    addJoiningForm,
    showAllJoiningForms,
    joiningFormRejection,
    joiningFormApproval,
    setJoiningFormStatusToPending
}