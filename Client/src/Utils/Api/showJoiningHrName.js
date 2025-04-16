import axios from "axios";
axios.defaults.withCredentials = true;
export const showJoiningHrName = async( setJoiningHrNameData) =>{
    try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/auth/show-joiningHr`);
        setJoiningHrNameData(response?.data?.data);
    } catch (error) {
        console.log("fetch the Joining Hr  name", error);
    }
}