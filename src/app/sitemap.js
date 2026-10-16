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

  // One URL per real home (duplicate photo-shoot listings are merged)
  const { getPortfolioSlugs } = await import("@/lib/content");
  const propertyPages = (await getPortfolioSlugs()).map((slug) => ({
    url: `${SITE_URL}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...propertyPages];
}
