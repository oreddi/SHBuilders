import PortfolioGrid from './PortfolioGrid';
import { getPortfolio } from '@/lib/content';

export const revalidate = 300; // re-check Sanity every 5 minutes

export default async function PortfolioPage() {
  const projects = await getPortfolio();
  return <PortfolioGrid projects={projects} />;
}
