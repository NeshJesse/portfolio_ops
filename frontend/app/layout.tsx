import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio - Developer Showcase",
  description: "A modern portfolio website showcasing projects, skills, and experience. Built with Next.js and powered by Portfolio-OPs.",
  keywords: ["portfolio", "developer", "projects", "skills", "experience"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Portfolio - Developer Showcase",
    description: "A modern portfolio website showcasing projects, skills, and experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
