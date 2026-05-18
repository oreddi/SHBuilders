"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

// Dynamic mock specs generator based on folderId
const getMockSpecs = (folderId, folderName) => {
  const seed = parseInt(folderId) || 42;
  const name = folderName || "Bespoke Residence";
  
  // Dynamic style matching based on folder name or id
  let style = "Contemporary";
  if (name.toLowerCase().includes("wildwood")) style = "Coastal";
  else if (name.toLowerCase().includes("pherin")) style = "Traditional";
  else if (name.toLowerCase().includes("persimmon")) style = "Transitional";
  else if (name.toLowerCase().includes("alydar")) style = "Contemporary";
  else if (name.toLowerCase().includes("ridgefield")) style = "Mountain";
  else if (name.toLowerCase().includes("johnson")) style = "Farmhouse";
  else if (name.toLowerCase().includes("vane")) style = "Transitional";

  const sqft = 3500 + (seed % 15) * 150;
  const beds = 4 + (seed % 3);
  const baths = beds - 0.5 - (seed % 2);
  const year = 2022 + (seed % 4);
  
  const locations = [
    "Asheville, NC",
    "Raleigh, NC",
    "Charlotte, NC",
    "Wilmington, NC",
    "Chapel Hill, NC"
  ];
  const location = locations[seed % locations.length];

  return {
    style,
    sqft: sqft.toLocaleString(),
    beds,
    baths,
    year,
    location,
    desc: `A breathtaking bespoke residence exemplifying SH Builders' signature craftsmanship. Designed with an expansive open floor plan, soaring ceilings, and hand-selected natural materials, this ${style} masterpiece seamlessly integrates modern luxury with daily functional elegance. The living spaces are adorned with custom white-oak cabinetry, premium quartz countertops, and a professional-grade chef's kitchen. The master suite serves as a private oasis with an oversized wet room and custom marble details, opening directly to a meticulously manicured outdoor lounge. Crafted in ${year} at ${location}, this custom home represents our uncompromising standard of build quality.`
  };
};

