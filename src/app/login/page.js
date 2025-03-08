'use client'
import { getBooks } from "@/backend/book";
import { userLogin } from "@/backend/user";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default () => {

    const {register,handleSubmit} = useForm();
    const router = useRouter();

    const onSubmit = async(data)=>{
        userLogin(data.email,data.password).then(()=>router.push("/dashboard/book")
        ).catch(error => {
          // Handle login error (e.g., show an alert)
          alert(error.message);
      });
    }



  return (
    <div className="h-screen flex justify-center items-center">
      <div class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md -bg-gray-800">
        <div class="px-6 py-4">
          <div class="flex justify-center mx-auto">
            <img
              class="w-auto h-7 sm:h-8"
              src="https://merakiui.com/images/logo.svg"
              alt=""
            />
          </div>

          <h3 class="mt-3 text-xl font-medium text-center text-gray-600 -text-gray-200">
            Welcome Back
          </h3>

          <p class="mt-1 text-center text-gray-500 -text-gray-400">
            Library Management System
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div class="w-full mt-4">
              <input
                class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg -bg-gray-800 -border-gray-600 -placeholder-gray-400 focus:border-blue-400 -focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
                {...register("email")}
              />
            </div>

            <div class="w-full mt-4">
              <input
                class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg -bg-gray-800 -border-gray-600 -placeholder-gray-400 focus:border-blue-400 -focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
                placeholder="Password"
                aria-label="Password"
                {...register("password")}
              />
            </div>

            <div class="flex items-center justify-between mt-4">

              <button class="px-6 w-full py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                Sign In
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
