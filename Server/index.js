require("dotenv").config();
const express=require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

//routers
const empRouter = require("./routes/auth/auth.router");
const commonRouter = require("./routes/common/common.router");
const attendanceRouter = require("./routes/attendance/attendance.router");
const reportRouter = require("./routes/reports/reports.router");
const tokenVerify = require("./middlewares/tokenVerification");
//custom runner
// const seedRunner = require("./modelSeed/seedValues");
const prisma= require("./config/prisma.config");
const biometricDevice = require("./controllers/attendance/biometric_device/biometricConnection");
// const tester=require("./controllers/test");

const app=express();

app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials:true
}));


app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended:true,limit:'10mb'}));
app.use((req, res, next) => {
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)) // Convert to IST
    .toISOString()
    .replace("T", " ") // Replace "T" with space for readability
    .replace("Z", " IST"); // Add "IST" at the end
    
    console.log(`[${istTime}] ${req.method} ${req.url}`);
    next();
});


//using routers
app.use("/auth",empRouter);
app.use("/common",tokenVerify(["Admin"]),commonRouter);
app.use("/attendance",attendanceRouter);
app.use("/report",reportRouter);


(async ()=>{
    await prisma.$connect();
    console.log("\x1b[42m\x1b[30m%s\x1b[0m","✅ Prisma connected successfully to our MySQL DB!");
    const result = await prisma.$queryRaw`
            SELECT DATABASE() AS dbName, USER() AS dbUser, @@hostname AS hostName;
        `;
    console.log("\x1b[42m\x1b[30m%s\x1b[0m",`Connected Database ${result[0].dbName}, located on ${result[0].hostName}, as user ${result[0].dbUser}`);
})()
.then(()=>{
    const port = process.env.SERVER_PORT || 8000;
    app.listen(port,()=>{
        console.log("App is listening on port ",port);
    });

    // biometricDevice.biometricDeviceHandler();
})
.catch((error)=>{
    console.log("\x1b[41m\x1b[30m%s\x1b[0m","❌ Prisma connection failed:", error); 
})


// tester()