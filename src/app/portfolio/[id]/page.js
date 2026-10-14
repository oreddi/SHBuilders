import { notFound } from 'next/navigation';
import PropertyDetails from './PropertyDetails';
import { getProperty, getPortfolio, getPortfolioSlugs } from '@/lib/content';

export const revalidate = 300; // re-check Sanity every 5 minutes

// Pre-build every property page at deploy time; new properties are built on first visit.
export async function generateStaticParams() {
  const slugs = await getPortfolioSlugs();
  return slugs.map((id) => ({ id }));
}

export default async function PropertyPage({ params }) {
  const { id: slug } = await params;
  const [property, allProjects] = await Promise.all([getProperty(slug), getPortfolio()]);
  if (!property) notFound();

  // "Next project" link loops back to the first property at the end
  const currentIndex = allProjects.findIndex((p) => p.id === slug);
  const nextProject =
    currentIndex === -1 ? null : allProjects[(currentIndex + 1) % allProjects.length] || null;

  return <PropertyDetails slug={slug} property={property} nextProject={nextProject} />;
}
