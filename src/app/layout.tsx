import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GeneralProvider from "@/app/_components/GeneralProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat — Doodle challenge",
  description: "Send and read chat messages from all participants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col">
        <a href="#main-content" className="sr-only skip-link">
          Skip to main content
        </a>
        <GeneralProvider>{children}</GeneralProvider>
      </body>
    </html>
  );
}
