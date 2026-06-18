import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "CineStream - Watch Movies Online Free",
    template: "%s | CineStream",
  },
  description:
    "Watch movies, trailers and video content online for free on CineStream. Search thousands of titles.",
  keywords: [
    "movies",
    "watch movies online",
    "free movies",
    "movie trailers",
    "streaming",
  ],
  openGraph: {
    type: "website",
    siteName: "CineStream",
    title: "CineStream - Watch Movies Online Free",
    description:
      "Watch movies, trailers and video content online for free on CineStream.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1123659213929990"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[hsl(220,20%,8%)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
