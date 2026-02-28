import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap'
});


export const metadata: Metadata = {
  title: "Chiben Leisure Hotels",
  description: "Experience world-class hospitality across Anambra State, Nigeria. Where business meets leisure in a boutique setting unlike any other.",
  openGraph: {
    title: "Chiben Leisure Hotels",
    description: "Experience world-class hospitality across Anambra State, Nigeria. Where business meets leisure in a boutique setting unlike any other.",
    url: "https://chibenleisurehotels.com",
    siteName: "Chiben Leisure Hotels",
    images: [
      {
        url: "/images/logo/Logo.png",
        width: 800,
        height: 600,
        alt: "Chiben Leisure Hotels",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import LayoutWrapper from "@/components/layout-wrapper"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${playfair.variable} ${montserrat.className} antialiased`}
      >
        <LayoutWrapper
          navbar={<Navbar />}
          footer={<Footer />}
        >
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
