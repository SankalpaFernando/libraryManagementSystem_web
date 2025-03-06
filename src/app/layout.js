'use client'
import './globals.css'
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from 'react-hot-toast';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        
         <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
           {/* <ToastProvider> */}
           {children}
           {/* </ToastProvider> */}
          </ThemeProvider>
          <Toaster position="top-right" />
         </HeroUIProvider>

      </body>
    </html>
  );
}
