const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sh-builders.vercel.app";

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
  ];

  // In the future, dynamically add property detail pages from Sanity:
  // const properties = await client.fetch(`*[_type == "property"]{ slug, _updatedAt }`);
  // const propertyPages = properties.map(p => ({
  //   url: `${SITE_URL}/portfolio/${p.slug.current}`,
  //   lastModified: new Date(p._updatedAt),
  //   changeFrequency: "monthly",
  //   priority: 0.7,
  // }));

  return [...staticPages];
}
