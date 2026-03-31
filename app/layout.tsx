import type React from "react";
import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PathAwareContainer from "@/components/path-aware-container";
import { SelectedTagProvider } from "@/lib/selected-tag-context";
import ScrollRestoration from "@/lib/scroll-restoration";
import GoogleAnalytics from "@/components/google-analytics";
import AnalyticsPageview from "@/components/analytics-pageview";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nische.jp"),
  title: "Tsukasa Kikuchi | Recording, Mixing, Mastering Engineer",
  description: "Professional audio engineering services by Tsukasa Kikuchi",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tsukasa Kikuchi | Recording, Mixing, Mastering Engineer",
    description: "Professional audio engineering services by Tsukasa Kikuchi",
    images: [
      {
        url: "/images/ogimage.png",
        width: 1200,
        height: 630,
        alt: "Tsukasa Kikuchi - Audio Engineer",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tsukasa Kikuchi | Recording, Mixing, Mastering Engineer",
    description: "Professional audio engineering services by Tsukasa Kikuchi",
    images: ["/images/ogimage.png"],
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
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=M+PLUS+Rounded+1c&family=Noto+Serif+JP:wght@200..900&family=Noto+Serif+SC:wght@200..900&display=swap"
          rel="stylesheet"
        ></link>
        <GoogleAnalytics gaId="G-7L0R4ZXV6S" />
        <AnalyticsPageview />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Tsukasa Kikuchi",
              "jobTitle": "Recording, Mixing, Mastering Engineer",
              "url": "https://nische.jp",
            }),
          }}
        />
      </head>
      <body>
        <SelectedTagProvider>
          <ScrollRestoration />
          <PathAwareContainer>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:top-4 focus:left-4 focus:p-4 focus:bg-white focus:text-black focus:shadow-lg"
            >
              Skip to content
            </a>
            <Header />
            <main id="main-content" className="flex flex-col flex-1 min-h-full">
              {children}
            </main>
            <Footer className="mt-auto" />
          </PathAwareContainer>
        </SelectedTagProvider>
      </body>
    </html>
  );
}
