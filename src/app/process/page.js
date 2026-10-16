import PageHeader from '@/components/PageHeader';
import CtaBand from '@/components/CtaBand';
import { ProcessVideo } from '@/components/HomeSections';

export const metadata = {
  title: 'Our Process — How We Build Your Custom Home',
  description:
    'See the four stages of building with SH Builders: design, pre-construction planning, construction, and refinement and handover.',
  alternates: { canonical: '/process' },
};

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        tag="How It Works"
        title="Our Process"
        intro="A clear, step-by-step path from your first idea to moving in, with milestones you can see along the way."
      />
      <ProcessVideo />
      <CtaBand location="process" />
    </>
  );
}
