"use client";

import React, { useState } from 'react';

// testimonials come from Sanity, loaded on the server (see src/lib/content.js)
export default function Testimonials({ testimonials = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (testimonials.length === 0) return null;

  return (
    <section className="sec sec-testimonials" id="testimonials">
      <div className="inner">
        <div className="testimonial-container reveal in">
          <span className="tag" style={{ marginBottom: '10px' }}>Client Stories</span>
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
                aria-label={`Show testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sec-testimonials {
          background: var(--stone);
          padding: 130px 100px;
        }
        .testimonial-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
        }
        .quote-icon {
          font-family: var(--font-cormorant-garamond);
          font-size: 110px;
          color: var(--gold);
          opacity: 0.55;
          line-height: 1;
          height: 60px;
          margin-bottom: 10px;
        }
        .quote {
          font-family: var(--font-cormorant-garamond);
          font-size: clamp(22px, 2.8vw, 32px);
          color: var(--navy);
          line-height: 1.5;
          font-style: italic;
          margin-bottom: 30px;
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
          gap: 10px;
          margin-top: 40px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .dot.active {
          background: var(--gold);
          width: 28px;
          border-radius: 4px;
        }
        @media (max-width: 1024px) {
          .sec-testimonials { padding: 100px 40px; }
        }
      `}</style>
    </section>
  );
}
