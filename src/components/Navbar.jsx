"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer upon page navigation (adjust state during render, no effect needed)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const isNotHome = pathname !== '/';

  return (
    <>
      <nav className={`nav ${scrolled || isNotHome || menuOpen ? 'scrolled' : ''}`}>
        <Link href="/" className="nav-logo">SHBUILDERS</Link>

        {/* Desktop Nav Links */}
        <ul className="nav-links desktop-only">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/company">Company</Link></li>
          <li><Link href="/portfolio">Portfolio</Link></li>
          <li><Link href="/#contact" className="nav-cta">Start a Project</Link></li>
        </ul>

        {/* Mobile Hamburger Trigger */}
        <button
          className={`menu-trigger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>
      </nav>

      {/* Sliding Mobile Menu Drawer Overlay */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul className="mobile-links">
          <li>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/company" onClick={() => setMenuOpen(false)}>
              Company
            </Link>
          </li>
          <li>
            <Link href="/portfolio" onClick={() => setMenuOpen(false)}>
              Portfolio
            </Link>
          </li>
          <li>
            <Link href="/#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .desktop-only {
          display: flex;
        }
        .menu-trigger {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-direction: column;
          gap: 6px;
          z-index: 700;
          padding: 8px;
          outline: none;
        }
        .burger-line {
          width: 25px;
          height: 2px;
          background: ${scrolled || isNotHome || menuOpen ? 'var(--navy)' : '#fff'};
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .menu-trigger.active .burger-line:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .menu-trigger.active .burger-line:nth-child(2) {
          opacity: 0;
        }
        .menu-trigger.active .burger-line:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        .mobile-menu {
          position: fixed;
          inset: 0;
          background: var(--stone);
          /* Below the header (600) so the menu button stays tappable to close */
          z-index: 590;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(100%);
          /* Fully hidden when closed (no flash on resize, not reachable by Tab) */
          visibility: hidden;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0.6s;
        }
        .mobile-menu.open {
          transform: translateX(0);
          visibility: visible;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s;
        }
        .mobile-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 35px;
          text-align: center;
        }
        .mobile-links :global(a) {
          font-family: var(--serif);
          font-size: 32px;
          color: var(--navy);
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          transition: color 0.3s;
          display: block;
        }
        .mobile-links :global(a):hover {
          color: var(--gold);
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .menu-trigger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
