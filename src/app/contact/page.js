import Contact from '@/components/Contact';

export const metadata = {
  title: 'Contact — Start Your Project',
  description:
    'Tell SH Builders about your custom home or renovation. Share your plans, budget range and timeline and our team will get back to you.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <Contact />
    </div>
  );
}
