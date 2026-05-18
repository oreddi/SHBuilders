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

  useEffect(() => {
    fetch('/api/projects')
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
    if (cat === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.cat.toLowerCase() === cat.toLowerCase()));
    }
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

          {/* Filter Bar - From Project Proposal Section 2.5 */}
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
            <div className="proj-grid">
              {filteredProjects.map((proj, idx) => (
                <Link href={`/portfolio/${proj.id}`} className="proj-card reveal in" key={idx} style={{ height: '500px' }}>
                  <img src={proj.img} alt={proj.name} loading="lazy" />
                  <div className="proj-overlay">
                    <div className="proj-info">
                      <span className="proj-cat">{proj.cat}</span>
                      <h3 className="proj-name">{proj.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
              
              {filteredProjects.length === 0 && (
                <div style={{ textAlign: 'center', width: '100%', padding: '60px 0', color: 'var(--grey)' }}>
                  No projects found in this category yet.
                </div>
              )}
            </div>
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
      `}</style>
    </div>
  );
}
