import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PortfolioPage from './pages/PortfolioPage';
import CompanyPage from './pages/Company';
import ProjectDetails from './pages/ProjectDetails';
import './index.css';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Intersection Observer for buttery scroll animations
const AnimationObserver = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach(el => {
        el.classList.remove('in'); // reset on page load
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimationObserver />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:folderId" element={<ProjectDetails />} />
        <Route path="/company" element={<CompanyPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
