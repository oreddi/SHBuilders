import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const LIMITS = { name: 200, email: 254, phone: 40, budget: 80, message: 5000 };
const SOURCES = ['contact_form', 'property_inquiry'];

export async function POST(request) {
  try {
    const body = await request.json();

    // Spam trap: real visitors never see or fill the hidden "website" field
    if (body.website) {
      return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' });
    }

    const raw = Object.fromEntries(
      Object.entries(LIMITS).map(([key, max]) => [key, String(body[key] ?? '').trim().slice(0, max)])
    );
    const source = SOURCES.includes(body.source) ? body.source : 'contact_form';

    // Validation
    if (!raw.name || !raw.email || !raw.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const [name, email, phone, budget, message] = [raw.name, raw.email, raw.phone, raw.budget, raw.message].map(
      (v) => (v ? escapeHtml(v) : v)
    );

    // Save the lead so nothing is lost if the email lands in spam (CRM-ready handoff)
    try {
      await prisma.lead.create({
        data: {
          name: raw.name,
          email: raw.email,
          phone: raw.phone || null,
          budget: raw.budget || null,
          message: raw.message,
          source,
        },
      });
    } catch (err) {
      console.error('Lead save failed (email still sent):', err);
    }

    // Optional: forward to a CRM / Zapier / HubSpot webhook
    if (process.env.LEAD_WEBHOOK_URL) {
      try {
        await fetch(process.env.LEAD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...raw, source, submittedAt: new Date().toISOString() }),
          signal: AbortSignal.timeout(5000),
        });
      } catch (err) {
        console.error('Lead webhook failed:', err);
      }
    }

    // If Resend API key is configured, send email
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'shbuilderstn@gmail.com';

    if (RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(RESEND_API_KEY);

      const { error } = await resend.emails.send({
        from: 'SH Builders Website <onboarding@resend.dev>',
        to: [CONTACT_EMAIL],
        subject: `New Lead: ${name} — ${budget || 'Budget not specified'}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #F8F9FA; border-radius: 8px;">
            <h1 style="color: #0F172A; font-size: 24px; margin-bottom: 20px;">New Lead from SH Builders Website</h1>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; font-weight: bold; color: #64748B; width: 120px;">Name</td><td style="padding: 10px 0; color: #0F172A;">${name}</td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #64748B;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #C5A059;">${email}</a></td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #64748B;">Phone</td><td style="padding: 10px 0; color: #0F172A;">${phone || 'Not provided'}</td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #64748B;">Budget</td><td style="padding: 10px 0; color: #0F172A;">${budget || 'Not specified'}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 20px; background: #fff; border-radius: 4px; border: 1px solid #E2E8F0;">
              <p style="font-weight: bold; color: #64748B; margin: 0 0 8px;">Message</p>
              <p style="color: #0F172A; margin: 0; line-height: 1.6;">${message}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #94A3B8;">Submitted via sh-builders.vercel.app</p>
          </div>
        `,
      });
      if (error) throw new Error(error.message);
    } else {
      // Log to console if no API key (development)
      console.log('=== NEW CONTACT FORM SUBMISSION ===');
      console.log({ name, email, phone, budget, message });
      console.log('===================================');
      console.log('Note: Set RESEND_API_KEY env var to enable email delivery');
    }

    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
