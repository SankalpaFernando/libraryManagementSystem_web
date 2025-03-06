import toast from "react-hot-toast";
import client from "./index";

export const userLogin=async(email,password)=>{
    try{
        const response = await client.post("http://localhost:8081/user/login",{
            email,
            password
        })
    
        console.log(response)
    
        if(response.status==200){
           await localStorage.setItem("jwtToken",response.data);
           toast.success("User Login Success")
           
            return "success"
        }
        
        throw new Error("Wrong Username & Password Combination")
    }catch (error) {
        // Log the error for debugging purposes
        console.error(error);

        // Show a generic error message if login fails
        throw new Error(error.response ? error.response.data.message : "An error occurred while logging in");
    }

}