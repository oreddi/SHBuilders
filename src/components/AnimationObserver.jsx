"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AnimationObserver = () => {
  const pathname = usePathname();

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

export default AnimationObserver;
