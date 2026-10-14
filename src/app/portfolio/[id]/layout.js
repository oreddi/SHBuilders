import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

// Per-property SEO: uses the seoTitle / seoDescription fields from Sanity.
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const property = await client.fetch(
      `*[_type == "property" && (slug.current == $slug || _id == $slug)][0]{ name, description, seoTitle, seoDescription, mainImage }`,
      { slug: id },
      { next: { revalidate: 300 } }
    );
    if (!property) return { title: 'Project Not Found' };

    const title = property.seoTitle || property.name;
    const description =
      property.seoDescription ||
      (typeof property.description === 'string' ? property.description.slice(0, 160) : undefined) ||
      `${property.name} — a custom home by SH Builders.`;
    const image = property.mainImage?.asset ? urlFor(property.mainImage).width(1200).height(630).url() : undefined;

    return {
      title,
      description,
      alternates: { canonical: `/portfolio/${id}` },
      openGraph: { title, description, ...(image && { images: [{ url: image, width: 1200, height: 630 }] }) },
    };
  } catch {
    return {};
  }
}

export default function PropertyLayout({ children }) {
  return children;
}
