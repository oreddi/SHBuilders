import PageHeader from '@/components/PageHeader';
import CtaBand from '@/components/CtaBand';
import { Services } from '@/components/HomeSections';

export const metadata = {
  title: 'Services — Custom Homes, General Contracting & Renovation',
  description:
    'SH Builders offers custom home design-build, general contracting and whole-home renovation, managed by one team from first sketch to final walkthrough.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        tag="What We Do"
        title="Our Services"
        intro="From an empty lot to a finished home, or a renovation that gives an existing house new life, one team manages every stage."
      />
      <Services />
      <CtaBand location="services" />
    </>
  );
}
