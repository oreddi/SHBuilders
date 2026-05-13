"use client";

import React from 'react';

const Contact = () => {
  return (
    <section className="sec sec-wh" id="contact" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="inner">
        <div className="split-grid">
          <div className="reveal">
            <span className="tag">Get In Touch</span>
            <h2 className="h2" style={{fontSize: 'clamp(40px, 5vw, 64px)'}}>Got a project in mind?<br/>Let's build it.</h2>
            <p className="body-p" style={{ marginBottom: '40px' }}>
              Whether you are looking to build a custom luxury home from the ground up or undertake a massive renovation, our team is ready to bring your vision to life.
            </p>
            
            <div style={{ marginBottom: '40px' }}>
              <h4 style={{fontFamily: 'var(--serif)', fontSize: '24px', marginBottom: '10px'}}>SH Builders Headquarters</h4>
              <p className="body-p" style={{margin: 0}}>P.O. Box 4084</p>
              <p className="body-p" style={{margin: 0}}>Chattanooga, TN 37405</p>
              <p className="body-p" style={{margin: 0, marginTop: '20px'}}>
                <a href="mailto:shbuilderstn@gmail.com" style={{color: 'var(--navy)', textDecoration: 'underline'}}>shbuilderstn@gmail.com</a>
              </p>
              <p className="body-p" style={{margin: 0}}>+1 (423) 555-0199</p>
            </div>
          </div>
          
          <div className="reveal" style={{background: 'var(--stone)', padding: '40px', borderRadius: '4px'}}>
            <form onSubmit={(e) => e.preventDefault()} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div>
                <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Name</label>
                <input type="text" placeholder="John Doe" required style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}} />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Email</label>
                  <input type="email" placeholder="john@example.com" required style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}} />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Phone</label>
                  <input type="tel" placeholder="(423) 555-0123" required style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}} />
                </div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Budget Range</label>
                <select style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}}>
                  <option value="">Select a range</option>
                  <option value="500k-1m">$500k - $1M</option>
                  <option value="1m-2m">$1M - $2M</option>
                  <option value="2m-5m">$2M - $5M</option>
                  <option value="5m+">$5M+</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Project Description</label>
                <textarea rows="4" placeholder="Tell us about your project..." style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px', resize: 'vertical'}}></textarea>
              </div>
              <button className="btn-outline" style={{width: '100%', textAlign: 'center', cursor: 'pointer'}}>Submit Inquiry</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
