import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const statsData = [
  { n: '28+', l: 'Years Building' },
  { n: '420', l: 'Homes Completed' },
  { n: '₹3.2B+', l: 'Project Value' },
  { n: '99%', l: 'Client Satisfaction' }
];

export const Stats = () => (
  <div className="stats reveal">
    {statsData.map((stat, i) => (
      <div className="stat" key={i}>
        <span className="stat-n">{stat.n}</span>
        <span className="stat-l">{stat.l}</span>
      </div>
    ))}
  </div>
);

export const VideoStrip = () => (
  <div className="vid-strip reveal">
    <div className="vid-overlay">
      <div className="vid-text">
        <h2>Uncompromising Quality.</h2>
      </div>
    </div>
  </div>
);

export const About = () => (
  <section className="sec sec-off" id="about" style={{ padding: '120px 100px' }}>
    <div className="inner">
      <div className="split-grid" style={{ alignItems: 'center', gap: '80px' }}>
        <div className="reveal in">
          <span className="tag">Since 1997</span>
          <h2 className="h2" style={{ fontSize: '56px' }}>Building Value For<br />Over Two Decades</h2>
          <p className="body-p">
            SHBuilders has earned the trust of families for design-build, pre-construction, general contracting, and construction management. Today we’re still known for our innovation, personalization and commitment to exceed expectations.
          </p>
          <Link href="/company" className="btn-outline" style={{ marginTop: '40px', color: 'var(--navy)', borderColor: 'var(--navy)', display: 'inline-block' }}>
            Our Company
          </Link>
        </div>
        <div className="split-img reveal in" style={{ position: 'relative', height: '600px', width: '100%' }}>
          <Image
            src="/images/PherinWoodExteriors.jpg"
            alt="About SHBuilders"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

const servicesData = [
  { id: '01', title: 'Custom Home Design-Build', desc: 'We manage every aspect of your project from the initial sketch to the final walk-through, ensuring unparalleled craftsmanship and seamless execution.' },
  { id: '02', title: 'General Contracting', desc: 'Expert management and execution of high-end residential construction projects, coordinating with the finest tradesmen and artisans.' },
  { id: '03', title: 'Home Renovation', desc: 'Transforming existing spaces into modern masterpieces while preserving their original character and elevating their value.' }
];

export const Services = () => (
  <section className="sec" id="services" style={{ backgroundColor: 'var(--charcoal)', color: '#fff', padding: '0', position: 'relative' }}>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>

      {/* Sticky Image Side */}
      <div style={{ flex: '1 1 50%', minWidth: 'min(100%, 400px)', position: 'sticky', top: '0', height: '100vh', minHeight: '600px' }}>
        <Image
          src="/images/PersimmonDrKitchen.jpg"
          alt="Our Services"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover', filter: 'brightness(0.8)' }}
          loading="lazy"
        />
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(to right, rgba(30, 41, 59, 0), rgba(30, 41, 59, 1))' }} />
      </div>

      {/* Scrolling Content Side */}
      <div style={{ flex: '1 1 50%', minWidth: 'min(100%, 400px)', padding: '160px 8%', zIndex: 2 }}>
        <div className="reveal in">
          <span className="tag" style={{ color: 'var(--gold)' }}>Expertise</span>
          <h2 className="h2" style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: '#fff', marginBottom: '80px' }}>Complete Home<br />Building Solutions</h2>

          <div className="svc-list" style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {servicesData.map((svc, i) => (
              <div className="svc-item reveal in" key={i}>
                <span style={{ fontSize: '14px', color: 'var(--gold)', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>{svc.id}</span>
                <h3 style={{ fontSize: '32px', fontFamily: 'var(--serif)', marginBottom: '20px' }}>{svc.title}</h3>
                <p className="body-p" style={{ fontSize: '18px', color: '#aaa', lineHeight: '1.6' }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  </section>
);

export const Testimonials = () => (
  <section className="sec sec-off" style={{ padding: '160px 0', textAlign: 'center' }}>
    <div className="inner reveal in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <span className="tag" style={{ color: 'var(--gold)', marginBottom: '40px', display: 'block' }}>Client Voices</span>

      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', fontSize: '120px', color: 'rgba(0,0,0,0.05)', fontFamily: 'var(--serif)', lineHeight: '1' }}>&ldquo;</span>
        <p className="testi-text" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: '1.4', fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--navy)', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
          SHBuilders’ outstanding performance on this time sensitive project greatly exceeded all our expectations. Exquisite craftsmanship and unparalleled attention to detail.
        </p>
        <span className="testi-author" style={{ fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '600', color: '#666' }}>
          Sanjay K. &mdash; North Carolina
        </span>
      </div>

    </div>
  </section>
);

const clientsData = [
  { name: 'Architectural Digest', style: { fontFamily: 'var(--serif)', fontSize: '24px', letterSpacing: '1px', textTransform: 'uppercase' } },
  { name: 'Home & Design', style: { fontFamily: 'var(--serif)', fontSize: '28px', fontStyle: 'italic' } },
  { name: 'DWELL', style: { fontFamily: 'var(--sans)', fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase' } },
  { name: 'Luxury Homes', style: { fontFamily: 'var(--serif)', fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase' } }
];

export const Clients = () => (
  <section className="sec sec-wh" id="clients" style={{ padding: '120px 0', borderTop: '1px solid #eee' }}>
    <div className="inner">
      <div className="reveal in" style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="tag">Our Network</span>
        <h2 className="h2" style={{ fontSize: '48px', marginBottom: '20px' }}>Featured Collaborators</h2>
        <p className="body-p" style={{ maxWidth: '600px', margin: '0 auto', color: '#666' }}>
          We partner with the world's most distinguished publications and architectural firms to bring unparalleled vision to every project.
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '40px',
        alignItems: 'center',
        justifyItems: 'center',
        opacity: 0.7
      }}>
        {clientsData.map((client, i) => (
          <div className="reveal in" style={client.style} key={i}>{client.name}</div>
        ))}
      </div>
    </div>
  </section>
);

export const ParallaxStrip = ({ image, title }) => (
  <div className="parallax-strip" style={{ backgroundImage: `url(${image})` }}>
    <div className="parallax-overlay" />
    {title && (
      <div className="parallax-content reveal in">
        <h2>{title}</h2>
      </div>
    )}
  </div>
);

export const ProcessVideo = () => {
  const steps = [
    {
      num: '01',
      title: 'Architectural & Spatial Design',
      desc: 'Collaborative space planning, custom architectural drawing, and luxury interior rendering to align the home’s layout perfectly with your lifestyle.',
      milestones: ['Concept Design & Layout', '3D Interior Renderings', 'Structural Planning'],
      img: '/images/Alydar Loop inside.jpg'
    },
    {
      num: '02',
      title: 'Pre-Construction Planning',
      desc: 'Engineering site plans, final material specifications, and budgeting to secure the finest tradesmen and luxury custom finishes.',
      milestones: ['Site Preparation & Permitting', 'Budget & Estimation Sign-off', 'Finishes & Materials Selection'],
      img: '/images/RidgeField PI Exteriors.jpg'
    },
    {
      num: '03',
      title: 'Master Craftsmanship & Build',
      desc: 'Expert general contracting, premium structural execution, and rigorous on-site management where finish details are crafted to museum-grade perfection.',
      milestones: ['Foundation, Framing & Roofing', 'MEP Rough-in & Insulation', 'Drywall & Core Structure'],
      img: '/images/JOHNSONRDW.jpg'
    },
    {
      num: '04',
      title: 'Refinement & Handover',
      desc: 'Comprehensive final walkthrough, key handover, and continued long-term client support as you step into your custom architectural masterpiece.',
      milestones: ['Fixtures & Interior Finishes', 'Exterior Landscaping', 'Punch List & Final Handover'],
      img: '/images/PersimmonDrKitchen.jpg'
    }
  ];

  return (
    <section className="sec" id="process" style={{ backgroundColor: 'var(--navy)', color: '#fff', padding: '140px 10% 160px', position: 'relative', overflow: 'hidden' }}>
      <div className="inner">
        {/* Section Header */}
        <div className="reveal in" style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span className="tag" style={{ color: 'var(--gold)', marginBottom: '15px' }}>Our Process</span>
          <h2 className="h2" style={{ color: '#fff', fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '20px' }}>The Building Cycle</h2>
          <p className="body-p" style={{ color: '#8A99AD', margin: '0 auto', maxWidth: '650px' }}>
            A rigorous, transparent journey from initial concept to master-crafted completion, ensuring your custom home meets our uncompromising standards of luxury.
          </p>
        </div>

        {/* Process Steps Timeline Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          position: 'relative',
          marginTop: '60px'
        }}>
          {steps.map((step, idx) => (
            <div
              className="reveal in"
              key={idx}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                background: 'var(--charcoal)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '30px',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image Preview Box */}
              <div style={{
                position: 'relative',
                height: '200px',
                width: '100%',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <Image
                  src={step.img}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: 'cover', filter: 'brightness(0.85)' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  background: 'var(--gold)',
                  color: '#fff',
                  fontFamily: 'var(--serif)',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}>
                  {step.num}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '22px',
                  color: '#fff',
                  marginBottom: '12px',
                  fontWeight: '400',
                  lineHeight: '1.3'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#A0AEC0',
                  lineHeight: '1.7',
                  minHeight: '80px'
                }}>
                  {step.desc}
                </p>
              </div>

              {/* Technical PM Milestones */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '20px',
                marginTop: 'auto'
              }}>
                <span style={{
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  Key Milestones
                </span>
                <ul style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: 0,
                  margin: 0
                }}>
                  {step.milestones.map((m, i) => (
                    <li key={i} style={{
                      fontSize: '13px',
                      color: '#CBD5E0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--gold)',
                        display: 'inline-block'
                      }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
