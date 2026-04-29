import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer id="contact" className="reveal">
    <div className="inner ft-grid" style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '80px', paddingBottom: '60px'}}>
      <div>
        <div className="ft-logo" style={{fontFamily: 'var(--serif)', fontSize: '28px', color: '#fff', letterSpacing: '4px', marginBottom: '20px'}}>
          SHBUILDERS
        </div>
        <p className="ft-desc" style={{color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', maxWidth: '400px'}}>
          Crafting minimalist, high-end residences since 1997. Building value through uncompromising standards and architectural integrity.
        </p>
      </div>
      <div className="ft-col">
        <h4 style={{fontSize: '11px', color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '25px'}}>Company</h4>
        <ul style={{listStyle: 'none', display: 'grid', gap: '15px'}}>
          <li><Link to="/" style={{color: 'rgba(255,255,255,0.5)', fontSize: '14px'}}>Home</Link></li>
          <li><Link to="/company" style={{color: 'rgba(255,255,255,0.5)', fontSize: '14px'}}>About Us</Link></li>
          <li><Link to="/portfolio" style={{color: 'rgba(255,255,255,0.5)', fontSize: '14px'}}>Portfolio</Link></li>
        </ul>
      </div>
      <div className="ft-col">
        <h4 style={{fontSize: '11px', color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '25px'}}>Contact</h4>
        <ul style={{listStyle: 'none', display: 'grid', gap: '15px'}}>
          <li><a href="mailto:info@shbuilders.com" style={{color: 'rgba(255,255,255,0.5)', fontSize: '14px'}}>info@shbuilders.com</a></li>
          <li><a href="tel:+19195550123" style={{color: 'rgba(255,255,255,0.5)', fontSize: '14px'}}>+1 (919) 555-0123</a></li>
          <li><span style={{color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6'}}>North Carolina, USA</span></li>
        </ul>
      </div>
    </div>
    <div className="ft-bottom" style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <p className="ft-copy" style={{color: 'rgba(255,255,255,0.3)', fontSize: '12px'}}>© 2026 SHBuilders. All rights reserved.</p>
      <a href="#" style={{color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px'}}>Back to Top</a>
    </div>
  </footer>
);

export default Footer;
