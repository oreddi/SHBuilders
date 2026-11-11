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
      // Anything already on screen (or scrolled past) is shown straight away;
      // hiding and re-showing the hero delayed the first paint. Only content
      // further down gets the fade-in. Positions are read first, then classes
      // change, so layout runs once.
      const fold = window.innerHeight;
      const elements = [...document.querySelectorAll('.reveal')];
      const below = elements.map(el => el.getBoundingClientRect().top > fold);
      elements.forEach((el, i) => {
        if (below[i]) {
          el.classList.remove('in');
          observer.observe(el);
        } else {
          el.classList.add('in');
        }
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
