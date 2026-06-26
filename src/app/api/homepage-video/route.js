import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export async function GET() {
  try {
    const query = groq`*[_type == "homepageVideo"][0]{
      title,
      "videoUrl": video.asset->url
    }`;
    const videoData = await client.fetch(query);
    return NextResponse.json(videoData);
  } catch (error) {
    console.error("Error fetching homepage video:", error);
    return NextResponse.json({ error: "Failed to fetch homepage video" }, { status: 500 });
  }
}
