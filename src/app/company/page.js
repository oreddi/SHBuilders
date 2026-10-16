import React from 'react';
import Testimonials from '@/components/Testimonials';
import CtaBand from '@/components/CtaBand';
import { getTestimonials } from '@/lib/content';

export const revalidate = 300;

export default async function CompanyPage() {
  const testimonials = await getTestimonials();

  return (
    <div style={{ paddingTop: '100px' }}>
      <section className="sec sec-wh">
        <div className="inner">
          <div className="split-grid">
            <div className="reveal">
              <span className="tag">Who We Are</span>
              <h1 className="h2" style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}>Built on<br/>Craft &amp; Trust</h1>
              <p className="body-p" style={{ marginBottom: '30px' }}>
                SH Builders started with a simple premise: build every home as if it were our own. Our craftsmanship, our materials and our relationships with clients are held to a standard well above the local market, and every decision we make starts from that principle.
              </p>
              <p className="body-p">
                We believe that true luxury lies in the details—the perfectly flush baseboards, the seamless transitions between materials, and the rigorous planning that happens before a single hammer swings. Our team of master craftsmen and dedicated project managers ensure every build is a masterpiece of precision and care.
              </p>
            </div>
            <div className="split-img reveal">
              <img src="/images/PherinWoodExteriors.jpg" alt="A finished SH Builders home" />
            </div>
          </div>
        </div>
      </section>
      
      <Testimonials testimonials={testimonials} />
      <CtaBand location="company" />
    </div>
  );
}
