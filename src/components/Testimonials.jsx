"use client";

import React, { useState, useEffect } from 'react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch testimonials", err);
        setLoading(false);
      });
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="sec sec-testimonials" id="testimonials">
      <div className="inner">
        <div className="testimonial-container reveal in">
          <div className="quote-icon">“</div>
          <div className="testimonial-content">
            <p className="quote">
              {testimonials[activeIndex].quote}
            </p>
            <div className="author-meta">
              <span className="author-name">{testimonials[activeIndex].author}</span>
              <span className="separator">/</span>
              <span className="author-role">{testimonials[activeIndex].role || "Homeowner"}</span>
            </div>
          </div>

          <div className="testimonial-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sec-testimonials {
          background: #fcfcfc;
          padding: 80px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        .testimonial-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
        }
        .quote-icon {
          font-family: var(--font-cormorant-garamond);
          font-size: 80px;
          color: var(--navy);
          opacity: 0.1;
          line-height: 1;
          margin-bottom: -20px;
        }
        .quote {
          font-family: var(--font-cormorant-garamond);
          font-size: clamp(20px, 2.5vw, 28px);
          color: #333;
          line-height: 1.5;
          font-style: italic;
          margin-bottom: 25px;
        }
        .author-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: var(--font-montserrat);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 11px;
          font-weight: 600;
        }
        .author-name {
          color: var(--navy);
        }
        .separator {
          color: #ccc;
        }
        .author-role {
          color: #888;
        }
        .testimonial-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 30px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ddd;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .dot.active {
          background: var(--navy);
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}
