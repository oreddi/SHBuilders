import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProjectDetails = () => {
  const { folderId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/projects/${folderId}`)
      .then(res => res.json())
      .then(data => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch project details", err);
        setLoading(false);
      });
  }, [folderId]);

  return (
    <div style={{ paddingTop: '100px' }}>
      <section className="sec sec-off">
        <div className="inner">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
            <Link to="/portfolio" className="tag" style={{ display: 'inline-block', marginBottom: '20px' }}>← Back to Portfolio</Link>
            <h1 className="h2" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>Project Details</h1>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', fontFamily: 'var(--serif)', fontSize: '24px' }}>
              Loading project images from Box...
            </div>
          ) : (
            <>
              <div className="proj-grid">
                {images.slice(0, 10).map((imgObj, idx) => (
                  <div className="proj-card reveal in" key={idx} style={{ height: '400px', cursor: 'default' }}>
                    <img
                      src={imgObj.img}
                      alt={imgObj.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"; // Luxury House Fallback
                      }}
                    />
                    <div className="proj-overlay">
                      <div className="proj-info">
                        <h3 className="proj-name" style={{ fontSize: '18px' }}>{imgObj.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}

                {images.length === 0 && (
                  <p className="body-p" style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                    No images found inside this folder.
                  </p>
                )}
              </div>

              {!loading && images.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '80px' }} className="reveal in">
                  <p className="body-p" style={{ margin: '0 auto 20px' }}>For full high-resolution images, view the complete gallery.</p>
                  <a
                    href={`https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/${folderId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-solid"
                  >
                    View Full Gallery on Box
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
