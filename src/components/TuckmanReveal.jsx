"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

export default function TuckmanReveal() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  // Only start downloading the video once the visitor scrolls near it.
  const isNearView = useInView(containerRef, { once: true, margin: '600px 0px' });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    if (!isNearView) return;
    fetch('/api/homepage-video')
      .then(res => res.json())
      .then(data => {
        if (data && data.videoUrl) {
          setVideoUrl(data.videoUrl);
        }
      })
      .catch(err => console.log("Failed to fetch homepage video"));
  }, [isNearView]);

  return (
    <div 
      ref={containerRef}
      className="tuckman-window" 
      style={{ 
        height: '70vh', 
        position: 'relative', 
        overflow: 'hidden',
        clipPath: 'inset(0 0 0 0)',
        backgroundColor: '#111'
      }}
    >
      {/* Fixed Video behind the window */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 0,
          pointerEvents: 'none',
          // Photo shown until the video is ready
          backgroundImage: "url('/images/RidgeField PI Exteriors.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {videoUrl && <video
          src={videoUrl}
          autoPlay 
          muted 
          loop 
          playsInline
          onCanPlay={() => setIsVideoLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 1s ease' }}
        />}
      </div>

      {/* SH Builders Text - Lights up and goes away */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.1] } : { opacity: 0 }}
        transition={{ duration: 3, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
        style={{ 
          position: 'absolute', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <h2 style={{ 
          fontFamily: 'var(--font-montserrat)',
          fontSize: '14px', 
          color: '#fff', 
          textTransform: 'uppercase',
          letterSpacing: '10px',
          fontWeight: '400',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)' /* Subtle shadow to ensure text is visible on light parts of video */
        }}>
          SH Builders
        </h2>
      </motion.div>
    </div>
  );
}


