import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Piyush Raj | Software Development Engineer III",
  description: "Senior Software Engineer specializing in scalable web applications, AI integration, and frontend architecture at Angel One.",
  keywords: "Piyush Raj, Software Engineer, Full Stack Developer, React, TypeScript, Node.js, AI, SvelteKit",
  authors: [{ name: "Piyush Raj" }],
  openGraph: {
    title: "Piyush Raj - Software Development Engineer III",
    description: "Building scalable financial tech solutions with AI-powered automation",
    url: "https://piyushraj.dev",
    siteName: "Piyush Raj Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piyush Raj - Software Development Engineer III",
    description: "Building scalable financial tech solutions with AI-powered automation",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
