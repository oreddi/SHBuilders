"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CONTACT, phoneHref } from '@/lib/siteConfig';

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

  const goTo = (idx) => setCurrentSlide((idx + slides.length) % slides.length);

  // Auto-advance; restarts whenever the slide changes (so manual clicks get a full 6s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length]);

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
          Since 1997
        </span>
        <h1 className="hero-title reveal in">Custom Homes,<br />Built to Be Lived In</h1>
        <div className="hero-ctas reveal in">
          <Link href="/portfolio" className="btn-outline" style={{ display: 'inline-block', borderColor: '#fff', color: '#fff' }}>
            View Our Work
          </Link>
          <Link href="/#contact" className="btn-solid">
            Start Your Project
          </Link>
        </div>
      </div>

      {/* Slider arrows + dots */}
      {slides.length > 1 && (
        <>
          <button type="button" className="hero-arrow hero-arrow-prev" onClick={() => goTo(currentSlide - 1)} aria-label="Previous photo">&#8249;</button>
          <button type="button" className="hero-arrow hero-arrow-next" onClick={() => goTo(currentSlide + 1)} aria-label="Next photo">&#8250;</button>
          <div className="hero-dots">
            {slides.map((_, idx) => (
              <button
                type="button"
                key={idx}
                className={idx === currentSlide ? 'active' : ''}
                onClick={() => goTo(idx)}
                aria-label={`Show photo ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Contact strip along the bottom of the hero */}
      <div className="hero-contact">
        <span>{CONTACT.city}, {CONTACT.region}</span>
        {CONTACT.phone && <a href={`tel:${phoneHref()}`}>{CONTACT.phone}</a>}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </div>
    </div>
  );
};

export default Hero;
