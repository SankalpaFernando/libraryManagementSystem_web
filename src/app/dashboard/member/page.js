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
import { createMember, deleteMember, getMembers, updateMember } from "@/backend/member";
import moment from "moment";

export default function Home() {
  const [authors, setAuthors] = useState({
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
    getMembers(searchText, page)
      .then((data) => {
        setAuthors(data);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div class="w-full flex flex-col gap-4 px-8 py-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold">Members</h1>
      <div className="flex gap-2">
        <Input
          startContent={<MagnifyingGlassIcon className="w-4" />}
          placeholder="Search By First Name or Last Name"
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
          Add New Member
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>First Name</TableColumn>
          <TableColumn>Last Name</TableColumn>
          <TableColumn>Joined Date</TableColumn>
          <TableColumn>Address</TableColumn>
          <TableColumn>Phone Number</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<Spinner />}
          items={authors?.content}
        >
          {({ id, firstName, lastName,joinedDate,address,phoneNumber }) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{firstName}</TableCell>
              <TableCell>{lastName}</TableCell>
              <TableCell>{moment(joinedDate).format("YYYY-MM-DD")}</TableCell>
              <TableCell>{address}</TableCell>
              <TableCell>{phoneNumber}</TableCell>

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
                        joinedDate,
                        address,
                        phoneNumber
                      });
                    }}
                  />
                  <TrashIcon
                    onClick={() => {
                      setModelState((state) => ({ ...state, delete: true }));
                      setDeleteBook({ id,firstName,lastName });
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
      {/* <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          page={page + 1}
          total={books.total != 0 ? books.total : 0}
          onChange={(_page) => setPage(_page - 1)}
        />
      </div> */}
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
  const [isLoading,setIsLoading] = useState(false);


  useEffect(() => {
    getAuthors().then((authors_) => setAuthors(authors_));
  }, []);

  const onSubmit = async (values) => {
    setIsLoading(true)
    createMember(values)
      .then(() => onOpenChange())
      .then(reset).finally(()=>setIsLoading(false))
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Create Member
            </ModalHeader>
            <ModalBody>
              <Input
                label="First Name"
                placeholder="Enter Member's First Name"
                variant="bordered"
                {...register("first_name")}
              />
              <Input
                label="Last Name"
                placeholder="Enter Member's Last Name"
                variant="bordered"
                {...register("last_name")}
              />
              <Input
                label="Joined Date"
                placeholder="Enter Member's Joined Date"
                variant="bordered"
                type="date"
                {...register("joined_date")}
              />
               <Input
                label="Phone Number"
                placeholder="Enter Member's Phone Number"
                variant="bordered"
                {...register("phone_number")}
              />
               <Input
                label="Address"
                placeholder="Enter Member's Address"
                variant="bordered"
                {...register("address")}
              />
            </ModalBody>
            <ModalFooter>
              <Button isLoading={isLoading} radius="sm" color="primary" type="submit">
                Create a New Member
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

const DeleteAuthor = ({ isOpen, onOpenChange, book, onRefresh }) => {
  const [isLoading,setIsLoading] = useState(false);

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
                Are you sure you want to delete the member, <br />
                <Code size="sm" color="danger" className="text-xs">
                  {book.firstName+" "+book.lastName}
                </Code>
                ?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="bordered"
                radius="sm"
                isLoading={isLoading}
                onPress={() => {
                  setIsLoading(true)
                  deleteMember(book.id)
                    .then(() => onRefresh())
                    .then(() => onClose()).finally(()=>setIsLoading(false))
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
    const [isLoading,setIsLoading] = useState(false);


  const { id, first_name, last_name,joinedDate, address, phoneNumber } = book;

  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      id,
      first_name,
      last_name,
    },
  });

  useEffect(() => {
      console.log(moment(joinedDate))
      reset({
        id,
        first_name,
        last_name,
        joinedDate:moment(joinedDate).format("YYYY-MM-DD"),
        address,
        phoneNumber
      });
    
  }, [id]);

  const onSubmit = (values) => {
    const {id,first_name,last_name,joinedDate,address,phoneNumber}=values;
    setIsLoading(true)
    updateMember(id,first_name,last_name,joinedDate,address,phoneNumber).then(()=>{
      onOpenChange();
      onRefresh();
    }).finally(()=>setIsLoading(false))
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
                  label="Member ID"
                  placeholder="Enter Member's ID"
                  variant="bordered"
                  {...register("id")}
                  disabled
                />
                <Input
                  label="First Name"
                  placeholder="Enter Member's First Name"
                  variant="bordered"
                  {...register("first_name")}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter Member's Last Name"
                  variant="bordered"
                  {...register("last_name")}
                />
                <Input
                  label="Joined Date"
                  placeholder="Enter Member's Joined Date"
                  variant="bordered"
                  type="date"
                  {...register("joinedDate")}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter Member's Phone Number"
                  variant="bordered"
                  {...register("phoneNumber")}
                />
                <Input
                  label="Address"
                  placeholder="Enter Member's Address"
                  variant="bordered"
                  {...register("address")}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button isLoading={isLoading} color="primary" type="submit">
                Save Changes
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
