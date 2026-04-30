import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { Stats, VideoStrip, About, Services, ProcessVideo } from '../components/HomeSections';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/projects`)
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

      <section className="sec sec-wh" id="home-portfolio">
        <div className="inner">
          <div className="reveal in" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span className="tag">Portfolio</span>
            <h2 className="h2" style={{ marginBottom: '20px' }}>Selected Works</h2>
            <p className="body-p" style={{ maxWidth: '700px', margin: '0 auto' }}>
              A showcase of our commitment to quality and architectural excellence. Review our portfolio of custom luxury constructions.
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
              <div style={{ textAlign: 'center', marginTop: '80px' }} className="reveal in">
                <Link to="/portfolio" className="btn-outline" style={{ color: '#000', borderColor: '#000' }}>View All Projects</Link>
              </div>
            </>
          )}
        </div>
      </section>

      <About />
      <Services />
    </>
  );
};

export default Home;
