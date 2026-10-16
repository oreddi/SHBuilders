import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export const revalidate = 300;

// SH Builders brand reel: 30s of exteriors and finished interiors from portfolio
// homes (no addresses on screen, no occupied homes). Shipped with the site.
const BRAND_REEL = { title: 'SH Builders', videoUrl: '/videos/sh-builders-brand-reel.mp4' };

// The original homepage video in Sanity: a 302 MB walkthrough of a home that isn't
// in the portfolio. Replace it in /admin → Homepage Video and the new one is used.
const RETIRED_VIDEO_ASSET = 'file-5983272ed092e90f50a7bd51315ab056e6b07bfd-mp4';

export async function GET() {
  try {
    const query = groq`*[_type == "homepageVideo"][0]{
      title,
      "assetId": video.asset._ref,
      "videoUrl": video.asset->url
    }`;
    const videoData = await client.fetch(query, {}, { next: { revalidate: 300 } });
    if (!videoData?.videoUrl || videoData.assetId === RETIRED_VIDEO_ASSET) {
      return NextResponse.json(BRAND_REEL);
    }
    return NextResponse.json({ title: videoData.title, videoUrl: videoData.videoUrl });
  } catch (error) {
    console.error("Error fetching homepage video:", error);
    return NextResponse.json(BRAND_REEL);
  }
}
