import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Eduscan",
  description: "Block explorer for Educhain",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}