const router = require("express").Router();
const tokenVerify = require("../../middlewares/tokenVerification");

const attendanceController = require("../../controllers/attendance/attendance.controller");


// router.post("/")
router.post("/mark-attendance",tokenVerify(),attendanceController.recordOnlineAttendance);
router.get("/view-attendance",tokenVerify(),attendanceController.viewAttendance);

module.exports=router;