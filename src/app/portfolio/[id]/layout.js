import { getProperty } from '@/lib/content';

// Per-property SEO: uses the seoTitle / seoDescription fields from Sanity.
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const property = await getProperty(id);
    if (!property) return { title: 'Project Not Found' };

    const title = property.seoTitle || property.name;
    const description =
      property.seoDescription ||
      (typeof property.description === 'string' ? property.description.slice(0, 160) : undefined) ||
      `${property.name} — a custom home by SH Builders.`;
    const image = property.images[0]?.img;

    return {
      title,
      description,
      alternates: { canonical: `/portfolio/${id}` },
      openGraph: { title, description, ...(image && { images: [{ url: image }] }) },
    };
  } catch {
    return {};
  }
}

export default function PropertyLayout({ children }) {
  return children;
}
