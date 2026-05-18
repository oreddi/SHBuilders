"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    { img: "/images/IsabelWayWOutside (1).jpg", name: "Custom Build" },
    { img: "/images/WildwoodAveraInside.jpg", name: "Luxury Interior" },
    { img: "/images/8095Vane,Inside.jpg", name: "Refined Living" }
  ]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.length >= 3) {
          setSlides([
            { img: data[0].img, name: data[0].name },
            { img: data[1].img, name: data[1].name },
            { img: data[2].img, name: data[2].name }
          ]);
        }
      })
      .catch(err => console.error("Hero failed to fetch", err));
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
              backgroundImage: `url('${slide.img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: idx === currentSlide ? 1 : 0,
              opacity: idx === currentSlide ? 1 : 0,
              position: 'absolute',
              inset: 0,
              transition: 'opacity 2s ease'
            }}
          />
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
