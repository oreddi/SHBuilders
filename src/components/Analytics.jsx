import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';

// Vercel Analytics always; Google Analytics 4 only when NEXT_PUBLIC_GA_ID is set.
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <>
      <VercelAnalytics />
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}
