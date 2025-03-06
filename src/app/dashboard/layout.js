import { Geist, Geist_Mono } from "next/font/google";

import SideBar from "@/components/SideBar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body

      >
        <div className="grid grid-cols-[1fr,6fr]">
        <SideBar/>
         <div className="m-8">
          {children}
         </div>
        </div>
         
      </body>
    </html>
  );
}
