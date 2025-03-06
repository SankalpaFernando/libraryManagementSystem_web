
'use client'
import { BookOpenIcon, UserGroupIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default  ()=>{
    return (
        <aside class="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l -bg-gray-900 -border-gray-700">
    <a href="#">
        {/* <Image class="w-auto h-7" src="https://merakiui.com/images/logo.svg" alt=""> */}
    </a>

    <div class="flex flex-col justify-between flex-1 mt-6">
        <nav class="-mx-3 space-y-6 ">
        

            <div class="space-y- ">
                <label class="px-3 text-xs text-gray-500 uppercase -text-gray-400">content</label>

                <Link class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg -text-gray-200 hover:bg-gray-100 -hover:bg-gray-800 -hover:text-gray-200 hover:text-gray-700" href="/dashboard/book">
                    <BookOpenIcon className="w-5 h-5" />
                    <span class="mx-2 text-sm font-medium">Books</span>
                </Link>

                <Link class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg -text-gray-200 hover:bg-gray-100 -hover:bg-gray-800 -hover:text-gray-200 hover:text-gray-700" href="/dashboard/author">
                    <UserGroupIcon className="w-5 h-5" />

                    <span class="mx-2 text-sm font-medium">Authors</span>
                </Link>

                <Link class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg -text-gray-200 hover:bg-gray-100 -hover:bg-gray-800 -hover:text-gray-200 hover:text-gray-700" href="/dashboard/copy">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>

                    <span class="mx-2 text-sm font-medium">Book Copies</span>
                </Link>
            </div>

            
        </nav>
    </div>
</aside>
    )
}