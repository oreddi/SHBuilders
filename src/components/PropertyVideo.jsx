"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

const SKIP_INTRO_SECONDS = 20; // burned-in address titles are gone by ~16s

// Full-width, muted walkthrough video of one property (chosen on the server, see page.js).
// Styled like TuckmanReveal: fixed "window" video with the SH Builders text lighting up.
export default function PropertyVideo({ video }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  // Only start downloading once the visitor scrolls near the section
  const isNearView = useInView(ref, { once: true, margin: '600px 0px' });
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video?.url) return null;

  return (
    <section ref={ref} className="property-video" aria-label={`Video walkthrough of ${video.name}`}>
      {isNearView && (
        <video
          src={video.url}
          autoPlay
          muted
          playsInline
          preload="metadata"
          // Walkthroughs open with the address burned into the footage; skip it and
          // loop back to the same point.
          onLoadedMetadata={(e) => { e.currentTarget.currentTime = Math.min(SKIP_INTRO_SECONDS, e.currentTarget.duration / 4); }}
          onEnded={(e) => { e.currentTarget.currentTime = Math.min(SKIP_INTRO_SECONDS, e.currentTarget.duration / 4); e.currentTarget.play(); }}
          onPlaying={() => setIsPlaying(true)}
          className={isPlaying ? 'is-playing' : ''}
        />
      )}
      <div className="property-video-shade" />

      {/* SH Builders Text - Lights up and goes away (same as TuckmanReveal) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.1] } : { opacity: 0 }}
        transition={{ duration: 3, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
        className="property-video-brand"
      >
        <h2>SH Builders</h2>
      </motion.div>

      <div className="inner property-video-caption">
        <span className="property-video-name">{video.name}</span>
        <Link href={`/portfolio/${video.slug}`} className="property-video-link">
          View This Home &rarr;
        </Link>
      </div>
    </section>
  );
}
