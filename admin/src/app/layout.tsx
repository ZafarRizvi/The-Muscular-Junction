import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Made by: Zafar Rizvi for Clinic - The Muscular Junction",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-white text-gray-900 overflow-x-hidden`}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ ["--navbar-height" as any]: "4rem" }} // 👈 define navbar height globally
      >
        <Navbar />
        <main className="min-h-screen w-full">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
