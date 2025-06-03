import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import Feedback from "@/components/Feedback";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SOPify - Standard Operating Procedures Made Easy",
  description: "Create, manage, and share your Standard Operating Procedures with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <Toaster position="top-right" />
          <Navbar />
          {children}
          <Feedback />
        </AppProvider>
      </body>
    </html>
  );
}