export default function ProjectDetails({ params }) {
  const { id: folderId } = use(params);
  const [images, setImages] = useState([]);
  const [projectName, setProjectName] = useState("Bespoke Residence");
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    // Fetch project details (images inside folder)
    fetch(`/api/projects/${folderId}`)
      .then(res => res.json())
      .then(data => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch project details", err);
        setLoading(false);
      });

    // Fetch folder name to use as project title
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const match = data.find(p => p.id === folderId);
          if (match) {
            setProjectName(match.name);
          }
        }
      })
      .catch(err => console.error("Failed to fetch project list", err));
  }, [folderId]);

  const specs = getMockSpecs(folderId, projectName);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormMessage("");
    setTimeout(() => {
      setInquirySubmitted(false);
    }, 5000);
  };

  return (
    <div style={{ paddingTop: '120px', background: 'var(--stone)', minHeight: '100vh' }}>
      <section className="sec">
        <div className="inner">
          
          {/* Header & Breadcrumb */}
          <div className="reveal in" style={{ marginBottom: '60px' }}>
            <Link href="/portfolio" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span>←</span> Back to Portfolio
            </Link>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
              <div>
                <span className="tag" style={{ color: 'var(--gold)', marginBottom: '10px', display: 'block' }}>{specs.style} Residence</span>
                <h1 className="h2" style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--navy)', margin: 0 }}>{projectName}</h1>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--grey)', fontFamily: 'var(--font-montserrat)', fontWeight: 500 }}>
                {specs.location} • Year {specs.year}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', fontFamily: 'var(--serif)', fontSize: '24px', color: 'var(--navy)' }}>
              Loading project details from Box...
            </div>
          ) : (
            <>
              {/* Split Editorial Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '60px', alignItems: 'start', marginBottom: '80px' }} className="details-split">
                
                {/* Left Side: Horizontal Interactive Image Slider */}
                <div>
                  <div style={{ position: 'relative', width: '100%', height: '550px', background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
                    {images.map((imgObj, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          inset: '0',
                          opacity: activeIndex === idx ? 1 : 0,
                          transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
                          transform: activeIndex === idx ? 'scale(1)' : 'scale(1.05)',
                          zIndex: activeIndex === idx ? 2 : 1,
                        }}
                      >
                        <img
                          src={imgObj.img}
                          alt={imgObj.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"; // Luxury Fallback
                          }}
                          loading="lazy"
                        />
                        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '120px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))', zIndex: 3, display: 'flex', alignItems: 'flex-end', padding: '30px' }}>
                          <h4 style={{ color: '#fff', fontSize: '18px', fontFamily: 'var(--serif)', margin: 0, fontWeight: '400', letterSpacing: '1px' }}>{imgObj.name}</h4>
                        </div>
                      </div>
                    ))}

                    {/* Left and Right Nav Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            color: '#fff',
                            fontSize: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                          }}
                          className="nav-arrow"
                        >
                          ←
                        </button>
                        <button
                          onClick={handleNext}
                          style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            color: '#fff',
                            fontSize: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                          }}
                          className="nav-arrow"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>

                  {/* Centered dots below the carousel */}
                  {images.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '25px' }}>
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIndex(idx)}
                          style={{
                            border: 'none',
                            padding: 0,
                            width: activeIndex === idx ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: activeIndex === idx ? 'var(--gold)' : 'rgba(15, 23, 42, 0.2)',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer',
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Specs Grid & Project Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="reveal in">
                  
                  {/* Specifications Card */}
                  <div className="spec-card">
                    <h3 style={{ fontSize: '11px', color: 'var(--navy)', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 25px 0', borderBottom: '1px solid var(--border)', paddingBottom: '15px', fontWeight: '700' }}>
                      Residence Specifications
                    </h3>
                    <div className="spec-item">
                      <span className="spec-label">Architectural Style</span>
                      <span className="spec-val">{specs.style}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Area (Sq Ft)</span>
                      <span className="spec-val">{specs.sqft} sq ft</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Bedrooms</span>
                      <span className="spec-val">{specs.beds} Beds</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Bathrooms</span>
                      <span className="spec-val">{specs.baths} Baths</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Year Completed</span>
                      <span className="spec-val">{specs.year}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Location</span>
                      <span className="spec-val">{specs.location}</span>
                    </div>
                  </div>

                  {/* Design Narrative */}
                  <div>
                    <h3 style={{ fontSize: '11px', color: 'var(--navy)', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 15px 0', fontWeight: '700' }}>
                      Design Philosophy & Craftsmanship
                    </h3>
                    <p className="body-p" style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--grey)' }}>
                      {specs.desc}
                    </p>
                  </div>
                </div>

              </div>


              {/* Inquiry CTA Section */}
              <div className="inquiry-box reveal in">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '80px', alignItems: 'center' }} className="inquiry-grid">
                  <div>
                    <span className="tag" style={{ color: 'var(--gold)', marginBottom: '15px', display: 'block' }}>Inquire Today</span>
                    <h2 className="h2" style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '20px' }}>Interested in a Similar Build?</h2>
                    <p className="body-p" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', margin: 0 }}>
                      If you are inspired by the craftsmanship of this {specs.style.toLowerCase()} residence and would like to explore custom home opportunities in the {specs.location} area, submit an inquiry today. Our pre-construction planning specialists are ready to discuss your vision.
                    </p>
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '8px' }}>
                    {inquirySubmitted ? (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: '36px', marginBottom: '15px' }}>✓</div>
                        <h4 style={{ fontFamily: 'var(--serif)', fontSize: '24px', color: '#fff', marginBottom: '10px' }}>Inquiry Submitted</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>Our Raleigh headquarters will connect with you within 24 business hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row-split">
                          <div>
                            <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Full Name</label>
                            <input
                              type="text"
                              required
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="John Doe"
                              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', color: '#fff', borderRadius: '4px', fontFamily: 'inherit' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Email Address</label>
                            <input
                              type="email"
                              required
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                              placeholder="john@example.com"
                              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', color: '#fff', borderRadius: '4px', fontFamily: 'inherit' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Phone Number (Optional)</label>
                          <input
                            type="tel"
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            placeholder="(919) 555-0199"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', color: '#fff', borderRadius: '4px', fontFamily: 'inherit' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>Project Message</label>
                          <textarea
                            required
                            rows="4"
                            value={formMessage}
                            onChange={(e) => setFormMessage(e.target.value)}
                            placeholder={`Tell us about your build timeline or structural thoughts regarding the ${specs.style} style...`}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 15px', color: '#fff', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }}
                          />
                        </div>

                        <button
                          type="submit"
                          style={{
                            background: 'var(--gold)',
                            color: '#000',
                            border: 'none',
                            padding: '15px',
                            fontWeight: '600',
                            fontFamily: 'var(--font-montserrat)',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginTop: '10px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'var(--gold)';
                          }}
                        >
                          Submit Inquiry
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </section>

      <style jsx>{`
        .nav-arrow:hover {
          background: var(--gold) !important;
          border-color: var(--gold) !important;
          color: #000 !important;
        }
        .spec-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 35px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }
        .spec-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
        }
        .spec-item:last-child {
          border-bottom: none;
        }
        .spec-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--grey);
        }
        .spec-val {
          font-family: var(--serif);
          font-size: 16px;
          color: var(--navy);
        }
        .inquiry-box {
          background: var(--navy);
          color: #fff;
          border-radius: 12px;
          padding: 60px 6%;
          margin-top: 80px;
          box-shadow: 0 20px 40px rgba(15,23,42,0.15);
        }

        @media (max-width: 991px) {
          .details-split, .inquiry-grid {
            grid-template_columns: 1fr !important;
          }
          .form-row-split {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
