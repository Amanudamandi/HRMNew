const prisma = require("../../config/prisma.config");
// const e = require("express");
// const { all } = require("../../routes/common/common.router");

const helper = require("../../utils/common.util");

//department model CRUD
const addDepartment =async(req,res)=>{
    try {
        const employeeId = req.employeeId;
        let {dept} = req.body || req.query;

        dept = dept.trim();
        if(!dept){
            return res.status(400).json({
                success : false,
                message : "Field can't be empty"
            });
        }

        const deptExists = await prisma.department.findUnique({
            where:{department:dept}
        });

        if(deptExists){
            return res.status(400).json({
                success : false,
                message : "Department Already Exists"
            });
        }

        const newDept = await prisma.department.create({
            data:{
                department:dept,
                createdById:employeeId,
                updatedById:employeeId
            }
        })
        if(newDept){
            return res.status(201).json({
                success:true,
                message:"Department insert successfully.",
                data:{
                    id:newDept.id,
                    departmentName:newDept.department
                }
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Unable to Add New Department, Try Again."
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message : "Internal Server Error! Couldn't Add Department",
            error : error.message
        })
    }
}
const showDepartments = async(req,res) => {
    try {
        const {deptId}=req.query;
        if(deptId){
            const dept =  await prisma.department.findFirst({
                where:{
                    AND:[
                        {id:deptId},
                        { department: {not: "Admin"}}
                    ]
                }
            });

            if(dept){
                return res.status(200).json({
                    success:true,
                    message:"Department Found Using Id",
                    data:dept
                })
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Couldn't find Department using id"
                })
            }
        }
        else{
            // show all departments except for Admin.
            const allDepts = await prisma.department.findMany(
                {
                where: {
                  department: {
                    not: "Admin"
                  }
                }
              }
            );
    
            if (allDepts.length===0 || allDepts==null){
                return res.status(200).json({
                    success : true,
                    message : "No Departments Found, Please Add Department First."
                });
            }
            else{
                const deptNames =allDepts.map(dept => ({
                    id: dept.id,
                    deptName : dept.department
                }));
                return res.status(200).json({
                    success : true,
                    message :"Department List.",
                    data : deptNames
                });
            }
        }

    }
    catch(error) {
        return res.status(500).json({
            success :false,
            message: "Internal Server Error! Couldn't show Departments. ",
            error: error.message
        });        
    }
};
const updateDepartment =async(req,res)=> {
    try {
        const employeeId=req.employeeId;
        const {deptId,deptName}=req.body;

        if(!deptId || !deptName){
            return res.status(400).json({
                success : false,
                message : "Department-id and New-Department-id can't be empty. "
            });
        }

        const deptExists = await prisma.department.findFirst({
            where:{
                department:deptName
            }
        });
        if(deptExists){
            return res.status(400).json({
                success : false,
                message : "Department already exists with same name that you are trying to update-to."
            });
        }

        const updateDept = await prisma.department.update({
            where:{id:deptId},
            data:{
                department:deptName,
                updatedById:employeeId
            }
        });

        if(updateDept){
            return res.status(200).json({
                success : true,
                message : "Department Updation Successful !",
                data:{
                    id:updateDept.id,
                    updatedName:updateDept.department
                }
            });
        }
        else{
            return res.status(400).json({
                success: false,
                message : "Department Updation Failed!, Try after few seconds!"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error, Couldn't update department.",
            error : error.message
        })
    }
}
//only for backend
const deleteDepartment = async(req,res) => {
    //should not be deleted if it is assigned to any employee
    try {
        const {deptId} = req.body;
        if(!deptId){
            return res.status(400).json({
                success:false,
                message : "Department-Id not provided!"
            });
        }

        const response = await helper.isAssignedToEmployee({departmentId:deptId});
        if(!response.success){
            return res.status(403).json(response);
        }

        try {
            /////////////////////////////////////////////
            //when deleting an department, we checked the employee relation first, as it would prevent deletion.
            // this will also happen with designations as department has designations.
            //therefore delete the related-Designations first.
            
            const relatedDesignation = await prisma.designation.deleteMany({
                where:{
                    departmentId:deptId
                }
            });
            const isDeleted = await prisma.department.delete({
                where: {
                id: deptId,
                },
            });
            if(isDeleted){ 
                return res.status(201).json({
                    success:true,
                    message :`Department : ${isDeleted.department} Deleted Successfully along with ${relatedDesignation.count} Designations.`
                });
            }
            ////////////////////////////////////////////
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success:false,
                message : "Couldn't Delete Department. Maybe it's Already Deleted. Check Before Trying Again.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message : "Internal Server Error. Couldn't Delete Department",
            error : error.message
        });
    }
}


//designation model CRUD
const addDesignation = async(req,res)=>{
    try{
        const {departmentId,designation}=req.body;
        const employeeId = req.employeeId;
        
        if(!departmentId || !designation){
            return res.status(400).json({
                success:false,
                message : "Both Department-id and designation are needed."
            });
        }

        const existingDesignation  =await prisma.designation.findFirst({
            where:{
                AND:[
                    {departmentId:departmentId},
                    {name:designation}
                ]
            }
        });
        if(existingDesignation){
            return res.status(400).json({
                success :false,
                message : "Designation Already Exists! for this Department, with same name."
            });
        }

        const newDesignation=await prisma.designation.create({
            data:{
                departmentId:departmentId,
                name:designation,
                createdById:employeeId,
                updatedById:employeeId,

            }
        });
        if(newDesignation){
            return res.status(200).json({
                success : true,
                message : "Designation added Successfully! ",
                data:{
                    id:newDesignation.id,
                    name:newDesignation.name
                }
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue, Couldn't save data."
            })
        }
    }   
    catch(error){
        return res.status(500).json({
            success:false,
            message : "Internal Server Error! Couldn't Add Designation.",
            error : error.message
        })
    }
};
const showDesignation = async(req,res)=>{
    try {
        const {departmentId} = req.query;
        // console.log(departmentId)
        const allDesignation = await prisma.designation.findMany({
            where:{departmentId:departmentId}
        });

        if(allDesignation){
            if(allDesignation.length===0){
                return res.status(200).json({
                    success:true,
                    message:"No Designation found in this department",
                    data:[]
                })
            }
            else{
                    const data = allDesignation.map((d)=>({id:d.id, name:d.name}))
                    return res.status(200).json({
                        success:true,
                        message:"All designation",
                        data:data
                    });
                }
        }
        else{
            return res.status(400).json({
                success :false,
                message:"DB Issue! Couldn't show designation.",
            });    
        }

    } catch (error) {
        return res.status(500).json({
            success :false,
            message:"Internal Server Error! Couldn't show designation.",
            error : error.message
        });
    }
};
const updateDesignation =async (req,res)=>{
    try {
       const employeeId = req.employeeId;
       const {designationId,newName} = req.body;

       if(!designationId || !newName){
            return res.status(400).json({
                success:false,
                message:"Both designation-id and new-name are required."
            });
       }

       const alreadyExistingWithinDept = await prisma.designation.findFirst({
        where:{
            // departmentId: await prisma.designation.findUnique({  //can't pass promise in where
            //     where:{id:designationId},
            //     select:{
            //         departmentId:true
            //     }
            // }),
            department:{                    //using relation to find
                designation:{
                    some:{id:designationId}
                }
            },
            name:newName
        }
       });

       if(alreadyExistingWithinDept){
        return res.status(400).json({
            success:false,
            message:"This name you wish to update to, already exists in the department.",
            data:{
                id:alreadyExistingWithinDept.id,
                name:alreadyExistingWithinDept.name,
                department:alreadyExistingWithinDept.departmentId
            }
        })
       }

       const isUpdated = await prisma.designation.update({
        where:{id:designationId},
        data:{
            name:newName,
            updatedById:employeeId
        }
       });

       if(isUpdated){
        return res.status(200).json({
            success:true,
            message:"Designation Updated Successfully.",
            data:{
                id:isUpdated.id,
                name:isUpdated.name
            }
        });
       }
       else{
        return res.status(400).json({
            success:false,
            message:"DB Issue! Couldn't update Designation.",            
        })
       }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message:"Internal Server Error. Couldn't update Designation.",
            error:error.message
        });
    }
}
//for backend
const deleteDesignation = async(req,res)=>{
    try {
        const {designationId} = req.body;
        if(!designationId){
            return res.status(400).json({
                success : false,
                message : "Designation Id not provided!"
            });
        }

        const response = await helper.isAssignedToEmployee({designationId : designationId});
        if(!response.success){
            return res.status(403).json({response});
        }
        try {
            const isDeleted = await prisma.designation.delete({
                where:{id:designationId}
            });
            
            if(isDeleted){
                return res.status(201).json({
                    success:true,
                    message:"Designation Deleted Successfully !",
                    data:{
                        id:isDeleted.id,
                        name:isDeleted.name
                    }
                });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"DB Issue! Couldn't Delete Designation."
                })
            }
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:"Couldn't Delete Designation. Maybe it's already deleted."
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message : "Internal Server Error, Couldn't Delete Designation.",
            error:error.message
        });
    }
}


