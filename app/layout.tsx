import type React from "react";
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tsukasa Kikuchi | Recording, Mixing, Mastering Engineer",
  description: "Professional audio engineering services by Tsukasa Kikuchi",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    noimageindex: true,
    nosnippet: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=M+PLUS+Rounded+1c&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <div id="container" className="min-h-screen flex flex-col">
          <main className="flex flex-col flex-1">
            <Header />
            {children}
          </main>
          <Footer className={"mt-auto"} />
        </div>
      </body>
    </html>
  );
}
