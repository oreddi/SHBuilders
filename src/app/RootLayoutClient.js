"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimationObserver from "@/components/AnimationObserver";
import { usePathname } from "next/navigation";

export default function RootLayoutClient({ children }) {
  const pathname = usePathname();
  const isSpecialPage = pathname?.startsWith('/admin') || pathname?.startsWith('/pm');

  return (
    <>
      {!isSpecialPage && <AnimationObserver />}
      {!isSpecialPage && <Navbar />}
      <main>{children}</main>
      {!isSpecialPage && <Footer />}
    </>
  );
}
