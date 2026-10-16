// Server-side Sanity queries shared by pages (server-rendered) and /api routes.
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

const REVALIDATE = 300; // seconds — edits in /admin show up within 5 minutes
const FALLBACK_IMG = '/images/PherinWoodExteriors.jpg';

const fetchSanity = (query, params = {}) =>
  client.fetch(query, params, { next: { revalidate: REVALIDATE } });

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : null);

// ─────────────────────────────────────────
// Homes: one entry per real address
// ─────────────────────────────────────────
// The Box importer created one Sanity property per photo-shoot folder, so some
// homes appear 2–4 times ("… Reshoot", "… New", "… Aerials", "… October").
// We group those by address and show each home once, with all its photos.
// It also filled every property with the same placeholder details; those are
// hidden until someone enters real values in /admin.

// Not homes (import leftovers)
const HIDDEN_NAMES = [/^revisions$/i];

// Photo-shoot labels appended to folder names, not part of the address
const SHOOT_SUFFIX = /\s+(reshoot|new|october|aerials|exteriors and video|exterior)$/i;

// Placeholder values written by scripts/import-box-portfolio.js
const IMPORT_DEFAULTS = { sqft: 3500, beds: 4, baths: 3.5, year: 2025, location: 'Chattanooga, TN' };
const IMPORT_DESCRIPTION = /^A stunning custom home construction by SH Builders on /;

const isUntouchedSpecs = (s = {}) =>
  Object.entries(IMPORT_DEFAULTS).every(([key, value]) => s[key] === value);

// Only details someone actually entered; placeholder values are dropped
function realFacts(doc) {
  const untouched = isUntouchedSpecs(doc.specs || {});
  const specs = untouched ? {} : { ...(doc.specs || {}) };
  if (specs.location === IMPORT_DEFAULTS.location) delete specs.location; // the homes are not in Chattanooga
  const category = untouched && doc.category === 'transitional' ? null : doc.category || null;
  const description =
    typeof doc.description === 'string' && !IMPORT_DESCRIPTION.test(doc.description) ? doc.description : null;
  return { specs, category, description };
}

const stripShootLabels = (name) => {
  let n = name.trim();
  while (SHOOT_SUFFIX.test(n)) n = n.replace(SHOOT_SUFFIX, '').trim();
  return n;
};

// Same house number + first street word = same address ("6001 Ridgefield …")
const addressKey = (doc) => {
  const m = doc.name.match(/^(\d+)\s+([A-Za-z]+)/);
  return m ? `${m[1]}-${m[2]}`.toLowerCase() : doc.slug;
};

const imageCount = (doc) => (doc.mainImage?.asset ? 1 : 0) + (doc.gallery || []).filter((g) => g?.asset).length;

function buildHomes(docs) {
  const groups = new Map();
  for (const doc of docs) {
    if (!doc.slug || HIDDEN_NAMES.some((re) => re.test(doc.name))) continue;
    const key = addressKey(doc);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(doc);
  }

  return [...groups.values()].map((members) => {
    // Main listing (its URL is kept): one whose name has no shoot label, then one
    // with a walkthrough video, then the most photos
    const isClean = (d) => stripShootLabels(d.name) === d.name.trim();
    members.sort((a, b) =>
      isClean(b) - isClean(a) || !!b.videoUrl - !!a.videoUrl || imageCount(b) - imageCount(a) || b.name.length - a.name.length
    );
    const main = members[0];

    // Clean name: drop shoot labels; a trailing " E" only when it marks a duplicate shoot
    const names = members.map((d) => {
      const n = stripShootLabels(d.name);
      return members.length > 1 ? n.replace(/\s+E$/, '') : n;
    });
    const name = names.reduce((a, b) => (b.length > a.length ? b : a)); // prefer "Place" over "Pl"

    // An "Exteriors" / "Aerials" shoot gives the best cover; its photos lead the gallery
    const exteriorShoot = members.find((d) => /exterior|aerial/i.test(d.name) && d.mainImage?.asset);
    const photoOrder = exteriorShoot ? [exteriorShoot, ...members.filter((d) => d !== exteriorShoot)] : members;

    // All photos from every shoot, without repeats
    const seen = new Set();
    const images = [];
    for (const d of photoOrder) {
      for (const img of [d.mainImage, ...(d.gallery || [])]) {
        const ref = img?.asset?._ref;
        if (ref && !seen.has(ref)) {
          seen.add(ref);
          images.push(img);
        }
      }
    }

    const facts = realFacts(main);
    return {
      slug: main.slug,
      slugs: members.map((d) => d.slug),
      name,
      cover: (exteriorShoot || main).mainImage?.asset ? (exteriorShoot || main).mainImage : images[0] || null,
      images,
      videoUrl: members.find((d) => d.videoUrl)?.videoUrl || null,
      ...facts,
      status: main.status,
      seoTitle: main.seoTitle,
      seoDescription: main.seoDescription,
      createdAt: main._createdAt,
    };
  });
}

