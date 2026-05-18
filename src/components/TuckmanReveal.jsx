"use client";

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function TuckmanReveal() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  const videoUrl = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=9shlu6n0hhs5qnwq4gk767x6p25uzh0a&file_id=f_1447495287754";

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
          pointerEvents: 'none'
        }}
      >
        <video 
          src={videoUrl}
          autoPlay 
          muted 
          loop 
          playsInline
          onCanPlayThrough={() => setIsVideoLoaded(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isVideoLoaded ? 1 : 0, transition: 'opacity 1s ease' }}
        />
      </div>

      {/* Constructive Loading Spinner */}
      <AnimatePresence>
        {!isVideoLoaded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 1,
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <motion.div
              animate={{ rotateY: 360, rotateX: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              style={{
                width: 40,
                height: 40,
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderTop: '1px solid var(--gold, #D4AF37)',
                boxSizing: 'border-box'
              }}
            />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
              Loading Media
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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


