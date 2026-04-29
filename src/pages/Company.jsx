import React from 'react';
import { Testimonials, Clients } from '../components/HomeSections';

const CompanyPage = () => {
  return (
    <div style={{ paddingTop: '100px' }}>
      <section className="sec sec-wh">
        <div className="inner">
          <div className="split-grid">
            <div className="reveal">
              <span className="tag">Our History</span>
              <h1 className="h2" style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}>Built on Trust<br/>Since 1997</h1>
              <p className="body-p" style={{ marginBottom: '30px' }}>
                SHBuilders started with a simple premise: build every home as if it were our own. Over the past 28 years, we have grown into one of the region's most respected general contractors, never losing sight of that founding principle.
              </p>
              <p className="body-p">
                We believe that true luxury lies in the details—the perfectly flush baseboards, the seamless transitions between materials, and the rigorous planning that happens before a single hammer swings. Our team of master craftsmen and dedicated project managers ensure every build is a masterpiece of precision and care.
              </p>
            </div>
            <div className="split-img reveal">
              <img src="/images/PherinWoodExteriors.jpg" alt="Our Team at Work" />
            </div>
          </div>
        </div>
      </section>
      
      <Testimonials />
      <Clients />
    </div>
  );
};

export default CompanyPage;
