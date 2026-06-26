"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    { img: "/images/IsabelWayWOutside (1).jpg", name: "Custom Build" },
    { img: "/images/WildwoodAveraInside.jpg", name: "Luxury Interior" },
    { img: "/images/8095Vane,Inside.jpg", name: "Refined Living" }
  ]);

  useEffect(() => {
    // Try to fetch hero slides from Sanity first, fall back to local images
    fetch('/api/hero-slides')
      .then(res => res.json())
      .then(data => {
        if (data && data.length >= 1) {
          setSlides(data.map(s => ({ img: s.imageUrl, name: s.title })));
        }
      })
      .catch(err => console.log("Using default hero images"));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
              quality={90}
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
        <Link href="/portfolio" className="btn-outline reveal in" style={{ marginTop: '40px', display: 'inline-block', borderColor: '#fff', color: '#fff' }}>
          View Our Work
        </Link>
      </div>
    </div>
  );
};

export default Hero;
