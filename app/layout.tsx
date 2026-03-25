import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { AuthProvider } from '@/components/AuthProvider'
import { CartProvider } from '@/components/CartProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XTREME | Designer Shoes & Clothing',
  description: 'Premium designer footwear and apparel for the modern elite',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
       <AuthProvider>
      <CartProvider>
      <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
      </CartProvider>
       </AuthProvider>
    </html>
  )
}

// app/layout.tsx
/*import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TextChat - Pure Text Communication",
  description: "A distraction-free text-only chat experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="h-[700px] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}*/

