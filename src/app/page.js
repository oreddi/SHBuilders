import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import { Stats, About, Services, ProcessVideo, Clients } from '@/components/HomeSections';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import TuckmanReveal from '@/components/TuckmanReveal';
import { getFeaturedProjects, getHeroSlides, getTestimonials } from '@/lib/content';

export const revalidate = 300; // re-check Sanity every 5 minutes

export default async function Home() {
  const [featuredProjects, heroSlides, testimonials] = await Promise.all([
    getFeaturedProjects(),
    getHeroSlides(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero heroSlides={heroSlides} />

      {/* SOLID BLOCK 1: About SH Builders and Featured Collaborators */}
      <div style={{ position: 'relative', zIndex: 10, background: 'var(--white)' }}>
        <About />
        <Clients />
      </div>

      {/* PEER THROUGH VIDEO WINDOW */}
      <TuckmanReveal />

      {/* SOLID BLOCK 2: Portfolio, Services, Process, and Testimonials */}
      <div style={{ position: 'relative', zIndex: 10, background: 'var(--white)' }}>
        <section className="sec sec-wh" id="home-portfolio">
          <div className="inner">
            <div className="reveal in" style={{ textAlign: 'center', marginBottom: '60px' }}>
              <span className="tag">Portfolio</span>
              <h2 className="h2" style={{ marginBottom: '20px' }}>Selected Works</h2>
              <p className="body-p" style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
                A curated collection of our finest custom homes and renovations. Review our craftsmanship.
              </p>
            </div>

            {featuredProjects.length > 0 && (
              <>
                <div className="proj-grid-dynamic">
                  {featuredProjects.map((proj, idx) => (
                    <Link
                      href={`/portfolio/${proj.id}`}
                      className={`proj-card reveal in ${idx < 2 ? 'large' : 'small'}`}
                      key={idx}
                    >
                      {/* Using next/image for Tuckman-style smooth, optimized loading */}
                      <Image
                        src={proj.img || "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"}
                        alt={proj.name}
                        fill
                        sizes={idx < 2 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                        quality={75}
                      />
                      <div className="proj-overlay">
                        <div className="proj-info">
                          <span className="proj-cat">Selected Project</span>
                          <h3 className="proj-name">{proj.name}</h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '80px' }} className="reveal in">
                  <Link href="/portfolio" className="btn-outline" style={{ color: '#000', borderColor: '#000', display: 'inline-block' }}>
                    View All Projects
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <Services />
        <ProcessVideo />
        <Testimonials testimonials={testimonials} />
      </div>

      {/* The "Special" Contact Reveal */}
      <div style={{ position: 'relative', clipPath: 'inset(0 0 0 0)', background: 'var(--white)' }}>
        <div style={{ position: 'relative', zIndex: 0, transform: 'translateY(-100px)', animation: 'parallaxReveal linear forwards' }}>
          <Contact />
        </div>
      </div>
    </>
  );
}

