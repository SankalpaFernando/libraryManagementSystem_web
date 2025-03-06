import toast from "react-hot-toast";
import client from "./index";

export const getBooks = async(search,page=0)=>{
    const response = await client.get(`http://localhost:8081/book/?search=${search}&page=${page}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    console.log(response.data)
    return response.data;
}

export const getAuthorList = async()=>{
    const response = await client.get(`http://localhost:8081/author/list/`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    return response.data;
}


export const deleteBook = async(isbn)=>{
    const response = await client.delete(`http://localhost:8081/book/?ISBN=${isbn}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Book Deleted Successfully")
    
    console.log(response);
}

export const createBook = async({isbn,name,bookCategory,genre,publishedYear,authorIDs})=>{
    authorIDs=(authorIDs.split(","))
    const response = await client.post(`http://localhost:8081/book/`,{
        isbn,
        name,
        bookCategory,
        genre,
        publishedYear,
        authorIDs
    },{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        },
        
    })
    toast.success("Book Created Successfully")

    
}

export const getBookCopies = async(search,page=0)=>{
    const response = await client.get(`http://localhost:8081/book/copy?search=${search}&page=${page}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    console.log(response.data)
    return response.data;
}

export const getBookList = async(search,page=0)=>{
    const response = await client.get(`http://localhost:8081/book/list`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    console.log(response.data)
    return response.data;
}

export const addBookCopy = async(ISBN)=>{
    const response = await client.get(`http://localhost:8081/book/copy/add/?ISBN=${ISBN}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Copy of Book Created Successfully")

    return response.data;
}

export const updateBookCopy = async(id,status)=>{
    const response = await client.put(`http://localhost:8081/book/copy/status`,{
        id,
        status
    },{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })
    toast.success("Book Copy Updated")

}


export const deleteBookCopy = async(id)=>{
    const response = await client.delete(`http://localhost:8081/book/copy?id=${id}`,{
        headers:{
            Authorization: "Bearer "+localStorage.getItem("jwtToken")
        }
    })

    console.log(response);
    toast.success("Book Copy Updated")

}
