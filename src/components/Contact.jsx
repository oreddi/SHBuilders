"use client";

import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', budget: '', message: '' });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit. Please try again.');
    }

    setSubmitting(false);
  };

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
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', color: '#22C55E' }}>✓</div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '28px', color: 'var(--navy)', marginBottom: '10px' }}>Inquiry Sent</h3>
                <p className="body-p" style={{ margin: '0 auto', textAlign: 'center' }}>
                  Thank you! Our team will reach out within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}}
                  />
                </div>
                <div className="form-row-split" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(423) 555-0123"
                      style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}}
                    />
                  </div>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}}
                  >
                    <option value="">Select a range</option>
                    <option value="$500k - $1M">$500k - $1M</option>
                    <option value="$1M - $2M">$1M - $2M</option>
                    <option value="$2M - $5M">$2M - $5M</option>
                    <option value="$5M+">$5M+</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Project Description *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us about your project..."
                    required
                    style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px', resize: 'vertical'}}
                  />
                </div>

                {error && (
                  <p style={{ color: '#EF4444', fontSize: '14px', margin: 0 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-outline"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
