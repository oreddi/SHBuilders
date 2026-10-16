const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sh-builders.vercel.app";

export const revalidate = 3600;

export default async function sitemap() {
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/company`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...["services", "process", "testimonials", "contact"].map((p) => ({
      url: `${SITE_URL}/${p}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];

  let propertyPages = [];
  try {
    // Imported lazily so the sitemap still works if Sanity is not configured.
    const { client } = await import("@/sanity/lib/client");
    const properties = await client.fetch(`*[_type == "property" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`);
    propertyPages = properties.map(p => ({
      url: `${SITE_URL}/portfolio/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap: failed to load properties from Sanity", err);
  }

  return [...staticPages, ...propertyPages];
}
