import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";
import LoadingOverlay from "@/components/LoadingOverlay";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sh-builders.vercel.app";

export const metadata = {
  title: {
    default: "SH Builders | Premium Custom Home Construction in Tennessee",
    template: "%s | SH Builders",
  },
  description:
    "SH Builders is a luxury custom home builder in Chattanooga, TN with 28+ years of experience. Design-build, general contracting, and renovation services delivering uncompromising craftsmanship.",
  keywords: [
    "custom home builder",
    "luxury homes",
    "Chattanooga builder",
    "Tennessee construction",
    "design build",
    "general contractor",
    "home renovation",
    "SH Builders",
  ],
  authors: [{ name: "SH Builders" }],
  creator: "SH Builders",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SH Builders",
    title: "SH Builders | Premium Custom Home Construction",
    description:
      "Luxury custom home builder with 28+ years of craftsmanship excellence. Portfolio of contemporary, traditional, mountain, coastal, and transitional homes.",
    images: [
      {
        url: `${SITE_URL}/images/PherinWoodExteriors.jpg`,
        width: 1200,
        height: 630,
        alt: "SH Builders — Premium Custom Homes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SH Builders | Premium Custom Home Construction",
    description:
      "Luxury custom home builder with 28+ years of craftsmanship excellence.",
    images: [`${SITE_URL}/images/PherinWoodExteriors.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "SH Builders",
      description:
        "Premium custom home builder specializing in luxury residential construction, design-build, general contracting, and renovations in Tennessee.",
      url: SITE_URL,
      telephone: "+1-423-555-0199",
      email: "shbuilderstn@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "P.O. Box 4084",
        addressLocality: "Chattanooga",
        addressRegion: "TN",
        postalCode: "37405",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 35.0456,
        longitude: -85.3097,
      },
      image: `${SITE_URL}/images/PherinWoodExteriors.jpg`,
      priceRange: "$$$$",
      foundingDate: "1997",
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        minValue: 10,
        maxValue: 50,
      },
      areaServed: {
        "@type": "State",
        name: "Tennessee",
      },
      sameAs: [],
    },
    {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#agent`,
      name: "SH Builders",
      url: SITE_URL,
      description:
        "Custom luxury home builder — design-build, general contracting, and renovation services.",
      areaServed: "Chattanooga, TN and surrounding areas",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "SH Builders",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.variable} ${cormorantGaramond.variable}`}>
        <LoadingOverlay />
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
