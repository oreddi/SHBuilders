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
      // Leave anything already on screen visible (hiding and re-showing the hero
      // delayed the first paint); only content further down gets the fade-in.
      // All positions are read first, then classes change, so layout runs once.
      const fold = window.innerHeight;
      const below = [...document.querySelectorAll('.reveal')]
        .filter(el => el.getBoundingClientRect().top > fold);
      below.forEach(el => {
        el.classList.remove('in');
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
