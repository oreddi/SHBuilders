import React from 'react';

export const Stats = () => (
  <div className="stats reveal">
    <div className="stat"><span className="stat-n">28+</span><span className="stat-l">Years Building</span></div>
    <div className="stat"><span className="stat-n">420</span><span className="stat-l">Homes Completed</span></div>
    <div className="stat"><span className="stat-n">₹3.2B+</span><span className="stat-l">Project Value</span></div>
    <div className="stat"><span className="stat-n">99%</span><span className="stat-l">Client Satisfaction</span></div>
  </div>
);

export const VideoStrip = () => (
  <div className="vid-strip reveal">
    {/* <video autoPlay muted loop playsInline>
      <source src="https://cdn.coverr.co/videos/coverr-construction-site-in-the-afternoon-8914/1080p.mp4" type="video/mp4" />
    </video> */}
    <div className="vid-overlay">
      <div className="vid-text">
        <h2>Uncompromising Quality.</h2>
      </div>
    </div>
  </div>
);

export const About = () => (
  <section className="sec sec-wh" id="about" style={{ paddingBottom: 0 }}>
    <div className="inner">
      <div className="split-grid">
        <div className="reveal in">
          <span className="tag">Since 1997</span>
          <h2 className="h2">Building Value For<br />Over Two Decades</h2>
          <p className="body-p">
            SHBuilders has earned the trust of families for design-build, pre-construction, general contracting, and construction management. Today we’re still known for our innovation, personalization and commitment to exceed expectations.
          </p>
          <button className="btn-outline" style={{ marginTop: '40px', color: '#000', borderColor: '#000' }}>Our Company</button>
        </div>
        <div className="split-img reveal in">
          <img src="/images/PherinWoodExteriors.jpg" alt="About SHBuilders" />
        </div>
      </div>
    </div>
  </section>
);

export const Services = () => (
  <section className="sec sec-wh" id="services">
    <div className="inner">
      <div className="split-grid" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
        <div className="split-img reveal in">
          <img src="/images/PersimmonDrKitchen.jpg" alt="Our Services" />
        </div>
        <div className="reveal in">
          <span className="tag">Services</span>
          <h2 className="h2">Complete Home<br />Building Solutions</h2>
          <div className="svc-list">
            <div className="svc-item">
              <h3>Custom Home Design-Build</h3>
              <p>We manage every aspect of your project from the initial sketch to the final walk-through.</p>
            </div>
            <div className="svc-item">
              <h3>General Contracting</h3>
              <p>Expert management and execution of high-end residential construction projects.</p>
            </div>
            <div className="svc-item">
              <h3>Home Renovation</h3>
              <p>Transforming existing spaces into modern masterpieces while preserving their original character.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const Testimonials = () => (
  <section className="sec sec-off">
    <div className="inner reveal">
      <span className="tag">Testimonials</span>
      <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '60px', marginTop: '60px' }}>
        <div className="testi-item">
          <p className="testi-text" style={{ fontSize: '24px', lineHeight: '1.4', fontStyle: 'italic', marginBottom: '20px' }}>
            “SHBuilders’ outstanding performance on this time sensitive project greatly exceeded all our expectations. Exquisite craftsmanship.”
          </p>
          <span className="testi-author" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Sanjay K., North Carolina</span>
        </div>
        <div className="testi-item">
          <p className="testi-text" style={{ fontSize: '24px', lineHeight: '1.4', fontStyle: 'italic', marginBottom: '20px' }}>
            “The attention to detail and commitment to our vision was unparalleled. SHBuilders transformed our ideas into a masterpiece.”
          </p>
          <span className="testi-author" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Michael R., Charlotte</span>
        </div>
        <div className="testi-item">
          <p className="testi-text" style={{ fontSize: '24px', lineHeight: '1.4', fontStyle: 'italic', marginBottom: '20px' }}>
            “A truly professional team. From pre-construction to the final walkthrough, SHBuilders delivered perfection at every stage.”
          </p>
          <span className="testi-author" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Sarah L., Raleigh</span>
        </div>
      </div>
    </div>
  </section>
);

export const Clients = () => (
  <section className="sec sec-wh" id="clients">
    <div className="inner">
      <div className="reveal">
        <span className="tag">Our Network</span>
        <h2 className="h2">Collaborators</h2>
      </div>
      <div className="client-grid">
        <div className="client-logo reveal">Architectural Digest</div>
        <div className="client-logo reveal">Home & Design</div>
        <div className="client-logo reveal">Dwell</div>
        <div className="client-logo reveal">Luxury Homes</div>
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

export const ProcessVideo = () => (
  <div className="vid-strip reveal in" style={{ height: '50vh', minHeight: '400px', margin: '40px 0' }}>
    <video autoPlay muted loop playsInline style={{ filter: 'brightness(0.7)' }}>
      <source src="https://v1.coverr.co/video/architect-working-on-blueprints-8913/720p.mp4" type="video/mp4" />
    </video>
    <div className="vid-overlay">
      <div className="vid-text">
        <span className="tag" style={{ color: '#fff', opacity: 0.8 }}>Our Process</span>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '300' }}>The Building Cycle</h2>
      </div>
    </div>
  </div>
);
