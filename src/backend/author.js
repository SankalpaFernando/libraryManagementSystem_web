import toast from "react-hot-toast";
import client from "./index";

export const getAuthors = async(search,page=0)=>{
    const response = await client.get(`https://librarymanagement.up.railway.app/author?search=${search}&page=${page}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    return response.data;
}

export const createAuthor = async({first_name,last_name})=>{
    const response = await client.post(`https://librarymanagement.up.railway.app/author`,{
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
    const response = await client.delete(`https://librarymanagement.up.railway.app/author/${id}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Author Deleted Successfully")

}

export const updateAuthor = async(id,first_name,last_name)=>{
    const response = await client.put(`https://librarymanagement.up.railway.app/author`,{
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

