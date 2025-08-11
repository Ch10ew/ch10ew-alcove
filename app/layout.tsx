import type { Metadata } from "next";
import { Red_Hat_Text, Red_Hat_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const redHatText = Red_Hat_Text({
  variable: "--font-red-hat-text",
  subsets: ["latin"],
});

const redHatMono = Red_Hat_Mono({
  variable: "--font-red-hat-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatText.variable} ${redHatMono.variable} antialiased`}
      >
        <div className="flex justify-center">
          <div className="flex w-full max-w-6xl">
            <Navbar />
            <main className="mt-16 md:mt-0 flex-1 p-4 transition-all duration-300">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
