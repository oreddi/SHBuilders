"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isNotHome = pathname !== '/';

  return (
    <nav className={`nav ${scrolled || isNotHome ? 'scrolled' : ''}`}>
      <Link href="/" className="nav-logo">SHBUILDERS</Link>

      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/company">Company</Link></li>
        <li><Link href="/portfolio">Portfolio</Link></li>
        <li><Link href="/#contact">Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
