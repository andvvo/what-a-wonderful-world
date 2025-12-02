import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import Navbar from "@/components/navbar";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={nunitoSans.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
