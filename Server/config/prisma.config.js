// require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// (async ()=>{
//     await prisma.$connect();
//     console.log("\x1b[42m\x1b[30m%s\x1b[0m","✅ Prisma connected successfully to our MySQL DB!");
//     const result = await prisma.$queryRaw`
//             SELECT DATABASE() AS dbName, USER() AS dbUser, @@hostname AS hostName;
//         `;
//     console.log("\x1b[42m\x1b[30m%s\x1b[0m",`Connected Database ${result[0].dbName}, located on ${result[0].hostName}, as user ${result[0].dbUser}`);
// })()

module.exports=prisma;