//company model CRUD
const addCompany = async (req,res)=>{
    try{
        const employeeId = req.employeeId;
        const {name} =req.body;
        if(!name){
            return res.status(400).json({
                success : false,
                message : "Name field is required!"
            });
        }
        const isExisting = await prisma.company.findUnique({
            where:{name:name}
        });
        if(isExisting){
            return res.status(400).json({
                success:false,
                message:"Company with same name already registered."
            })
        };

        const newCompanyAdded= await prisma.company.create({
            data:{
                name,
                createdById:employeeId,
                updatedById:employeeId
            }
        });
        if(newCompanyAdded){
            return res.status(201).json({
                success : true,
                message : "Company Added Successfully !",
                data : {
                   id:newCompanyAdded.id,
                   name:newCompanyAdded.name
                }
            });
        }
        else{
            return res.status(400).json({
                success : false,
                message : "DB Issue! Couldn't Add Company! Please try again!",
            });
        }
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message : "Internal Server Error! Couldn't add company.",
            error : error.message
        });
    }
}
const showCompany = async (req,res)=>{
    try{
        const allCompany=await prisma.company.findMany();

        if(allCompany){
            if(allCompany.length===0){
                return res.status(200).json({
                    success : true,
                    message : "No Company Found, Please Add Company First.",
                    data:[]
                });
            }
            else{
                const data=allCompany.map((d)=>({id:d.id, name:d.name}))
                return res.status(200).json({
                    success:true,
                    message:"All Company list.",
                    data:data
                });
            }
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Found Comapny.",
            });
        }
    }
    catch (error){
        return req.status(500).json({
            success: false,
            message : "Internal Server Error! Can't show you company.",
            error : error.message
        });
    }
}
const updateCompany= async (req,res)=>{
    try {
        const employeeId = req.employeeId;
        const {companyId,name} = req.body;
        
        if(!companyId || !name){
            return res.status(400).json({
                success :false,
                message : "Both Company-id and Name are required."
            });
        }

        const alreadyExist = await prisma.company.findUnique({
            where:{name:name}
        });      
        if(alreadyExist){
            return res.status(400).json({
                success:false,
                message : "Company already exists with same name that you are trying to update-to.",
            });
        }

        const companyUpdated= await prisma.company.update({
            where:{id:companyId},
            data:{
                name:name,
                updatedById:employeeId
            }
        });
        if(companyUpdated){
            return res.status(200).json({
                success : true,
                message : "Company Name Updated Successfully !",
                data:{
                    id:companyUpdated.id,
                    name:companyUpdated.name
                }
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Update Company Name"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Company Details could not be updated!",
            error : error.message
        });
    }
}
//for backend
const deleteCompany = async(req,res)=>{
    try {
        const {companyId} = req.body;
        if(!companyId){
            return res.status(400).jaon({
                success:false,
                message:"Company-Id not provided!"
            });
        }

        const response = await helper.isAssignedToEmployee({companyId:companyId});
        if(!response.success){
            return res.status(403).json(response);
        }
        try {
            ///////////////////////////////////////////////////////

            const isRelatedBranchDeleted = await prisma.branch.deleteMany({
                where:{companyId:companyId}
            });

            const isDeleted = await prisma.company.delete({
                where:{id:companyId}
            })
            if(isDeleted){    
                return res.status(201).json({
                    success:true,
                    message :`Company : ${isDeleted.name} Deleted Successfully along with ${isRelatedBranchDeleted.count} Branches.`
                });
            }
            else{
                return res.status(400).json({
                success:false,
                message: "Company Not Deleted."
                });
            }
            ////////////////////////////////////////////////////////////
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success:false,
                message : "Couldn't Delete Company. Maybe it's Already Deleted. Check Before Trying Again.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message : "Internal Server Error, Couldn't Delete Company.",
            error:error.message
        });
    }
}


