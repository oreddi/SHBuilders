import PortfolioGrid from './PortfolioGrid';
import CtaBand from '@/components/CtaBand';
import { getPortfolio } from '@/lib/content';

export const revalidate = 300; // re-check Sanity every 5 minutes

export default async function PortfolioPage() {
  const projects = await getPortfolio();
  return (
    <>
      <PortfolioGrid projects={projects} />
      <CtaBand
        location="portfolio"
        eyebrow="Your Home Next"
        title="See Something You Love?"
        text="Every home here started with a conversation. Share your ideas and we will show you what it takes to build yours."
        secondary={null}
      />
    </>
  );
}
