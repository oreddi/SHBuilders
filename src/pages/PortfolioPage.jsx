import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch from backend", err);
        setLoading(false);
      });
  }, []);
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const visibleProjects = projects.slice(0, visibleCount);

  return (
    <div style={{ paddingTop: '100px' }}>
      <section className="sec sec-off">
        <div className="inner">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
            <h1 className="h2" style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}>Our Portfolio</h1>
            <p className="body-p" style={{ margin: '0 auto' }}>
              A curated collection of our finest custom homes and renovations. Built with uncompromising standards.
            </p>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '100px 0', fontFamily: 'var(--serif)', fontSize: '24px'}}>
              Loading Projects from Box...
            </div>
          ) : (
            <>
              <div className="proj-grid">
                {visibleProjects.map((proj, idx) => (
                  <Link to={`/portfolio/${proj.id}`} className="proj-card reveal in" key={idx}>
                    <img src={proj.img} alt={proj.name} loading="lazy" />
                    <div className="proj-overlay">
                      <div className="proj-info">
                        <span className="proj-cat">View Details</span>
                        <h3 className="proj-name">{proj.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {visibleCount < projects.length && (
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                  <button 
                    className="btn-outline reveal in" 
                    onClick={handleLoadMore}
                    style={{ color: 'var(--black)', borderColor: 'var(--border)' }}
                  >
                    Load More Projects ↓
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
