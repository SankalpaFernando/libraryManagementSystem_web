"use client";

import {
    addBookCopy,
  createBook,
  deleteBook,
  deleteBookCopy,
  getAuthorList,
  getAuthors,
  getBookCopies,
  getBookList,
  getBooks,
  updateBookCopy,
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
  Autocomplete,
  AutocompleteItem,
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
  const [editBook,setEditBook] = useState({isbn:null,status:null})

  useEffect(() => {
    setIsLoading(true);
    refresh();
  }, [searchText, page]);

  const refresh = () => {
    getBookCopies(searchText, page)
      .then((data) => {
        setBooks(data);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div class="w-full flex flex-col gap-4 px-8 py-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold">Book Copies</h1>
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
          <TableColumn>ID</TableColumn>
          <TableColumn>ISBN</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<Spinner />}
          items={books?.content}
        >
          {({id,isbn,name,status  }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{isbn}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <PencilIcon
                  onClick={() => {
                    setModelState((state) => ({ ...state, edit: true }));
                    setEditBook({isbn,status,id})
                  }}
                    width={14}
                    className="hover:cursor-pointer hover:text-blue-500"
                  />
                  <TrashIcon
                    onClick={() => {
                      setModelState((state) => ({ ...state, delete: true }));
                      setDeleteBook({ isbn, name,id });
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
         isOpen={modelState.edit}
         onOpenChange={() =>
           setModelState((state) => ({ ...state, edit: !state.edit }))
         }
         book={editBook}
        onRefresh={refresh}

      />
    </div>
  );
}

const CreateBook = ({ isOpen, onOpenChange, onRefresh }) => {
  const [books, setBooks] = useState([]);
  const { register, handleSubmit,formState,setValue,getValues} = useForm();
  const [selectedBook,setSelectedBook] = useState(null);

  useEffect(() => {
    
  }, []);

  const onSubmit = (values) => {
    console.log("Values: ", values);
    createBook(values).then(()=>{
        onRefresh();
        onOpenChange();
    })
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Create Copy Book
            </ModalHeader>
            <ModalBody>
              <form className="flex gap-2 flex-col">
                
                <Autocomplete
                  label="Search"
                  placeholder="Search the Book"
                  variant="bordered"
                  selectedKey={selectedBook}
                  onSelectionChange={(key)=>setSelectedBook(key)}
                  onInputChange={(e)=>{
                    getBooks(e,0).then(data=>setBooks(data.content))
                  }}
                  items={books}
                >
                 {(item) => (
                    <AutocompleteItem key={item.isbn} className="capitalize">
                   <b>{item.isbn}</b>{" "}{item.name}
                    </AutocompleteItem>
                )}
                </Autocomplete>
                <Input       variant="bordered"
                      label="ISBN"

 disabled value={selectedBook}  />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={()=>{
                if(selectedBook !=null){
                    addBookCopy(selectedBook).then(()=>{
                        onOpenChange()
                        setSelectedBook();
                        onRefresh();
                    }).catch()
                }
              }}>
                Create a Book Copy
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

const EditBook = ({ isOpen, onOpenChange, onRefresh,book }) => {
    const [books, setBooks] = useState([]);
    const { register, handleSubmit,formState,setValue,getValues} = useForm();
  
    useEffect(() => {
      if(book){
        setValue("isbn",book.isbn);
        setValue("id",book.id);
        setValue("status",book.status)
      }
    }, [book]);
  
    const onSubmit = (values) => {
      console.log("Values: ", values);
      createBook(values).then(()=>{
          onRefresh();
          onOpenChange();
      })
    };
  
    return (
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form >
              <ModalHeader className="flex flex-col gap-1">
                Update Book Copy
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-2 flex-col">
                  <Input {...register('isbn')} variant="bordered" label="ISBN" disabled  />
                  <Input {...register('id')} variant="bordered" label="ID" disabled  />
                  <Select {...register('status')}>
                    <SelectItem key="UNAVAILABLE">UNAVAILABLE</SelectItem>
                    <SelectItem key="AVAILABLE">AVAILABLE</SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={()=>{
                      updateBookCopy(book.id,getValues().status).then(()=>{
                          onOpenChange()
                          onRefresh();
                      }).catch()
                }}>
                  Save Changes
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
                Are you sure you want to delete the copy of book titled <br />
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
                  deleteBookCopy(book.id)
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
