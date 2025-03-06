"use client";

import {
  createBook,
  deleteBook,
  getAuthorList,
  getAuthors,
  getBooks,
} from "@/backend/book";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Spinner,
  Pagination,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Link,
  Select,
  SelectItem,
  Code,
  addToast,
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { current } from "tailwindcss/colors";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Home() {
  const [books, setBooks] = useState({
    content: [],
    total: 0,
    current: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [modelState, setModelState] = useState({
    create: false,
    delete: false,
    edit: false
  });
  const [deleteBook, setDeleteBook] = useState(null);
  const [editBook,setEditBook] = useState({
    isbn:null,name:null,genre:null,bookCategory:null,publishedYear:null
  });

  useEffect(() => {
    setIsLoading(true);
    refresh();
  }, [searchText, page]);

  const refresh = () => {
    getBooks(searchText, page)
      .then((data) => {
        setBooks(data);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div class="w-full flex flex-col gap-4 px-8 py-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold">Books</h1>
      <div className="flex gap-2">
        <Input
          startContent={<MagnifyingGlassIcon className="w-4" />}
          placeholder="Search By ISBN or Title"
          className=""
          onInput={(e) => {
            setSearchText(e.target.value);
            setPage(0);
          }}
        />
        <Button
          radius="sm"
          startContent={<PlusIcon width={28} />}
          onPress={() => setModelState((state) => ({ ...state, create: true }))}
          color="primary"
          variant="solid"
        >
          Add New Book
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>ISBN</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Genre</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Published Year</TableColumn>
          <TableColumn>Author(s)</TableColumn>
          <TableColumn>Total Copies</TableColumn>
          <TableColumn>Available Copies</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<Spinner />}
          items={books?.content}
        >
          {({ isbn, name, genre, bookCategory, publishedYear, authors,totalCopies,copiesAvailable  }) => (
            <TableRow key={isbn}>
              <TableCell>{isbn}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{genre}</TableCell>
              <TableCell>{bookCategory}</TableCell>
              <TableCell>{publishedYear}</TableCell>
              <TableCell>
                {Object.values(authors).length != 0 ? Object.values(authors).join(",") : "-"}
              </TableCell>
              <TableCell>{totalCopies}</TableCell>
              <TableCell>{copiesAvailable}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <PencilIcon
                    width={14}
                    className="hover:cursor-pointer hover:text-blue-500"
                    onClick={()=>{
                      setModelState((state) => ({ ...state, edit: true }));
                      console.log(authors)
                      setEditBook({isbn,name,genre,bookCategory,publishedYear,authors})
                    }}
                  />
                  <TrashIcon
                    onClick={() => {
                      setModelState((state) => ({ ...state, delete: true }));
                      setDeleteBook({ isbn, name });
                    }}
                    width={14}
                    className="hover:cursor-pointer hover:text-red-500"
                  />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          page={page + 1}
          total={books.total != 0 ? books.total : 0}
          onChange={(_page) => setPage(_page - 1)}
        />
      </div>
      <CreateBook
        isOpen={modelState.create}
        onOpenChange={() =>
          setModelState((state) => ({ ...state, create: !state.create }))
        }
        onRefresh={refresh}
      />
      <DeleteBook
        isOpen={modelState.delete}
        onOpenChange={() =>
          setModelState((state) => ({ ...state, delete: !state.delete }))
        }
        book={deleteBook}
        onRefresh={refresh}
      />
      <EditBook 
        book={editBook}
        isOpen={modelState.edit}
        onOpenChange={() =>
          setModelState((state) => ({ ...state, edit: !state.edit }))
        }
        onRefresh={refresh}

      />
    </div>
  );
}

const EditBook = ({book,isOpen,onOpenChange,onRefresh}) =>{
  const [authorList, setAuthorList] = useState([]);
  const [authorIDs, setAuthorIDs] = useState(new Set([]));

  useEffect(() => {
    getAuthorList().then((authors_) => setAuthorList(authors_));
  }, []);

  const {isbn,name,genre,bookCategory,publishedYear,authors} = book;

  const { register, handleSubmit,reset,getValues  } = useForm({
    defaultValues:{
      isbn,name,genre,bookCategory,publishedYear
    }
  });

  useEffect(()=>{
    if(authors){
      setAuthorIDs(new Set([...Object.keys(authors).map(s=>s.toString())]));   
    } 
  },[authors])

  useEffect(()=>{
     if(authors){
      reset({
        isbn,
        name,
        genre,
        bookCategory,
        publishedYear,
        authorIDs:Object.keys(authors).map(s=>s.toString())
      })
     }

    
  },[isbn])

  const onSubmit = (values)=>{
    values.authorIDs = Array.from(authorIDs).join(",");
    console.log(values)
    createBook(values).then(()=>{
      onOpenChange()
      onRefresh()
      toast.success("Changes Saved Successfully!")
    })
  }
    
    return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Edit Book
            </ModalHeader>
            <ModalBody>
              <div className="flex gap-2 flex-col">
                <Input
                  label="ISBN"
                  placeholder="Enter Book's ISBN"
                  variant="bordered"
                  {...register("isbn")}
                  disabled
                />
                <Input
                  label="Title"
                  placeholder="Enter Book's Title"
                  variant="bordered"
                  {...register("name")}
                />
                <Select
                  label="Category"
                  placeholder="Select Book's Category"
                  variant="bordered"
                  {...register("bookCategory")}
                >
                  <SelectItem key="AUDIOBOOK">Audiobook</SelectItem>
                  <SelectItem key="PAPERBACK">Paperback</SelectItem>
                  <SelectItem key="EBOOK">Ebook</SelectItem>
                  <SelectItem key="HARDCOVER">Hardcover</SelectItem>
                </Select>
                <Select
                  label="Genre"
                  placeholder="Select Book's Genre"
                  variant="bordered"
                  {...register("genre")}
                >
                  <SelectItem key="Fiction">Fiction</SelectItem>
                  <SelectItem key="Mystery">Mystery</SelectItem>
                  <SelectItem key="Science Fiction">Science Fiction</SelectItem>
                  <SelectItem key="Fantasy">Fantasy</SelectItem>
                  <SelectItem key="Non-fiction">Non-fiction</SelectItem>
                  <SelectItem key="Biography">Biography</SelectItem>
                  <SelectItem key="Thriller">Thriller</SelectItem>
                  <SelectItem key="Romance">Romance</SelectItem>
                  <SelectItem key="History">History</SelectItem>
                  <SelectItem key="Self-Help">Self-Help</SelectItem>
                  <SelectItem key="Philosophy">Philosophy</SelectItem>
                  <SelectItem key="Horror">Horror</SelectItem>
                  <SelectItem key="Adventure">Adventure</SelectItem>
                  <SelectItem key="Poetry">Poetry</SelectItem>
                  <SelectItem key="Drama">Drama</SelectItem>
                </Select>
                <Input
                  label="Published Year"
                  placeholder="Enter Book's Published Year"
                  variant="bordered"
                  type="number"
                  defaultValue="2000"
                  {...register("publishedYear")}
                />
                <Select
                  label="Author(s)"
                  placeholder="Select Book's Author(s)"
                  variant="bordered"
                  selectionMode="multiple"
                  selectedKeys={authorIDs}
                  onSelectionChange={setAuthorIDs}
                >
                  {authorList.map((author) => (
                    <SelectItem key={author.id}>
                      {author.firstName + " " + author.lastName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

const CreateBook = ({ isOpen, onOpenChange,onRefresh }) => {
  const [authors, setAuthors] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    getAuthorList().then((authors_) => setAuthors(authors_));
  }, []);

  const onSubmit = (values) => {
    console.log("Values: ", values);
    createBook(values).then(()=>{
      onOpenChange()
      onRefresh()
    })
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Create Book
            </ModalHeader>
            <ModalBody>
              <form className="flex gap-2 flex-col">
                <Input
                  label="ISBN"
                  placeholder="Enter Book's ISBN"
                  variant="bordered"
                  {...register("isbn")}
                />
                <Input
                  label="Title"
                  placeholder="Enter Book's Title"
                  variant="bordered"
                  {...register("name")}
                />
                <Select
                  label="Category"
                  placeholder="Select Book's Category"
                  variant="bordered"
                  {...register("bookCategory")}
                >
                  <SelectItem key="AUDIOBOOK">Audiobook</SelectItem>
                  <SelectItem key="PAPERBACK">Paperback</SelectItem>
                  <SelectItem key="EBOOK">Ebook</SelectItem>
                  <SelectItem key="HARDCOVER">Hardcover</SelectItem>
                </Select>
                <Select
                  label="Genre"
                  placeholder="Select Book's Genre"
                  variant="bordered"
                  {...register("genre")}
                >
                  <SelectItem key="Fiction">Fiction</SelectItem>
                  <SelectItem key="Mystery">Mystery</SelectItem>
                  <SelectItem key="Science Fiction">Science Fiction</SelectItem>
                  <SelectItem key="Fantasy">Fantasy</SelectItem>
                  <SelectItem key="Non-fiction">Non-fiction</SelectItem>
                  <SelectItem key="Biography">Biography</SelectItem>
                  <SelectItem key="Thriller">Thriller</SelectItem>
                  <SelectItem key="Romance">Romance</SelectItem>
                  <SelectItem key="History">History</SelectItem>
                  <SelectItem key="Self-Help">Self-Help</SelectItem>
                  <SelectItem key="Philosophy">Philosophy</SelectItem>
                  <SelectItem key="Horror">Horror</SelectItem>
                  <SelectItem key="Adventure">Adventure</SelectItem>
                  <SelectItem key="Poetry">Poetry</SelectItem>
                  <SelectItem key="Drama">Drama</SelectItem>
                </Select>
                <Input
                  label="Published Year"
                  placeholder="Enter Book's Published Year"
                  variant="bordered"
                  type="number"
                  defaultValue="2000"
                  {...register("publishedYear")}
                />
                <Select
                  label="Author(s)"
                  placeholder="Select Book's Author(s)"
                  variant="bordered"
                  selectionMode="multiple"
                  {...register("authorIDs")}
                >
                  {authors.map((author) => (
                    <SelectItem key={author.id}>
                      {author.firstName + " " + author.lastName}
                    </SelectItem>
                  ))}
                </Select>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Create a New Book
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

const DeleteBook = ({ isOpen, onOpenChange, book, onRefresh }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Book
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete the book titled <br />
                <Code size="sm" color="danger" className="text-xs">
                  {book.name}
                </Code>
                ?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="bordered"
                radius="sm"
                onPress={() => {
                  deleteBook(book.isbn)
                    .then(() => onRefresh())
                    .then(() => onClose());
                }}
              >
                Yes, Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
