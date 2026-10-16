"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

const FALLBACK_SLIDES = [
  { img: "/images/PherinWoodExteriors.jpg", name: "Custom Build" },
  { img: "/images/Alydar Loop inside.jpg", name: "Luxury Interior" },
  { img: "/images/RidgeField PI Exteriors.jpg", name: "Refined Living" }
];

// heroSlides come from Sanity, loaded on the server (see src/lib/content.js)
const Hero = ({ heroSlides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = heroSlides.length
    ? heroSlides.map(s => ({ img: s.imageUrl, name: s.title }))
    : FALLBACK_SLIDES;

  // WCAG 2.2.2: auto-changing content needs a pause control, and should not
  // move at all for visitors who ask their device to reduce motion.
  const prefersReducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const autoPlay = !paused && !prefersReducedMotion && slides.length > 1;

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, slides.length]);

  return (
    <div className="hero" id="home">
      <div className="hero-slides">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
            style={{
              zIndex: idx === currentSlide ? 1 : 0,
              opacity: idx === currentSlide ? 1 : 0,
              position: 'absolute',
              inset: 0,
              transition: 'opacity 2s ease'
            }}
          >
            <Image
              src={slide.img}
              alt={slide.name || "Hero Image"}
              fill
              priority={idx === 0}
              quality={75}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        ))}
      </div>
      <div className="hero-overlay" />
      <div className="inner" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <span className="tag reveal in" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', margin: '0 auto 20px', display: 'table' }}>
          Premium Construction
        </span>
        <h1 className="hero-title reveal in" style={{ fontSize: '60px', fontWeight: '400', letterSpacing: '2px' }}>Building Value<br />For Over 28 Years</h1>
        <div className="hero-ctas reveal in">
          <Link href="/portfolio" className="btn-outline" style={{ display: 'inline-block', borderColor: '#fff', color: '#fff' }} onClick={() => trackEvent('cta_click', { location: 'hero', cta: 'view_our_work' })}>
            View Our Work
          </Link>
          <Link href="/#contact" className="btn-solid" onClick={() => trackEvent('cta_click', { location: 'hero', cta: 'start_project' })}>
            Start Your Project
          </Link>
        </div>
      </div>

      {slides.length > 1 && !prefersReducedMotion && (
        <button
          type="button"
          className="hero-pause"
          onClick={() => setPaused(p => !p)}
          aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
          aria-pressed={paused}
        >
          {paused ? '▶' : '❚❚'}
        </button>
      )}
    </div>
  );
};

export default Hero;
