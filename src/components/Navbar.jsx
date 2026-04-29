import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isNotHome = location.pathname !== '/';

  return (
    <nav className={`nav ${scrolled || isNotHome ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">SHBUILDERS</Link>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/company">Company</Link></li>
        <li><Link to="/portfolio">Portfolio</Link></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