//branch Model CRUD
const addBranch = async (req,res)=>{
    try{
        const employeeId = req.employeeId;
        const {companyId, name, address, pin} =req.body;

        // console.log(employeeId);

        const requiredFields=["companyId", "name", "address", "pin"];
        const missingFields=requiredFields.filter((field)=>(!req.body[field]));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following fields are missing: ${missingFields.join(", ")}.`
            })
        }

        if(pin.length!==6 || !Number.isInteger(Number(pin))){
            return res.status(400).json({
                success:false,
                message:"Invalid Pin-Code Format"
            })
        }

        const isExisting = await prisma.branch.findFirst({
            where:{
                companyId:companyId,
                name:name
            }
        });
        if(isExisting){
            return res.status(400).json({
                success:false,
                message:"Branch Already Exists! for this Company, with same name."
            });
        }

        const newBranchAdded= await prisma.branch.create({
            data:{
                companyId,
                name,
                address,
                pin:Number(pin), 
                createdById:employeeId,
                updatedById:employeeId
            }
        });

        if(newBranchAdded){
            return res.status(201).json({
                success : true,
                message : "Branch Added Successfully !",
                data : {
                    id: newBranchAdded.id,
                    company:newBranchAdded.companyId,
                    name:newBranchAdded.name,
                    address:newBranchAdded.address
                }
            });
        }
        else{
            return res.status(400).json({
                success : false,
                message : "DB Issue! Couldn't Add Branch. Please try again!",
            });
        }

    }
    catch (error){
        return res.status(400).json({
            success: false,
            message : "Internal Server Error! Couldn't add Branch.",
            error : error.message
        });
    }
}
const showBranch = async (req,res)=>{
    try{
        const {companyId}=req.query;
        if(!companyId){
            return res.status(400).json({
                success:false,
                message:"companyId is required!"
            })
        }
        const allBranch = await prisma.branch.findMany({
            where:{companyId:companyId}
        });

        if(allBranch){
            if(allBranch.length===0 || allBranch == null){
                return res.status(200).json({
                    success : true,
                    message : "No Branch Found, Please Add Branch First."
                });
            }
            else{
                const data=allBranch.map((d)=>({
                    id:d.id, 
                    name:d.name, 
                    companyId:d.companyId,
                    address:d.address,
                    pin:d.pin
                }));

                return res.status(200).json({
                    success:true,
                    message:"All Branch list.",
                    data:data
                })
            }
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Invalid company ID, or DB Issue!"
            });
        }
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message : "Internal Server Error! Can't show you Branch.",
            error : error.message
        });
    }
}
const updateBranchDetails= async (req,res)=>{
    try {
        const employeeId = req.employeeId;
        const {branchId,name,address,pin} = req.body;

        const requiredFields=["branchId","name","address","pin",];
        const missingFields=requiredFields.filter((field)=>(!req.body[field]));
        if(missingFields.length>0){
            return res.status(400).json({
                success :false,
                message : `Following fields are required: ${missingFields.join(", ")}`
            });
        }
      
        if(pin.length!==6 || !Number.isInteger(Number(pin))){
            return res.status(400).json({
                success:false,
                message:"Invalid Pin-Code Format"
            })
        }

        const alreadyExistingBranch=await prisma.branch.findFirst({  //using relation to find
            where:{
                company:{
                    branch:{
                        some:{id:branchId}
                    }
                },
                name:name
            }
        });
        if(alreadyExistingBranch){
            return res.status(400).json({
                success:false,
                message:"This name you wish to update to, already exists in the Company.",
                data:{
                id:alreadyExistingWithinDept.id,
                name:alreadyExistingWithinDept.name,
                company:alreadyExistingWithinDept.companyId
            }
            })
        }

        const isUpdated= await prisma.branch.update({
            where:{id:branchId},
            data:{
                name,
                address,
                pin:Number(pin),
                updatedById:employeeId
            }
        });
        if(isUpdated){
            return res.status(200).json({
                success : true,
                message : "Branch Name Updated Successfully !",
                data:{
                    id:isUpdated.id,
                    branchName:isUpdated.name,
                    address:isUpdated.address,
                    pin:isUpdated.pin,
                    companyId:isUpdated.companyId
                }
            });
        }
        else{
            return res.status(400).json({
                success :false,
                message : "DB Issue! Couldn't update branch"
            });
        }
    } catch (error) {
        if(error.code===11000){
            return res.status(400).json({
                success:false,
                message : "Update Failed! The given combination of Branch Name, Branch, Address & Pin already exists."
            })
        }
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Branch Details could not be updated!",
            error : error.message
        });
    }
}
//only for backend
const deleteBranch = async(req,res)=>{  
    try {
        const {branchId} = req.body;
        if(!branchId){
            return res.status(400).json({
                success:false,
                message : "Branch-Id not provided!"
            });
        }

        const response = await helper.isAssignedToEmployee({branchId:branchId});
        if(!response.success){
            return res.status(403).json(response);
        }
       try {
            const isDeleted = await prisma.branch.delete({
                where:{id:branchId}
            });
            
            if(isDeleted){
                return res.status(201).json({
                    success:true,
                    message:"Branch Deleted Successfully !",
                    data:{
                        id:isDeleted.id,
                        name:isDeleted.name,
                        address:isDeleted.address,
                        pin:isDeleted.pin
                    }
                })
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"DB Issue! Couldn't Delete Branch."
                })
            }
       } catch (error) {
            return res.status(400).json({
                success:false,
                message:"Couldn't Delete Branch. Maybe it's already deleted."
            })
       }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message : "Internal Server Error, Couldn't Delete Branch.",
            error:error.message
        });
    }
};


//qualification Model Crud
const addQualification = async (req,res) => {
    try{
        const employeeId = req.employeeId;
        const {qualificationName} = req.body;
       
        if(!qualificationName){
            return res.status(400).json({
                success : false,
                message : "Qualification-Name field is required!"
            });
        }

        const isExisting = await prisma.qualification.findFirst({
            where:{name:qualificationName}
        })
        if(isExisting){
            return res.status(400).json({
                success : false,
                message : "Qualification with same name already exists"
            });
        }

        const newQualificationAdded = await prisma.qualification.create({
            data:{
                name:qualificationName,
                createdById:employeeId,
                updatedById:employeeId
            }
        });
        if(newQualificationAdded){
            return res.status(201).json({
                success:true,
                message:"Qualification Added Successfully.",
                data:{
                    id:newQualificationAdded.id,
                    name:newQualificationAdded.name,
                }
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Add Qualification! Please try again!"
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message : "Internal Server Error! Couldn't Add Qualification",
            error : error.message
        })
    }
};
const showQualification = async(req,res) => {
    try {
        // show all qualification .
        const allQualifications= await prisma.qualification.findMany();

        if(allQualifications){
            if (allQualifications.length===0 || allQualifications==null){
                return res.status(200).json({
                    success : true,
                    message : "No Qualification Found, Please Add Qualification First."
                });
            }
            else{
                const data =allQualifications.map((d)=>({id:d.id,name:d.name}) );
                return res.status(200).json({
                    success : true,
                    message :"Qualification List.",
                    data : data
                });
            }
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Found Qualification.",
            });
        }
    }
    catch(error) {
        return res.status(500).json({
            success :false,
            message: "Internal Server Error! Couldn't show Qualification. ",
            error: error.message
        });        
    }
};
const updateQualification = async (req,res) => {
    try{
        const employeeId = req.employeeId;
        const {qualificationId,qualificationName} = req.body;
  
        if(!qualificationId || !qualificationName){
            return res.status(400).json({
                success : false,
                message : "Both Qualification-id and Name are required."
            });
        }

        const alreadyExist = await prisma.qualification.findFirst({
            where:{name:qualificationName}
        })
        if(alreadyExist){
            return res.status(400).json({
                success : false,
                message : "Qualification already exists with same name that you are trying to update-to."
            });
        }

        const updatedQualification = await prisma.qualification.update({
            where:{id:qualificationId},
            data:{
                name:qualificationName,
                updatedById:employeeId
            }
        });

        if(updatedQualification){
            return res.status(200).json({
                success : true,
                message : "Qualification Updation Successful !",
                data:{
                    id:updatedQualification.id,
                    name:updatedQualification.name
                }
            });
        }
        else{
            return res.status(400).json({
                success: false,
                message : "DB Issue! Couldn't Update Qualification."
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error, Couldn't update qualification.",
            error : error.message
        })
    }

};
//only for backend 
const deleteQualification = async (req,res)=>{
    try {
        const {qualificationId} = req.body;
        if(!qualificationId){
            return res.status(400).json({
                success: false,
                message : "Qualification Id not provided!"
            });
        }

        const response = await helper.isAssignedToEmployeePersonalDetail({qualificationId : qualificationId});
        if(!response.success){
            return res.status(403).json(response);
        }
        try {
            ///////////////////////////////////////////////////////
            const relatedDegree = await prisma.degree.deleteMany({
                where:{qualificationId:qualificationId}
            });
            
            const isDeleted = await prisma.qualification.delete({
                where:{id:qualificationId}
            });
            if(isDeleted){
                return res.status(201).json({
                    success:true,
                    message:`Qualification: ${isDeleted.name} deleted successfully along with ${relatedDegree.count} related Degree.`
                });
            }
            else{
                return res.status(400).json({
                success:false,
                message: "DB Issue! Qualification Not Deleted."
                });
            }
            ///////////////////////////////////////////////////////
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success:false,
                message : "Couldn't Delete Qualification. Maybe it's Already Deleted. Check Before Trying Again.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Internal Server Error! Qualification Not Deleted !.",
            error: error.message
        });
    }
}

//degree Model CRUD
const addDegree = async(req,res) => {
    try {
        const employeeId = req.employeeId;
        const {qualificationID,degreeName} = req.body;
        if(!qualificationID || !degreeName){
            return res.status(400).json({
                success:false,
                message : "Both Qualification-id and Degree-name are needed."
            });
        }

        const isExisting = await prisma.degree.findFirst({
            where:{
                AND:[
                    {qualificationId:qualificationID},
                    {name:degreeName}
                ]
            }
        })
        if(isExisting){
            return res.status(400).json({
                success:false,
                message:"Degree already exists for given Qualification, with same name."
            });
        }

        const newDegree = await prisma.degree.create({
            data:{
                qualificationId:qualificationID,
                name:degreeName,
                createdById:employeeId,
                updatedById:employeeId
            }
        });
        if(newDegree){
            return res.status(201).json({
                success:true,
                message:"Degree Added Successfully!",
                data : {
                    id:newDegree.id,
                    qualificationid:newDegree.qualificationId,
                    name:newDegree.name
                }
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Something went wrong! Try Again."
            });
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Degree Not Added!",
            error:error.message
        });
    }
}
const showDegree = async (req,res) =>{
    try {
        const {qualificationId} = req.query;

        if(!qualificationId){
            return res.status(400).json({
                success:false,
                message:"Qualification-id is required."
            })
        }

        const allDegree= await prisma.degree.findMany({
            where:{qualificationId:qualificationId}
        });

        if (allDegree) {
            if(allDegree.length ===0 || allDegree == null){
                return res.status(200).json({
                    success : true,
                    message :"No Degree found in this Qualification, Add Degree First."
                });
            }else{
                const data= allDegree.map((d)=>({id:d.id, qualificationId:d.qualificationId, name:d.name}))
                return res.status(201).json({
                    success:true,
                    message : "All Degree List For Given Qualification",
                    data : data
                });
            }
        } else {
            return res.status(400).json({
                success : false,
                message : "DB Issue! Couldn't show degree."
            });
        }  
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Can't show you the Qualifications.",
            error:error.message
        });
    }
}
const updateDegree = async(req,res)=>{
    try {
        const employeeId= req.employeeId;
        const {degreeId, newName}= req.body;

        if(!degreeId || !newName){
            return res.status(400).json({
                success:false,
                message:"Both Degree-id and Degree-name are required."
            });
        }

        const alreadyExist = await prisma.degree.findFirst({
            where:{
                qualification:{
                    degrees:{
                        some:{id:degreeId}
                    }
                },
                name:newName
            }
        });
        if(alreadyExist){
            return res.status(400).json({
                success:false,
                message:"This name you wish to update to, already exists in the Qualification.",
                data:{
                    id:alreadyExist.id,
                    name:alreadyExist.name,
                    qualification:alreadyExist.qualificationId
                }
            });
        }

        const isUpdated = await prisma.degree.update({
            where:{id:degreeId},
            data:{
                name:newName,
                updatedById:employeeId
            }
        });

        if(isUpdated){
            return res.status(200).json({
                success:true,
                message:"Degree Updated Successfully.",
                data:{
                    id:isUpdated.id,
                    name:isUpdated.name
                }
            });
        }else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't update Degree.",            
            })
        }
    } catch (error) {
        return res.status(500).json({
            success : false,
            message:"Internal Server Error. Couldn't update Degree.",
            error:error.message
        });
    }
}
// for backend
const deleteDegree = async (req,res)=>{
    try {
        const {degreeId} = req.body;
        if(!degreeId){
            return res.status(400).json({
                success:false,
                message : "Degree-Id not provided!"
            });
        }
        const response = await helper.isAssignedToEmployeePersonalDetail({degreeId:degreeId});
        if(!response.success){
            return res.status(403).json(response);
        }

        try {
            const isDeleted = await prisma.degree.delete({
                where:{id:degreeId}
            });

            if(isDeleted){
                return res.status(201).json({
                    success:true,
                    message:`Degree : ${isDeleted.name} Deleted Successfully.`
                });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"DB Issue! Couldn't Delete Degree."
                })
            }
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:"Couldn't Delete Degree. Maybe it's already deleted. Check before trying again."
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Degree Not Deleted.",
            error:error.message
        });
    }
}


//workType Model CRUD
const addWorkType = async(req,res) =>{
    try {
        const employeeId = req.employeeId;
        const {workType}= req.body;
        if(!workType){
            return res.status(400).json({
                success : false,
                message : "Work-Type Field Can't be empty"
            });
        }
        const isExisting = await prisma.work_type.findUnique({
            where:{workType:workType}
        });
        
        if(isExisting){
            return res.status(400).json({
                success:false,
                message:"Work-Type already exists!"
            });
        }
        
        const newWorkType = await prisma.work_type.create({
            data:{
                workType:workType,
                createdById:employeeId,
                updatedById:employeeId
            }
        })
        if(newWorkType){
            return res.status(200).json({
                success:true,
                message :"Work Type Added Successfully!",
                data:{
                    id:newWorkType.id,
                    workType:newWorkType.workType
                }
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Work Type Couldn't be Saved, Try Again!"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Work-Type Not Added!"
        });
    }
}
const showWorkType = async(req,res)=>{
    try {
        const allWorkType = await prisma.work_type.findMany();

        if(allWorkType){
            if(allWorkType.length===0){
                return res.status(200).json({
                    success : true,
                    message : "No WorkType Found, Please Add WorkType First.",
                    data:[]
                });
            }
            else{
                const data=allWorkType.map((d)=>({id:d.id, name:d.workType}))
                return res.status(200).json({
                    success:true,
                    message:"All WorkType list.",
                    data:data
                });
            }
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Found WorkType.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Internal Server Error! Can't Show Work-Type",
            error:error.message
        });
    }
}
const updateWorkType = async(req,res)=>{
    try {
        const employeeId= req.employeeId;
        const {workTypeId, newWorkType} = req.body;

        if(!workTypeId || !newWorkType){
            return res.status(400).json({
                success :false,
                message : "Both workTypeId and newWorkType are required."
            });
        }

        const alreadyExist = await prisma.work_type.findUnique({
            where:{workType:newWorkType}
        });
        if(alreadyExist){
            return res.status(400).json({
                success:false,
                message : "WorkType already exists with same type that you are trying to update-to.",
            });
        }

        const isUpdated = await prisma.work_type.update({
            where:{id:workTypeId},
            data:{
                workType:newWorkType,
                updatedById:employeeId
            }
        })
        if(isUpdated){
            return res.status(200).json({
                success : true,
                message : "WorkType Updated Successfully !",
                data:{
                    id:isUpdated.id,
                    workType:isUpdated.workType
                }
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Update WorkType"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! WorkType could not be updated!",
            error : error.message
        });
    }
}

//shift Model CRUD --to test
const addShift = async (req,res)=>{
    try {
        const employeeId = req.employeeId;
        const {name,startTime,endTime,markAsAbsent,isNightShift,weekOff,maxEarlyAllowed,maxLateAllowed} = req.body;

        const requiredFields = [
            "name","startTime","endTime","markAsAbsent","isNightShift","weekOff","maxEarlyAllowed","maxLateAllowed",
        ];
        const missingFields=requiredFields.filter((field)=>
            (!Object.prototype.hasOwnProperty.call(req.body, field)));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following fields are missing : ${missingFields.join(", ")}.`
            })
        }

        const check= helper.timeFormatValidator(startTime,endTime,maxEarlyAllowed,maxLateAllowed);
        if(check!='Pass'){
            return res.status(400).json({
                success:false,
                message:`${check}`
            });
        }
      
        const timeDurationInMin = helper.timeDurationInMinutes(startTime,endTime);
        if(timeDurationInMin<0){
            return res.status(400).json({
                success:false,
                message:"Shift End-Time can't be less than Start-Time"
            })
        }
        const duration= `${Math.floor(timeDurationInMin / 60)}:${timeDurationInMin % 60}`;

        const maxEarlyMinute = helper.timeDurationInMinutes(maxEarlyAllowed,startTime);
        if(maxEarlyMinute<0){
            return res.status(400).json({
                success:false,
                message:"Max-Early-Allowed-Time can't be after Start-Time."
            });
        }

        const maxLateMinute = helper.timeDurationInMinutes(startTime,maxLateAllowed);
        if(maxLateMinute<0){
            return res.status(400).json({
                success:false,
                message : "Max-Late-Allowed-Time can't be before Start Time."
            });
        }

        const isExistingShift = await prisma.shift.findUnique({
            where:{name:name}
        });
        if(isExistingShift){
            return res.status(400).json({
                success : false,
                message : "Shift with same name already exists!"
            });
        }

        const newShift = await prisma.shift.create({
            data:{
                name,
                startTime,
                endTime,
                markAsAbsent,
                duration,
                markAsAbsent,
                isNightShift,
                weekOff,
                maxEarlyAllowed,
                maxLateAllowed,
                
                createdById:employeeId,
                updatedById:employeeId
            },
            select: {
                id: true,
                name:true,
                startTime:true,
                endTime:true,
                markAsAbsent:true,
                duration:true,
                markAsAbsent:true,
                isNightShift:true,
                weekOff:true,
                maxEarlyAllowed:true,
                maxLateAllowed:true,
            }
        });

        if(newShift){
            return res.status(200).json({
                success:true,
                message: "Shift Added Successfully!",
                data:newShift
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Add Shift."
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message : "Internal Server Error! Couldn't Add Shift.",
            error : error.message
        });
    }
    
}
const showShift = async (req,res)=>{
    try {
        const {shiftId}=req.query;
        if(shiftId){
            const shift =  await prisma.shift.findFirst({
                where:{id:shiftId},
                select: {
                    id: true,
                    name:true,
                    startTime:true,
                    endTime:true,
                    markAsAbsent:true,
                    duration:true,
                    markAsAbsent:true,
                    isNightShift:true,
                    weekOff:true,
                    maxEarlyAllowed:true,
                    maxLateAllowed:true,
                }
            });

            if(shift){
                return res.status(200).json({
                    success:true,
                    message:"Shift Found Using Id",
                    data:shift
                })
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Couldn't find shift using id"
                })
            }
        }
        else{
            const allShift= await prisma.shift.findMany({
                select: {
                    id: true,
                    name:true,
                    startTime:true,
                    endTime:true,
                    markAsAbsent:true,
                    duration:true,
                    markAsAbsent:true,
                    isNightShift:true,
                    weekOff:true,
                    maxEarlyAllowed:true,
                    maxLateAllowed:true,
                }
            });
            if(allShift){
                return res.status(200).json({
                    success:true,
                    message:"All Shifts",
                    data: allShift || []
                });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"DB Issue! Couldn't Find Shifts.",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            success :false,
            message:"Internal Server Error! Couldn't show shifts.",
            error : error.message
        });
    }
}
const updateShift = async(req,res)=>{
    try {
        const employeeId=req.employeeId;
        const {shiftId,name,startTime,endTime,markAsAbsent,isNightShift,weekOff,maxEarlyAllowed,maxLateAllowed} = req.body;

        const requiredFields=[
            "shiftId","name","startTime","endTime","markAsAbsent","isNightShift","weekOff","maxEarlyAllowed","maxLateAllowed",
        ]
        const missingFields=requiredFields.filter((field)=>
            (!Object.prototype.hasOwnProperty.call(req.body, field)));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following Fields are missing : ${missingFields.join(", ")}`
            });
        }
        ////////////////////////////////////////////////
        //small db check, as we are keeping shift name unique, just check if the new-name already exists or not? as it will save processing on further computations
        const alreadyExist = await prisma.shift.findUnique({
            where:{name:name}
        });
        if(alreadyExist){
            return res.status(400).json({
                success:false,
                message:"The Shift 'name' you wish to update to already exists.",
                data:{
                    name:alreadyExist.name
                }
            });
        }
        ////////////////////////////////////////////////

        const check= helper.timeFormatValidator(startTime,endTime,maxEarlyAllowed,maxLateAllowed);
        if(check!='Pass'){
            return res.status(400).json({
                success:false,
                message:`${check}`
            });
        }
        
        // calculating duration
        const timeDurationInMin = helper.timeDurationInMinutes(startTime,endTime);
        if(timeDurationInMin<0){
            return res.status(400).json({
                success:false,
                message:"Shift End-Time can't be less than Start-Time"
            })
        }
        const duration= `${Math.floor(timeDurationInMin / 60)}:${timeDurationInMin % 60}`;

        const maxEarlyMinute = helper.timeDurationInMinutes(maxEarlyAllowed,startTime);
        if(maxEarlyMinute<0){
            return res.status(400).json({
                success:false,
                message:"Max-Early-Allowed-Time can't be after Start-Time."
            });
        }

        const maxLateMinute = helper.timeDurationInMinutes(startTime,maxLateAllowed);
        if(maxLateMinute<0){
            return res.status(400).json({
                success:false,
                message : "Max-Late-Allowed-Time can't be before Start Time."
            });
        }

        //isExisting checked above.
        const isUpdated = await prisma.shift.update({
            where:{id:shiftId},
            data:{
                name,startTime,endTime,markAsAbsent,isNightShift,weekOff,maxEarlyAllowed,maxLateAllowed,
                duration,
                updatedById:employeeId
            },
            select: {
                id: true,
                name:true,
                startTime:true,
                endTime:true,
                markAsAbsent:true,
                duration:true,
                markAsAbsent:true,
                isNightShift:true,
                weekOff:true,
                maxEarlyAllowed:true,
                maxLateAllowed:true,
            }
        });

        if(isUpdated){
            return res.status(201).json({
                success:true,
                message:"Shift Updated Successfully!",
                data:isUpdated
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Update Shift."
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error! Couldn't Update Shift.",
            error:error.message
        })
    }
}
//only for backend
const deleteShift = async (req,res)=>{
    // should not be deleted if shift is assigned to an employee
    try {
        const {shiftId}=req.body;
        if(!shiftId){
            return res.status(400).json({
                success:false,
                message:"Shift Id Not Provided."
            });
        }

        const response = await helper.isAssignedToEmployee({shiftId : shiftId});
        if(!response.success){
            return res.status(403).json(response);
        }

        // console.log("Shift not assigned to any employee, good to delete it.");

        try {
            const isDeleted = await prisma.shift.delete({
                where:{id:shiftId}
            })
    
            if(isDeleted){
                // console.log(isDeleted)
                return res.status(200).json({
                    success:true,
                    message:`Shift : ${isDeleted.name} Deleted Successfully`
                });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message: "DB Issue! Shift Not Deleted."
                    });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success:false,
                message : "Couldn't Delete Shift. Maybe it's Already Deleted. Check Before Trying Again.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error, Couldn't Delete Shift",
            error:error.message
        });
    }
};


//officeTimePolicy Model Crud
const addOfficeTimePolicy = async (req,res)=>{
    try {
        const employeeId=req.employeeId;
        const {policyName,
            permittedLateArrival,
            pByTwo,
            absent,
            multiPunch,
            lateComingRule, 
        }=req.body;

        let { lateArrival1,
            lateArrival2,
            lateArrival3,
            lateArrival4,
            dayDeduct1,
            dayDeduct2,
            dayDeduct3,
            dayDeduct4,

            deductFromAttendance,
            deductFromLeave,
            allowedLateDaysInMonth,
            salaryCutPercentage,
            continuous,
        }=req.body;

        const requiredFields=[
            "policyName","permittedLateArrival","pByTwo","absent","multiPunch","lateComingRule",
            "lateArrival1","lateArrival2","lateArrival3","lateArrival4","dayDeduct1","dayDeduct2","dayDeduct3","dayDeduct4",
            "deductFromAttendance","deductFromLeave","allowedLateDaysInMonth","salaryCutPercentage","continuous",
        ];
        const missingFields=requiredFields.filter((field)=>
            (!Object.prototype.hasOwnProperty.call(req.body, field)));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following fields are missing: ${missingFields.join(", ")}`
            });
        }

        // do the data-type check at front-end.
        const check = helper.timeFormatValidator(permittedLateArrival, pByTwo, absent,lateArrival1,lateArrival2,lateArrival3,lateArrival4);
        if(check!='Pass'){
            return res.status(400).json({
                success:false,
                message:`${check}`
            });
        }

        const existingPolicy = await prisma.office_time_policy.findUnique({
            where:{policyName:policyName.trim()}
        })
        // console.log(existingPolicy)
        if(existingPolicy){
            return res.status(400).json({
                success:false,
                message:"Policy with same name already exists!"
            });
        }

        //imp- validation
        //check for late-coming rule
        if(lateComingRule){
            //check all the fields required in lateComingRule
            if( !allowedLateDaysInMonth || !salaryCutPercentage){
                return res.status(400).json({
                    success:false,
                    message:"If late coming setting is enabled then late days allowed and salary cut percentage is required."
                });
            }

            if(!deductFromLeave && !deductFromAttendance){
                return res.status(400).json({
                    success:false,
                    message:"If late coming setting is enabled then either of deduct from attendance or deduct from leave is required."
                });
            }

            if(deductFromAttendance && deductFromLeave){
                return res.status(400).json({
                    success:false,
                    message:"If late coming setting is enabled then both deduct from attendance and deduct from leave can't be selected at same time."
                });
            }

            lateArrival1=null;
            lateArrival2=null;
            lateArrival3=null;
            lateArrival4=null;

            dayDeduct1=null;
            dayDeduct2=null;
            dayDeduct3=null;
            dayDeduct4=null;
        }

        if(lateArrival1 || lateArrival2 || lateArrival3 || lateArrival4){
            deductFromAttendance=false;
            deductFromLeave=false;
            allowedLateDaysInMonth=null;
            salaryCutPercentage=null;
            continuous=false;

            if(lateArrival1 && (helper.timeDurationInMinutes('00:00',lateArrival1)>59)){
                return res.status(400).json({
                    success:false,
                    message:"Late Rule 1 can not have time more than 59 minutes"
                });
            }
            if(lateArrival2 && ((15>helper.timeDurationInMinutes('00:00',lateArrival2))||(helper.timeDurationInMinutes('00:00',lateArrival2)>120))){
                console.log(helper.timeDurationInMinutes('00:00',lateArrival2));
                return res.status(400).json({
                    success:false,
                    message:"Late Rule 2 can not have time more than 2 hrs and less than 15 minutes"
                });
            }
            if(lateArrival3 && ((30>helper.timeDurationInMinutes('00:00',lateArrival3))||(helper.timeDurationInMinutes('00:00',lateArrival3)>180))){
                console.log(120<helper.timeDurationInMinutes('00:00',lateArrival3)<180)
                return res.status(400).json({
                    success:false,
                    message:"Late Rule 3 can not have time more than 3 hrs and less than 30 minutes"
                });
            }
            if(lateArrival4 && ((60>helper.timeDurationInMinutes('00:00',lateArrival4)) || (helper.timeDurationInMinutes('00:00',lateArrival4)>240))){
                return res.status(400).json({
                    success:false,
                    message:"Late Rule 4 can not have time more than 4 hrs and less than 1 Hr"
                });
            }
        }

        const newPolicy= await prisma.office_time_policy.create({
            data:{
                policyName:policyName.trim(),
                permittedLateArrival,
                pByTwo,
                absent,
                multiPunch,

                lateArrival1,
                lateArrival2,
                lateArrival3,
                lateArrival4,
                
                dayDeduct1,
                dayDeduct2,
                dayDeduct3,
                dayDeduct4,

                lateComingRule,
                deductFromAttendance,
                deductFromLeave,
                allowedLateDaysInMonth,
                salaryCutPercentage,
                continuous,
                
                createdById:employeeId,
                updatedById:employeeId
            },
            select:{
                id:true,
                policyName:true,
                permittedLateArrival:true,
                pByTwo:true,
                absent:true,
                multiPunch:true,

                lateArrival1:true,
                lateArrival2:true,
                lateArrival3:true,
                lateArrival4:true,
                
                dayDeduct1:true,
                dayDeduct2:true,
                dayDeduct3:true,
                dayDeduct4:true,

                lateComingRule:true,
                deductFromAttendance:true,
                deductFromLeave:true,
                allowedLateDaysInMonth:true,
                salaryCutPercentage:true,
                continuous:true,
            }
        })
        if(newPolicy){
            return res.status(200).json({
                success:true,
                message:"Policy Added Successfully",
                data:newPolicy
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Db Issue! Couldn't Add Policy"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success :false,
            message:"Internal Server Error! Policy Not Added!",
            error : error.message
        });
    }
}
const showOfficeTimePolicy = async (req,res)=> {
    try {
        const {policyId}=req.query;
        if(policyId){
            const policy = await prisma.office_time_policy.findFirst({
                where:{id:policyId},
                select:{
                    id:true,
                    policyName:true,
                    permittedLateArrival:true,
                    pByTwo:true,
                    absent:true,
                    multiPunch:true,
    
                    lateArrival1:true,
                    lateArrival2:true,
                    lateArrival3:true,
                    lateArrival4:true,
                    
                    dayDeduct1:true,
                    dayDeduct2:true,
                    dayDeduct3:true,
                    dayDeduct4:true,
    
                    lateComingRule:true,
                    deductFromAttendance:true,
                    deductFromLeave:true,
                    allowedLateDaysInMonth:true,
                    salaryCutPercentage:true,
                    continuous:true,
                }
            });
            if(policy){
                return res.status(200).json({
                    success:true,
                    message:"Policy found with given id.",
                    data:policy
                });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Policy not found with given id."
                });
            }
        }
        
        const allPolicy = await prisma.office_time_policy.findMany({
            select:{
                id:true,
                policyName:true,
                permittedLateArrival:true,
                pByTwo:true,
                absent:true,
                multiPunch:true,

                lateArrival1:true,
                lateArrival2:true,
                lateArrival3:true,
                lateArrival4:true,
                
                dayDeduct1:true,
                dayDeduct2:true,
                dayDeduct3:true,
                dayDeduct4:true,

                lateComingRule:true,
                deductFromAttendance:true,
                deductFromLeave:true,
                allowedLateDaysInMonth:true,
                salaryCutPercentage:true,
                continuous:true,
            }
        });
        if(allPolicy){
            return res.status(200).json({
                success:true,
                message : "All Policy",
                data : allPolicy || []
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Couldn't Found Policy to show"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message :"Internal Server Error! Can't show Policy",
            error:error.message
        });
    }
}
const updateOfficeTimePolicy=async (req,res)=>{
    try {
        const employeeId=req.employeeId;
        const {policyId,
                policyName,
                permittedLateArrival,
                pByTwo,
                absent,
                multiPunch,
                lateComingRule,
        }=req.body;
        let {lateArrival1,
                lateArrival2,
                lateArrival3,
                lateArrival4,
                dayDeduct1,
                dayDeduct2,
                dayDeduct3,
                dayDeduct4,

                deductFromAttendance,
                deductFromLeave,
                allowedLateDaysInMonth,
                salaryCutPercentage,
                continuous,
            }=req.body;

        const requiredFields=[
            "policyId","policyName","permittedLateArrival","pByTwo","absent","multiPunch","lateComingRule",
            "lateArrival1","lateArrival2","lateArrival3","lateArrival4","dayDeduct1","dayDeduct2","dayDeduct3","dayDeduct4",
            "deductFromAttendance","deductFromLeave","allowedLateDaysInMonth","salaryCutPercentage","continuous",
        ];
        const missingFields=requiredFields.filter((field)=>
            (!Object.prototype.hasOwnProperty.call(req.body,field)));
        if(missingFields.length>0){
            return res.status(400).json({
                success:false,
                message:`Following fields are missing: ${missingFields.join(", ")}`
            });
        }

        // do the data-type check at front-end.
        const check = helper.timeFormatValidator(permittedLateArrival, pByTwo, absent,lateArrival1,lateArrival2,lateArrival3,lateArrival4);
        if(check!='Pass'){
            return res.status(400).json({
                success:false,
                message:`${check}`
            });
        }

        const existingPolicy = await prisma.office_time_policy.findUnique({
            where:{policyName:policyName.trim()}
        })
        // console.log(existingPolicy)
        if(existingPolicy){
            return res.status(400).json({
                success:false,
                message:"Policy with same name already exists, with the name you want to update to!"
            });
        }

        //imp- validation
        //check for late-coming rule
        if(lateComingRule){
            //check all the fields required in lateComingRule
            if( !allowedLateDaysInMonth || !salaryCutPercentage){
                return res.status(400).json({
                    success:false,
                    message:"If late coming setting is enabled then late days allowed and salary cut percentage is required."
                });
            }

            if(!deductFromLeave && !deductFromAttendance){
                return res.status(400).json({
                    success:false,
                    message:"If late coming setting is enabled then either of deduct from attendance or deduct from leave is required."
                });
            }

            if(deductFromAttendance && deductFromLeave){
                return res.status(400).json({
                    success:false,
                    message:"If late coming setting is enabled then both deduct from attendance and deduct from leave can't be selected at same time."
                });
            }

            lateArrival1=null;
            lateArrival2=null;
            lateArrival3=null;
            lateArrival4=null;

            dayDeduct1=null;
            dayDeduct2=null;
            dayDeduct3=null;
            dayDeduct4=null;
        }

        if(lateArrival1 || lateArrival2 || lateArrival3 || lateArrival4){
            deductFromAttendance=false;
            deductFromLeave=false;
            allowedLateDaysInMonth=null;
            salaryCutPercentage=null;
            continuous=false;

            if(lateArrival1 && (helper.timeDurationInMinutes('00:00',lateArrival1)>59)){
                return res.status(400).json({
                    success:false,
                    message:"Late Rule 1 can not have time more than 59 minutes"
                });
            }
            if(lateArrival2 && ((15>helper.timeDurationInMinutes('00:00',lateArrival2))||(helper.timeDurationInMinutes('00:00',lateArrival2)>120))){
                console.log(helper.timeDurationInMinutes('00:00',lateArrival2));
                return res.status(400).json({
                    success:false,
                    message:"Late Rule 2 can not have time more than 2 hrs and less than 15 minutes"
                });
            }
            if(lateArrival3 && ((30>helper.timeDurationInMinutes('00:00',lateArrival3))||(helper.timeDurationInMinutes('00:00',lateArrival3)>180))){
                console.log(120<helper.timeDurationInMinutes('00:00',lateArrival3)<180)
                return res.status(400).json({
                    success:false,
                    message:"Late Rule 3 can not have time more than 3 hrs and less than 30 minutes"
                });
            }
            if(lateArrival4 && ((60>helper.timeDurationInMinutes('00:00',lateArrival4)) || (helper.timeDurationInMinutes('00:00',lateArrival4)>240))){
                return res.status(400).json({
                    success:false,
                    message:"Late Rule 4 can not have time more than 4 hrs and less than 1 Hr"
                });
            }
        }

        const policyUpdated = await prisma.office_time_policy.update({
            where:{id:policyId},
            data:{
                policyName:policyName.trim(),
                permittedLateArrival,
                pByTwo,
                absent,
                multiPunch,

                lateArrival1,
                lateArrival2,
                lateArrival3,
                lateArrival4,
                dayDeduct1,
                dayDeduct2,
                dayDeduct3,
                dayDeduct4,

                lateComingRule,
                deductFromAttendance,
                deductFromLeave,
                allowedLateDaysInMonth,
                salaryCutPercentage,
                continuous,
                updatedById:employeeId
            },
            select:{
                id:true,
                policyName:true,
                permittedLateArrival:true,
                pByTwo:true,
                absent:true,
                multiPunch:true,

                lateArrival1:true,
                lateArrival2:true,
                lateArrival3:true,
                lateArrival4:true,
                
                dayDeduct1:true,
                dayDeduct2:true,
                dayDeduct3:true,
                dayDeduct4:true,

                lateComingRule:true,
                deductFromAttendance:true,
                deductFromLeave:true,
                allowedLateDaysInMonth:true,
                salaryCutPercentage:true,
                continuous:true,
            }
        });

        if(policyUpdated){
            // we will re-calculate the attendance record according to new policy at the time of policy updation.
            console.log("Policy updated, starting recalculation in background...");

            ////////////////////////////////////////////////////////////////
            //currently we have not given the ref of recalculation
            ////////////////////////////////////////////////////////////////
             // Run recalculation in the background (non-blocking)
            setImmediate(async () => {
                try {
                    await attendanceHelper.recalculateAttendance(_id);
                    console.log("Recalculation completed successfully.");
                } catch (error) {
                    console.error("Recalculation failed:", error);
                }
            });

            return res.status(200).json({
                success:true,
                message:"Policy updated Successfully!"
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Db Issue! Couldn't Update Policy"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error, Couldn't Update.",
            error:error.message
        });
    }
}
//strictly for backend
//should not be deleted if policy is assigned to an employee
const deleteOfficeTimePolicy = async (req,res)=>{
    try {
        const {policyId} = req.body;
        if(!policyId){
            return res.status(400).json({
                success:false,
                message:"Policy Id Not Provided."
            });
        }

        //should not be deleted if policy is assigned to an employee
        const response = await helper.isAssignedToEmployee({officeTimePolicyId : policyId});
        if(!response.success){
            return res.status(403).json(response);
        }

        try {
            const isDeleted = await prisma.office_time_policy.delete({
                where:{id:policyId}
            });

            if(isDeleted){
                console.log("Policy Deleted Successfully")
                return res.status(202).json({
                success:true,
                message:`Policy : ${isDeleted.policyName} deleted Successfully`
            });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message: "DB Issue! Policy Not Deleted."
                    });
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success:false,
                message : "Couldn't Delete Policy. Maybe it's Already Deleted. Check Before Trying Again.",
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


//reporting manager model-crud
const addReportingManager = async(req,res)=>{
    try {
        const employeeId = req.employeeId;
        const {name}=req.body;

        if(!name){
            return res.status(400).json({
                success:false,
                message:"Name is required!",
            });
        }
        const isSaved = await prisma.reporting_manager.create({
            data:{
                name:name.trim(),
                createdById:employeeId,
                updatedById:employeeId,
            },
            select:{
                id:true,
                name:true,
            }
        });

        if(isSaved){
            return res.status(200).json({
                success:true,
                message:"New Reporting Manager Added Successfully",
                data:isSaved
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"DB Issue! Reporting Manager Not Saved. Try Again Later",
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!",
            error:error.message
        });
    }
}
const showReportingManager = async(req,res)=>{
    try {
        const {managerId}=req.query;

        const whereCondition = {
            ...(managerId ? {managerId}:{})
        }
        const allReportingManagers = await prisma.reporting_manager.findMany({
            where:whereCondition,
            select:{
                id:true,
                name:true
            }
        });

        if(allReportingManagers){
            if(allReportingManagers.length===0){
                return res.status(200).json({
                    success:true,
                    message:"There are no Reporting Managers to show.",
                    data:[]
                }); 
            }

            return res.status(200).json({
                success:true,
                message:"List of all reporting managers",
                data:allReportingManagers
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Could not fetch data.",
                data:[]
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        });
    }
}
const updateReportingManager = async(req,res)=>{
    try {
        const employeeId = req.employeeId;
        const {managerId,name}= req.body;

        if(!managerId || !name){
            return res.status(400).json({
                success:false,
                message:"Manager ID and new name is required for update.",
            })
        }

        const alreadyExist= await prisma.reporting_manager.findFirst({
            where:{name:name}
        });
        if(alreadyExist){
            return res.status(400).json({
                success:false,
                message:"The Reporting Manager 'name' you wish to update to already exists.",
                data:{
                    name:alreadyExist.name
                }
            })
        }

        const isUpdated = await prisma.reporting_manager.update({
            where:{id:managerId},
            data:{
                name:name.trim(),
                updatedById:employeeId
            },
            select:{
                id:true,
                name:true
            }
        });

        if(isUpdated){
            return res.status(200).json({
                success:true,
                message:"Reporting Manager name has been updated successfully.",
                data:isUpdated
            });
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Failed to update Reporting Manager."
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        });
    }
}
//strictly for backend
const deleteReportingManager = async(req,res)=>{
    try {
        const {managerId} = req.body;
        if(!managerId){
            return res.status(400).json({
                success:false,
                message:"Manager id is not provided."
            });
        }
        try{
            const isDeleted = await prisma.reporting_manager.delete({
                where:{id:managerId}
            })

            if(isDeleted){
                return res.status(200).json({
                    success:true,
                    message:"Reporting Manager deleted Successfully.",
                    data:isDeleted
                });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Couldn't Delete. Try Again",
                })
            }
        }
        catch(error){
            console.log(error);
            return res.status(400).json({
                success:false,
                message : "Couldn't Delete Reporting Manager. Maybe it's Already Deleted. Check Before Trying Again.",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error.",
            error:error.message
        });
    }
}

module.exports={
    addDepartment,
    showDepartments,
    updateDepartment,
    deleteDepartment,

    addDesignation,
    showDesignation,
    updateDesignation,
    deleteDesignation,
    
    addCompany,
    showCompany,
    updateCompany,
    deleteCompany,

    addBranch,
    showBranch,
    updateBranchDetails,
    deleteBranch,

    addQualification,
    showQualification,
    updateQualification,
    deleteQualification,

    addDegree,
    showDegree,
    updateDegree,
    deleteDegree,

    addWorkType,
    showWorkType,
    updateWorkType,

    addShift,
    showShift,
    updateShift,
    deleteShift,

    addOfficeTimePolicy,   
    showOfficeTimePolicy,
    updateOfficeTimePolicy,
    deleteOfficeTimePolicy,

    addReportingManager,
    updateReportingManager,
    showReportingManager,
    deleteReportingManager
}