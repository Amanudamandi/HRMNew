const router = require("express").Router();

// const tokenVerify = require("../../middlewares/tokenVerification");
const commonController = require("../../controllers/common/common.controller");

//department
router.post("/add-department",commonController.addDepartment);
router.get("/show-department",commonController.showDepartments);
router.put("/update-department",commonController.updateDepartment);   //---> changed the api, tell frontend
router.delete("/delete-department",commonController.deleteDepartment);

//designation
router.post("/add-designation",commonController.addDesignation);
router.get("/show-designation",commonController.showDesignation);
router.put("/update-designation",commonController.updateDesignation);   //---> changes in api, tell frontend.
router.delete("/delete-designation",commonController.deleteDesignation);

//company
router.post("/add-company",commonController.addCompany);
router.get("/show-company",commonController.showCompany);
router.put("/update-company",commonController.updateCompany);
router.delete("/delete-company",commonController.deleteCompany);

//branch
router.post("/add-branch",commonController.addBranch);
router.get("/show-branch",commonController.showBranch);
router.put("/update-branch",commonController.updateBranchDetails);
router.delete("/delete-branch",commonController.deleteBranch);

//qualification
router.post("/add-qualification",commonController.addQualification);
router.get("/show-qualification",commonController.showQualification);
router.put("/update-qualification",commonController.updateQualification);
router.delete("/delete-qualification",commonController.deleteQualification);

//degree
router.post("/add-degree",commonController.addDegree);
router.get("/show-degree",commonController.showDegree);
router.put("/update-degree",commonController.updateDegree);
router.delete("/delete-degree",commonController.deleteDegree);

//workType
router.post("/add-workType",commonController.addWorkType);
router.get("/show-workType",commonController.showWorkType);
router.put("/update-workType",commonController.updateWorkType);

//shift
router.post("/add-shift",commonController.addShift);
router.get("/show-shift",commonController.showShift);
router.put("/update-shift",commonController.updateShift);
router.delete("/delete-shift",commonController.deleteShift);

//officeTimePolicy
router.post("/add-officeTimePolicy",commonController.addOfficeTimePolicy);
router.get("/show-officeTimePolicy",commonController.showOfficeTimePolicy);
router.put("/update-officeTimePolicy",commonController.updateOfficeTimePolicy);
router.delete("/delete-officeTimePolicy",commonController.deleteOfficeTimePolicy);

//reporting manager
router.post("/add-reportingManager",commonController.addReportingManager);
router.get("/show-reportingManager",commonController.showReportingManager);
router.put("/update-reportingManager",commonController.updateReportingManager);
router.delete("/delete-reportingManager",commonController.deleteReportingManager)


module.exports=router