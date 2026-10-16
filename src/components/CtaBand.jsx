"use client";

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

// Call-to-action band (proposal §2.5 component library: "CTA bands")
export default function CtaBand({
  location,
  eyebrow = 'Start Your Project',
  title = 'Ready to Build Something Lasting?',
  text = 'Tell us about your lot, your plans and your timeline. We will walk you through design, budget and schedule — no obligation.',
  primary = { href: '/#contact', label: 'Request a Consultation' },
  secondary = { href: '/portfolio', label: 'View Our Work' },
}) {
  return (
    <section className="cta-band" aria-label={title}>
      <div className="inner cta-band-inner">
        <div>
          <span className="tag" style={{ color: 'var(--gold)' }}>{eyebrow}</span>
          <h2 className="h2 cta-band-title">{title}</h2>
          <p className="body-p cta-band-text">{text}</p>
        </div>
        <div className="cta-band-actions">
          <Link href={primary.href} className="btn-solid" onClick={() => trackEvent('cta_click', { location, cta: 'primary' })}>
            {primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn-outline" style={{ borderColor: '#fff', color: '#fff' }} onClick={() => trackEvent('cta_click', { location, cta: 'secondary' })}>
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
