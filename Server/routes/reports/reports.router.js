const router = require("express").Router();
const tokenVerify = require("../../middlewares/tokenVerification");

const reportController = require("../../controllers/reports/attendanceReport.controller");


// router.post("/")
router.get("/download-dailyReport",reportController.downloadDailyReport);

module.exports=router;