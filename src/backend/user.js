import toast from "react-hot-toast";
import client from "./index";

export const userLogin=async(email,password)=>{
    try{
        const response = await client.post("https://serverlibrarymanagement.up.railway.app/user/login",{
            email,
            password
        })
    
        if(response.status==200){
           await localStorage.setItem("jwtToken",response.data);
           toast.success("User Login Success")
           
          return "success"
        }
        
        throw new Error("Wrong Username & Password Combination")
    }catch (error) {
        throw new Error(error.response ? error.response.data.message : "An error occurred while logging in");
    }

}