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
              <h4 style={{fontFamily: 'var(--serif)', fontSize: '24px', marginBottom: '10px'}}>LuxeBuild Headquarters</h4>
              <p className="body-p" style={{margin: 0}}>4200 Oakwood Drive, Suite 100</p>
              <p className="body-p" style={{margin: 0}}>Charlotte, North Carolina 28205</p>
              <p className="body-p" style={{margin: 0, marginTop: '20px'}}>
                <a href="mailto:inquiries@luxebuild-nc.com" style={{color: 'var(--black)', textDecoration: 'underline'}}>inquiries@luxebuild-nc.com</a>
              </p>
              <p className="body-p" style={{margin: 0}}>+1 (704) 555-0199</p>
            </div>
          </div>
          
          <div className="reveal" style={{background: 'var(--off)', padding: '40px', borderRadius: '4px'}}>
            <form onSubmit={(e) => e.preventDefault()} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div>
                <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Name</label>
                <input type="text" placeholder="John Doe" style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Email</label>
                <input type="email" placeholder="john@example.com" style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--grey)'}}>Project Description</label>
                <textarea rows="4" placeholder="Tell us about your project..." style={{width: '100%', padding: '15px', border: '1px solid var(--border)', background: '#fff', fontSize: '16px', resize: 'vertical'}}></textarea>
              </div>
              <button className="btn-solid" style={{width: '100%', textAlign: 'center', cursor: 'pointer', border: 'none'}}>Submit Inquiry</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
