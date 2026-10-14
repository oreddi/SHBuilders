// Server-side Sanity queries shared by pages (server-rendered) and /api routes.
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

const REVALIDATE = 300; // seconds — edits in /admin show up within 5 minutes
const FALLBACK_IMG = '/images/PherinWoodExteriors.jpg';

const fetchSanity = (query, params = {}) =>
  client.fetch(query, params, { next: { revalidate: REVALIDATE } });

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Custom Home');

// The exact properties featured on the homepage, in display order
const FEATURED_SLUGS = [
  '23964-unbridled-loop',
  '24253-alydar-loop',
  '1011-wildwood-avenue',
  '30293-persimmon-drive',
  '6001-ridgefield-place-exteriors-and-video',
];

const LOCAL_FEATURED = [
  { id: FEATURED_SLUGS[0], name: '23964 Unbridled Loop', img: '/images/PherinWoodExteriors.jpg' },
  { id: FEATURED_SLUGS[1], name: '24253 Alydar Loop', img: '/images/Alydar Loop inside.jpg' },
  { id: FEATURED_SLUGS[2], name: '1011 Wildwood Avenue', img: '/images/JOHNSONRDW.jpg' },
  { id: FEATURED_SLUGS[3], name: '30293 Persimmon Drive', img: '/images/PersimmonDrKitchen.jpg' },
  { id: FEATURED_SLUGS[4], name: '6001 Ridgefield Place', img: '/images/RidgeField PI Exteriors.jpg' },
].map((p) => ({ ...p, cat: 'Custom Home' }));

export async function getFeaturedProjects() {
  try {
    const properties = await fetchSanity(
      `*[_type == "property" && slug.current in $slugs]{ _id, name, "slug": slug.current, category, mainImage }`,
      { slugs: FEATURED_SLUGS }
    );
    if (!properties?.length) return LOCAL_FEATURED;
    return properties
      .sort((a, b) => FEATURED_SLUGS.indexOf(a.slug) - FEATURED_SLUGS.indexOf(b.slug))
      .map((p) => ({
        id: p.slug || p._id,
        name: p.name,
        img: p.mainImage?.asset ? urlFor(p.mainImage).width(1600).quality(80).url() : FALLBACK_IMG,
        cat: capitalize(p.category),
      }));
  } catch (err) {
    console.error('getFeaturedProjects:', err);
    return LOCAL_FEATURED;
  }
}

export async function getPortfolio() {
  try {
    const properties = await fetchSanity(
      `*[_type == "property"] | order(_createdAt desc) {
        _id, name, "slug": slug.current, category, mainImage, status,
        "galleryCount": count(gallery[defined(asset)])
      }`
    );
    // Properties with gallery photos first
    return [...(properties || [])]
      .sort((a, b) => (b.galleryCount > 0) - (a.galleryCount > 0))
      .map((p) => ({
        id: p.slug || p._id,
        name: p.name,
        img: p.mainImage?.asset ? urlFor(p.mainImage).width(1200).quality(75).auto('format').url() : FALLBACK_IMG,
        cat: capitalize(p.category),
        status: p.status,
        galleryCount: p.galleryCount || 0,
      }));
  } catch (err) {
    console.error('getPortfolio:', err);
    return [];
  }
}

export async function getPortfolioSlugs() {
  try {
    return await fetchSanity(`*[_type == "property" && defined(slug.current)].slug.current`);
  } catch {
    return [];
  }
}

export async function getProperty(slug) {
  const property = await fetchSanity(
    `*[_type == "property" && (slug.current == $slug || _id == $slug)][0] {
      _id, name, "slug": slug.current, category, mainImage, description, specs, status,
      seoTitle, seoDescription, gallery, "videoUrl": video.asset->url
    }`,
    { slug }
  );
  if (!property) return null;

  const images = [];
  if (property.mainImage?.asset) {
    images.push({ img: urlFor(property.mainImage).width(1600).quality(80).auto('format').url(), name: property.name });
  }
  (property.gallery || []).forEach((g, i) => {
    if (g?.asset) {
      images.push({ img: urlFor(g).width(1600).quality(80).auto('format').url(), name: `${property.name} — View ${i + 2}` });
    }
  });

  return {
    id: property.slug || property._id,
    name: property.name,
    category: property.category,
    description: property.description,
    specs: property.specs || {},
    status: property.status,
    seoTitle: property.seoTitle,
    seoDescription: property.seoDescription,
    images,
    videoUrl: property.videoUrl || null,
    source: 'sanity',
  };
}

export async function getHeroSlides() {
  try {
    const slides = await fetchSanity(
      `*[_type == "heroSlide" && active == true] | order(order asc) { _id, title, image, order }`
    );
    return (slides || [])
      .filter((s) => s.image?.asset)
      .map((s) => ({
        id: s._id,
        title: s.title,
        imageUrl: urlFor(s.image).width(2400).height(1350).quality(80).format('webp').url(),
        order: s.order,
      }));
  } catch (err) {
    console.error('getHeroSlides:', err);
    return [];
  }
}

export async function getTestimonials() {
  try {
    return await fetchSanity(`*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(_createdAt desc)`);
  } catch (err) {
    console.error('getTestimonials:', err);
    return [];
  }
}
