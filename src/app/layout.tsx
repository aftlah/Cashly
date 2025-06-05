import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cashly",
  description: "Manage your finances wisely every day.",
  icons: {
    icon: [
      { url: "/cashly-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/cashly-logo-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/cashly-logo.png",
  },
};

export const viewport = {
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={`antialiased`}> {/* Font variabel sudah di html, cukup antialiased di body */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}