import toast from "react-hot-toast";
import client from "./index";

export const createMember = async({first_name,last_name,joined_date,phone_number,address})=>{
    const response = await client.post(`http://localhost:8081/member`,{
        firstName:first_name,
        lastName: last_name,
        joinedDate:joined_date,
        phoneNumber:phone_number,
        address
    },{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Member Created Successfully")

}

export const getMembers = async(search,page=0)=>{
    console.log(search)
    const response = await client.get(`http://localhost:8081/member?search=${search}&page=${page}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })

    return response.data;
}

export const updateMember = async(id,first_name,last_name,joinedDate,address,phoneNumber)=>{
    const response = await client.put(`http://localhost:8081/member`,{
        id,
        firstName:first_name,
        lastName:last_name,
        joinedDate,
        address,
        phoneNumber
    },{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Member Updated Successfully")

}

export const deleteMember = async(id)=>{
    const response = await client.delete(`http://localhost:8081/member?member_id=${id}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })

    console.log(response);
    toast.success("Member Deleted")

}
