import toast from "react-hot-toast";
import client from "./index";

export const getAuthors = async(search,page=0)=>{
    const response = await client.get(`http://localhost:8081/author?search=${search}&page=${page}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    return response.data;
}

export const createAuthor = async({first_name,last_name})=>{
    const response = await client.post(`http://localhost:8081/author`,{
        firstName:first_name,
        lastName: last_name
    },{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Author Created Successfully")

}

export const deleteAuthor = async(id)=>{
    const response = await client.delete(`http://localhost:8081/author/${id}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Author Deleted Successfully")

}

export const updateAuthor = async(id,first_name,last_name)=>{
    const response = await client.put(`http://localhost:8081/author`,{
        id,
        firstName:first_name,
        lastName:last_name
    },{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Author Updated Successfully")

}

