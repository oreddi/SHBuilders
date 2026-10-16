"use client";

import React, { useEffect, useRef } from 'react';

// Full-screen photo viewer (proposal §2.5 component library: "gallery/lightbox").
// Keyboard: ← → to browse, Esc to close. Touch: swipe left/right.
export default function Lightbox({ images, index, onIndexChange, onClose }) {
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const count = images.length;
  const go = (delta) => onIndexChange((index + delta + count) % count);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % count);
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, count, onIndexChange, onClose]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const current = images[index];
  if (!current) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${count}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label="Close full-screen photos">&times;</button>
      {count > 1 && (
        <>
          <button type="button" className="lightbox-arrow lightbox-prev" onClick={() => go(-1)} aria-label="Previous photo">&#8249;</button>
          <button type="button" className="lightbox-arrow lightbox-next" onClick={() => go(1)} aria-label="Next photo">&#8250;</button>
        </>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={current.full || current.img} alt={current.name} className="lightbox-img" />
      <div className="lightbox-caption">
        <span>{current.name}</span>
        <span>{index + 1} / {count}</span>
      </div>
    </div>
  );
}
