'use client'
import './globals.css'
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
      <title>Library Management System</title>
      <meta name="description" content="Welcome to my awesome website!" />
      </Head>
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
