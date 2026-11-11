import React from 'react';
import Link from 'next/link';
import { CONTACT, phoneHref } from '@/lib/siteConfig';

const Footer = () => (
  <footer className="reveal in" style={{background: 'var(--navy)'}}>
    <div className="inner ft-grid">
      <div>
        <div className="ft-logo" style={{fontFamily: 'var(--serif)', fontSize: '24px', color: '#fff', letterSpacing: '4px', marginBottom: '14px'}}>
          SHBUILDERS
        </div>
        <p className="ft-desc" style={{color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', maxWidth: '360px', fontSize: '13px'}}>
          Custom luxury homes and renovations — planned carefully, built by trusted hands, and finished to last.
        </p>
      </div>
      <div className="ft-col">
        <h4 style={{fontSize: '11px', color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px'}}>Company</h4>
        <ul style={{listStyle: 'none', display: 'grid', gap: '10px'}}>
          <li><Link href="/" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Home</Link></li>
          <li><Link href="/company" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>About Us</Link></li>
          <li><Link href="/portfolio" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Portfolio</Link></li>
          <li><Link href="/services" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Services</Link></li>
          <li><Link href="/process" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Our Process</Link></li>
          <li><Link href="/testimonials" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Testimonials</Link></li>
          <li><Link href="/contact" style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>Contact</Link></li>
        </ul>
      </div>
      <div className="ft-col">
        <h4 style={{fontSize: '11px', color: '#fff', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px'}}>Contact</h4>
        <ul style={{listStyle: 'none', display: 'grid', gap: '10px'}}>
          <li><a href={`mailto:${CONTACT.email}`} style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>{CONTACT.email}</a></li>
          {CONTACT.phone && (
            <li><a href={`tel:${phoneHref()}`} style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px'}}>{CONTACT.phone}</a></li>
          )}
          <li><span style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: '1.6'}}>Serving {CONTACT.serviceArea}</span></li>
        </ul>
      </div>
    </div>
    <div className="inner ft-bottom">
      <p className="ft-copy" style={{color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0}}>© 2026 SHBuilders. All rights reserved.</p>
      <a href="#" style={{color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px'}}>Back to Top</a>
    </div>
  </footer>
);

export default Footer;
