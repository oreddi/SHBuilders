"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  "All",
  "Contemporary",
  "Traditional",
  "Mountain",
  "Coastal",
  "Transitional",
  "Farmhouse"
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; // 2 columns * 5 rows = 10 items per page

  useEffect(() => {
    // Reads from Sanity via /api/portfolio
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
          setFilteredProjects(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch projects", err);
        setLoading(false);
      });
  }, []);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1); // Reset to first page on filter change
    if (cat === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.cat && p.cat.toLowerCase() === cat.toLowerCase()));
    }
  };

  // Pagination Math
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ paddingTop: '120px', background: 'var(--stone)', minHeight: '100vh' }}>
      <section className="sec">
        <div className="inner">
          <div className="reveal in" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
            <span className="tag">Portfolio</span>
            <h1 className="h2" style={{ fontSize: 'clamp(48px, 6vw, 84px)', color: 'var(--navy)' }}>Selected Works</h1>
            <p className="body-p" style={{ margin: '0 auto' }}>
              A curated collection of our finest custom homes and renovations. Filter by style to explore our diverse architectural expertise.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar reveal in">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', fontFamily: 'var(--serif)', fontSize: '24px', color: 'var(--navy)' }}>
              Loading Projects...
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              <div className="proj-grid">
                {paginatedProjects.map((proj, idx) => (
                  <Link href={`/portfolio/${proj.id}`} className="proj-card reveal in" key={proj.id || idx}>
                    <img src={proj.img} alt={proj.name} loading="lazy" />
                    <div className="proj-overlay">
                      <div className="proj-info">
                        <span className="proj-cat">{proj.cat}</span>
                        <h3 className="proj-name">{proj.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div style={{ textAlign: 'center', width: '100%', padding: '60px 0', color: 'var(--grey)' }}>
                  No projects found in this category yet.
                </div>
              )}

              {/* Bottom Pagination - Center Grouped */}
              {totalPages > 1 && (
                <div className="pagination-bottom reveal in">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="pag-btn"
                  >
                    ← Previous
                  </button>
                  <span className="page-info-bottom">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="pag-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style jsx>{`
        .filter-bar {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 50px;
        }
        .filter-btn {
          background: transparent;
          border: 1px solid var(--border);
          padding: 10px 25px;
          font-family: var(--font-montserrat);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--grey);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .filter-btn:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        .filter-btn.active {
          background: var(--navy);
          border-color: var(--navy);
          color: #fff;
        }

        /* Pagination Bottom - Center Grouped */
        .pagination-bottom {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 60px;
          border-top: 1px solid var(--border);
          padding-top: 30px;
        }
        .page-info-bottom {
          font-family: var(--font-montserrat);
          font-size: 12px;
          font-weight: 500;
          color: var(--grey);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Gold Themed Buttons */
        .pag-btn {
          background: transparent;
          border: 1px solid var(--gold);
          padding: 10px 25px;
          font-family: var(--font-montserrat);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--gold);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .pag-btn:hover:not(:disabled) {
          background: var(--gold);
          color: #fff;
        }
        .pag-btn:disabled {
          opacity: 0.35;
          border-color: var(--border);
          color: var(--grey);
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .pagination-bottom {
            flex-direction: column;
            gap: 15px;
            padding-top: 20px;
          }
          .pag-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
