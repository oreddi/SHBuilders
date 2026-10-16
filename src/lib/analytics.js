// Conversion tracking shared by the site (proposal §2.5: GA4 + Vercel Analytics).
// Sends each event to Vercel Analytics, and to Google Analytics 4 when
// NEXT_PUBLIC_GA_ID is set (see src/components/Analytics.jsx).
import { track } from '@vercel/analytics';

export function trackEvent(name, params = {}) {
  try {
    track(name, params);
  } catch {
    // analytics must never break the page
  }
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}
