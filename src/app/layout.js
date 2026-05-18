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

export const metadata = {
  title: "SHBuilders | Premium Construction",
  description: "A showcase of our commitment to quality and architectural excellence. Review our portfolio of custom luxury constructions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${cormorantGaramond.variable}`}>
        <LoadingOverlay />
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
