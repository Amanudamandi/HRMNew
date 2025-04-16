const zkInstance = require("zkteco-js");
const { use } = require("../../../routes/auth/auth.router");

const TCP_TIMEOUT = 300000; //TCP timeout after 5 min of ideal state
const UDP_INPORT = 5000;


const testConnection = async () => {
    const device = new zkInstance(process.env.BIOMETRIC_DEVICE_IP,
        process.env.BIOMETRIC_DEVICE_PORT,
        TCP_TIMEOUT,
        UDP_INPORT
    );
    try {
        console.log("Testing Connection...")
        // Create socket connection to the device
        await device.createSocket();
       
        // console.log(await device.getUsers());
        const users = await device.getUsers();
        if(users){
            console.log("Connection Successful...");
            console.log(`You have currently ${users.data.length} users.`)
        }
        await device.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
    }
};

testConnection();