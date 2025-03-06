import axios from "axios";
import toast from "react-hot-toast";

const client = axios.create({
    url:"https://serverlibrarymanagement.up.railway.app"
})

client.interceptors.response.use(response=>response,async error=>{
    if(error?.response?.status ===403){
        toast.error("Session Expired")
    //    window.location.href = "/login"
    }
})


export default client;