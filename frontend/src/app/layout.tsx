import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Run Journal",
  description: "Track your runs and progress",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/signup">Signup</Link>
            </li>
            <li>
              <Link href="/new-run">New Run</Link>
            </li>
            <li>
              <Link href="/history">History</Link>
            </li>
          </ul>
        </nav>
        <main className="container mx-auto mt-8 px-4">{children}</main>
      </body>
    </html>
  )
}



import './globals.css'