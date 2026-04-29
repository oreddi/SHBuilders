import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import { Stats, VideoStrip, About, Services, Testimonials, Clients, ParallaxStrip } from '../components/HomeSections';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/projects')
      .then(res => res.json())
      .then(data => {
        setFeaturedProjects(data.slice(0, 5));
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch from backend", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Hero />

      <section className="sec sec-wh" id="home-portfolio" style={{ paddingTop: '60px' }}>
        <div className="inner">
          <div className="reveal" style={{ textAlign: 'left', marginBottom: '60px', maxWidth: '800px' }}>
            <span className="tag">Selected Works</span>
            <h2 className="h2" style={{ fontSize: '32px', marginBottom: '16px' }}>Featured Projects</h2>
            <p className="body-p" style={{ fontSize: '16px', lineHeight: '1.6', color: '#666' }}>
              Design and Architecture from SHBuilders. We have designed and constructed luxury residences for discerning families. Review our portfolio to see how we bring craftsmanship to your vision.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--serif)', fontSize: '20px' }}>
              Loading Projects from Box...
            </div>
          ) : (
            <>
              <div className="proj-grid-dynamic">
                {featuredProjects.map((proj, idx) => (
                  <Link
                    to={`/portfolio/${proj.id}`}
                    className={`proj-card reveal in ${idx < 2 ? 'large' : 'small'}`}
                    key={idx}
                  >
                    <img
                      src={proj.img}
                      alt={proj.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80";
                      }}
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
              <div style={{ textAlign: 'center', marginTop: '60px' }} className="reveal in">
                <Link to="/portfolio" className="btn-solid">View All Projects</Link>
              </div>
            </>
          )}
        </div>
      </section>

      <About />
      <Services />
      <VideoStrip />
    </>
  );
};

export default Home;
