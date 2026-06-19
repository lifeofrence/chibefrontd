import type { Metadata } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chibenhotels.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chiben Leisure Hotels | Luxury Hotel in Anambra, Nigeria",
    template: "%s | Chiben Leisure Hotels",
  },
  description: "Book your stay at Chiben Leisure Hotels in Anambra State, Nigeria. Experience world-class hospitality with luxury rooms, conference facilities, and fine dining.",
  keywords: ["Chiben Leisure Hotels", "hotel in Anambra", "Nigeria luxury hotel", "Abuja hotel", "conference center Nigeria", "boutique hotel Nigeria"],
  authors: [{ name: "Chiben Leisure Hotels" }],
  creator: "Chiben Leisure Hotels",
  publisher: "Chiben Leisure Hotels",
  openGraph: {
    title: "Chiben Leisure Hotels | Luxury Hotel in Anambra, Nigeria",
    description: "Book your stay at Chiben Leisure Hotels in Anambra State, Nigeria. Experience world-class hospitality with luxury rooms, conference facilities, and fine dining.",
    url: siteUrl,
    siteName: "Chiben Leisure Hotels",
    images: [
      {
        url: "/images/logo/Logo.png",
        width: 1200,
        height: 630,
        alt: "Chiben Leisure Hotels",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiben Leisure Hotels | Luxury Hotel in Anambra, Nigeria",
    description: "Book your stay at Chiben Leisure Hotels in Anambra State, Nigeria. Experience world-class hospitality with luxury rooms, conference facilities, and fine dining.",
    images: ["/images/logo/Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Chiben Leisure Hotels",
  description: "Experience world-class hospitality across Anambra State, Nigeria. Where business meets leisure in a boutique setting unlike any other.",
  url: siteUrl,
  telephone: "",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Central Business District",
    addressLocality: "Abuja",
    addressRegion: "Federal Capital Territory",
    addressCountry: "NG",
  },
  image: `${siteUrl}/images/logo/Logo.png`,
  priceRange: "₦30,000 - ₦582,000",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free WiFi" },
    { "@type": "LocationFeatureSpecification", name: "Conference Facilities" },
    { "@type": "LocationFeatureSpecification", name: "Restaurant" },
    { "@type": "LocationFeatureSpecification", name: "Room Service" },
  ],
  hasMap: `https://www.google.com/maps/search/?api=1&query=Chiben+Leisure+Hotels+Abuja`,
  sameAs: [
    "",
    "",
  ],
};

import LayoutWrapper from "@/components/layout-wrapper"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
