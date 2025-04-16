const router = require("express").Router();

const empController = require("../../controllers/emp/employee.controller");
const joiningFormController = require("../../controllers/joiningForm/joiningForm.controller");
const upload = require("../../middlewares/multer.middleware");
const tokenVerify = require("../../middlewares/tokenVerification");

router.post("/add-admin",tokenVerify(["Admin"]),empController.addAdmin);
router.post("/login",empController.login);
router.get("/logout",tokenVerify(),empController.logout);
router.post("/register-employee",tokenVerify(["Admin"]),empController.registerEmp);
router.get("/show-employee",tokenVerify(["Admin"]),empController.showEmployee);
router.get("/show-joiningHr",empController.showJoiningHr);
router.put("/update-personalData",tokenVerify(["Admin"]),empController.updateEmpPersonalData);


//joining Forms
router.post("/add-joiningForm",upload.fields([
    { name: 'aadharCardAttachment', maxCount: 1 },
    { name: 'panCardAttachment', maxCount: 1 },
    { name: 'bankAttachment', maxCount: 1 },
    { name: 'joiningFormAttachment', maxCount: 1 },
    { name: 'photoAttachment', maxCount: 1 },
    { name: 'class10Attachment', maxCount: 1 },
    { name: 'class12Attachment', maxCount: 1 },
    { name: 'graduationAttachment', maxCount: 1 },
    { name: 'postGraduationAttachment', maxCount: 1 },
    { name: 'signatureAttachment', maxCount: 1 },
]),joiningFormController.addJoiningForm);

router.get("/show-joiningForm",tokenVerify(["Admin"]),joiningFormController.showAllJoiningForms);
router.put("/reject-joiningForm",tokenVerify(["Admin"]),joiningFormController.joiningFormRejection);
router.put("/approve-joiningForm",tokenVerify(["Admin"]),joiningFormController.joiningFormApproval);
router.get("/setPending-joiningForm",tokenVerify(["Admin"]),joiningFormController.setJoiningFormStatusToPending);


module.exports=router