async function getHomes() {
  const docs = await fetchSanity(
    `*[_type == "property"] | order(_createdAt desc) {
      _id, _createdAt, name, "slug": slug.current, category, mainImage, gallery,
      description, specs, status, seoTitle, seoDescription, "videoUrl": video.asset->url
    }`
  );
  return buildHomes(docs || []);
}

const findHome = (homes, slug) => homes.find((h) => h.slugs.includes(slug));

// ─────────────────────────────────────────
// Public API used by pages and /api routes
// ─────────────────────────────────────────

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
    const homes = await getHomes();
    const featured = [];
    for (const slug of FEATURED_SLUGS) {
      const home = findHome(homes, slug);
      if (home && !featured.includes(home)) featured.push(home);
    }
    if (!featured.length) return LOCAL_FEATURED;
    return featured.map((h) => ({
      id: h.slug,
      name: h.name,
      img: h.cover ? urlFor(h.cover).width(1600).quality(80).url() : FALLBACK_IMG,
      cat: capitalize(h.category) || 'Custom Home',
    }));
  } catch (err) {
    console.error('getFeaturedProjects:', err);
    return LOCAL_FEATURED;
  }
}

export async function getPortfolio() {
  try {
    const homes = await getHomes();
    return homes.map((h) => ({
      id: h.slug,
      name: h.name,
      img: h.cover ? urlFor(h.cover).width(1200).quality(75).auto('format').url() : FALLBACK_IMG,
      cat: capitalize(h.category) || 'Custom Home',
      category: h.category, // null when no real style has been entered
      status: h.status,
      galleryCount: h.images.length,
    }));
  } catch (err) {
    console.error('getPortfolio:', err);
    return [];
  }
}

export async function getPortfolioSlugs() {
  try {
    return (await getHomes()).map((h) => h.slug);
  } catch {
    return [];
  }
}

// Returns the merged home; `canonicalSlug` differs from `slug` for duplicate shoots
export async function getProperty(slug) {
  const home = findHome(await getHomes(), slug);
  if (!home) return null;

  return {
    id: home.slug,
    canonicalSlug: home.slug,
    name: home.name,
    category: home.category,
    description: home.description,
    specs: home.specs,
    status: home.status,
    seoTitle: home.seoTitle,
    seoDescription: home.seoDescription,
    images: home.images.map((img, i) => ({
      img: urlFor(img).width(1600).quality(80).auto('format').url(),
      name: i === 0 ? home.name : `${home.name} — View ${i + 1}`,
    })),
    videoUrl: home.videoUrl,
    source: 'sanity',
  };
}

// Homes that have a walkthrough video, for the homepage video section
export async function getPropertyVideos() {
  try {
    return (await getHomes())
      .filter((h) => h.videoUrl)
      .map((h) => ({ name: h.name, slug: h.slug, url: h.videoUrl }));
  } catch (err) {
    console.error('getPropertyVideos:', err);
    return [];
  }
}

// One random walkthrough; changes each time the page is regenerated (every 5 minutes)
export async function getRandomPropertyVideo() {
  const videos = await getPropertyVideos();
  return videos.length ? videos[Math.floor(Math.random() * videos.length)] : null;
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
