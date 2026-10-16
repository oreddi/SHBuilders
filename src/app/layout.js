import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./RootLayoutClient";
import StyledJsxRegistry from "./StyledJsxRegistry";
import { CONTACT } from "@/lib/siteConfig";
import Analytics from "@/components/Analytics";

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
    default: "SH Builders | Custom Luxury Homes in Mobile & Baldwin County, Alabama",
    template: "%s | SH Builders",
  },
  description:
    "SH Builders is a custom luxury home builder serving Mobile & Baldwin County, Alabama, where craftsmanship, materials and client relationships come first. Design-build, general contracting and renovation.",
  keywords: [
    "custom home builder",
    "luxury homes",
    "Mobile AL home builder",
    "Baldwin County custom homes",
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
      "Custom luxury home builder: design-build, general contracting and renovation, with finish and materials held to a higher standard.",
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
      "Custom luxury home builder: design-build, general contracting and renovation.",
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
        "Custom luxury home builder: design-build, general contracting and renovation in Mobile & Baldwin County, Alabama.",
      url: SITE_URL,
      ...(CONTACT.phone && { telephone: CONTACT.phone }),
      email: CONTACT.email,
      address: {
        "@type": "PostalAddress",
        ...(CONTACT.streetAddress && { streetAddress: CONTACT.streetAddress }),
        addressLocality: CONTACT.city,
        addressRegion: CONTACT.region,
        ...(CONTACT.postalCode && { postalCode: CONTACT.postalCode }),
        addressCountry: "US",
      },
      image: `${SITE_URL}/images/PherinWoodExteriors.jpg`,
      priceRange: "$$$$",
      areaServed: CONTACT.serviceArea,
      sameAs: [],
    },
    {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#agent`,
      name: "SH Builders",
      url: SITE_URL,
      description:
        "Custom luxury home builder — design-build, general contracting, and renovation services.",
      areaServed: CONTACT.serviceArea,
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
        <a href="#main-content" className="skip-link">Skip to content</a>
        <StyledJsxRegistry>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </StyledJsxRegistry>
        <Analytics />
      </body>
    </html>
  );
}
