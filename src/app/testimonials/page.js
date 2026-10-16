import PageHeader from '@/components/PageHeader';
import CtaBand from '@/components/CtaBand';
import Testimonials from '@/components/Testimonials';
import { getTestimonials } from '@/lib/content';

export const revalidate = 300;

export const metadata = {
  title: 'Client Testimonials',
  description: 'What homeowners say about building and renovating with SH Builders.',
  alternates: { canonical: '/testimonials' },
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <PageHeader tag="Client Voices" title="Testimonials" intro="In their own words: homeowners on building with SH Builders." />
      <Testimonials testimonials={testimonials} />
      <CtaBand location="testimonials" />
    </>
  );
}
