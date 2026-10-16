"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useInView } from 'framer-motion';

const SKIP_INTRO_SECONDS = 20; // burned-in address titles are gone by ~16s

// Full-width, muted walkthrough video of one property (chosen on the server, see page.js).
export default function PropertyVideo({ video }) {
  const ref = useRef(null);
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
          // Walkthroughs open with the address burned into the footage; skip it so it
          // doesn't clash with our caption, and loop back to the same point.
          onLoadedMetadata={(e) => { e.currentTarget.currentTime = Math.min(SKIP_INTRO_SECONDS, e.currentTarget.duration / 4); }}
          onEnded={(e) => { e.currentTarget.currentTime = Math.min(SKIP_INTRO_SECONDS, e.currentTarget.duration / 4); e.currentTarget.play(); }}
          onPlaying={() => setIsPlaying(true)}
          className={isPlaying ? 'is-playing' : ''}
        />
      )}
      <div className="property-video-shade" />
      <div className="inner property-video-caption reveal in">
        <span className="tag" style={{ color: 'var(--gold)' }}>Walkthrough</span>
        <h2 className="h2" style={{ color: '#fff', margin: '0 0 24px' }}>{video.name}</h2>
        <Link href={`/portfolio/${video.slug}`} className="btn-outline" style={{ borderColor: '#fff', color: '#fff', display: 'inline-block' }}>
          View This Home
        </Link>
      </div>
    </section>
  );
}
