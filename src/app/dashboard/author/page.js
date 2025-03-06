"use client";

import { deleteBook, getBooks } from "@/backend/book";
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
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { current } from "tailwindcss/colors";
import { useForm } from "react-hook-form";
import { createAuthor, deleteAuthor, getAuthors, updateAuthor } from "@/backend/author";

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
    edit: false,
  });
  const [deleteBook, setDeleteBook] = useState(null);
  const [editBook, setEditBook] = useState({});

  useEffect(() => {
    setIsLoading(true);
    refresh();
  }, [searchText, page]);

  const refresh = () => {
    getAuthors(searchText, page)
      .then((data) => {
        setBooks(data);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div class="w-full flex flex-col gap-4 px-8 py-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold">Authors</h1>
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
          Add New Author
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>First Name</TableColumn>
          <TableColumn>Last Name</TableColumn>
          <TableColumn>Book Count</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<Spinner />}
          items={books?.content}
        >
          {({ id, firstName, lastName, book_count }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{firstName}</TableCell>
              <TableCell>{lastName}</TableCell>
              <TableCell>{book_count}</TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <PencilIcon
                    width={14}
                    className="hover:cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      setModelState((state) => ({ ...state, edit: true }));
                      console.log(firstName)
                      setEditBook({
                        id,
                        first_name: firstName,
                        last_name: lastName,
                      });
                    }}
                  />
                  <TrashIcon
                    onClick={() => {
                      setModelState((state) => ({ ...state, delete: true }));
                      setDeleteBook({ id });
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
      <CreateAuthor
        isOpen={modelState.create}
        onOpenChange={() => {
          setModelState((state) => ({ ...state, create: !state.create }));
          refresh();
        }}
      />
      <DeleteAuthor
        isOpen={modelState.delete}
        onOpenChange={() =>
          setModelState((state) => ({ ...state, delete: !state.delete }))
        }
        book={deleteBook}
        onRefresh={refresh}
      />
      <EditAuthor
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

const CreateAuthor = ({ isOpen, onOpenChange }) => {
  const [authors, setAuthors] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getAuthors().then((authors_) => setAuthors(authors_));
  }, []);

  const onSubmit = async (values) => {
    createAuthor(values)
      .then(() => onOpenChange())
      .then(reset);
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Create Author
            </ModalHeader>
            <ModalBody>
              <Input
                label="First Name"
                placeholder="Enter Author's First Name"
                variant="bordered"
                {...register("first_name")}
              />
              <Input
                label="Last Name"
                placeholder="Enter Author's Last Name"
                variant="bordered"
                {...register("last_name")}
              />
            </ModalBody>
            <ModalFooter>
              <Button radius="sm" color="primary" type="submit">
                Create a New Author
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

const DeleteAuthor = ({ isOpen, onOpenChange, book, onRefresh }) => {
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
                  deleteAuthor(book.id)
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

const EditAuthor = ({ book, isOpen, onOpenChange, onRefresh }) => {
  

  const { id, first_name, last_name } = book;

  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      id,
      first_name,
      last_name,
    },
  });

  useEffect(() => {
      console.log(book)
      reset({
        id,
        first_name,
        last_name,
      });
    
  }, [id]);

  const onSubmit = (values) => {
    const {id,first_name,last_name}=values;
    updateAuthor(id,first_name,last_name).then(()=>{
      onOpenChange();
      onRefresh();
    })
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">Edit Book</ModalHeader>
            <ModalBody>
              <div className="flex gap-2 flex-col">
                <Input
                  label="Author ID"
                  placeholder="Enter Book's ISBN"
                  variant="bordered"
                  {...register("id")}
                  disabled
                />
                <Input
                  label="First Name"
                  placeholder="Enter Author's First Name"
                  variant="bordered"
                  {...register("first_name")}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter Author's Last Name"
                  variant="bordered"
                  {...register("last_name")}
                />
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
};
