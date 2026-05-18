import { NextResponse } from 'next/server';
import https from 'https';

const BOX_LINK = 'https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/136585239866';

const AVAILABLE_IMAGES = [
  "/images/PherinWoodExteriors.jpg",
  "/images/IsabelWayWOutside (1).jpg",
  "/images/Wildwood Ave.jpg",
  "/images/Alydar Loop inside.jpg",
  "/images/WildwoodAveraInside.jpg",
  "/images/PersimmonDr.jpg",
  "/images/RidgeField PI Exteriors.jpg",
  "/images/JOHNSONRDW.jpg",
  "/images/IsabelWay.jpg",
  "/images/WildWoodAveraInside2.jpg",
  "/images/8095Vane Ct,Theodore.jpg",
  "/images/PersimmonDrKitchen.jpg",
  "/images/8095Vane,Inside.jpg",
  "/images/8095VaneInside.jpg"
];

function fetchFromBox(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (boxRes) => {
      let data = '';
      boxRes.on('data', (chunk) => { data += chunk; });
      boxRes.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

export async function GET() {
  try {
    const data = await fetchFromBox(BOX_LINK);
    const regex = /Box\.postStreamData = (\{.*?\});/s;
    const match = data.match(regex);

    if (match && match[1]) {
      const payload = JSON.parse(match[1]);
      const items = payload['/app-api/enduserapp/shared-folder']?.items || [];

      let imageIndex = 0;
      const projects = items.filter(item => item.type === 'folder').map(folder => {
        const img = AVAILABLE_IMAGES[imageIndex % AVAILABLE_IMAGES.length];
        imageIndex++;
        return {
          id: folder.id,
          name: folder.name,
          img: img,
          cat: "Custom Home"
        };
      });

      return NextResponse.json(projects);
    } else {
      return NextResponse.json({ error: 'Could not find Box data payload' }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching from Box', details: err.message }, { status: 500 });
  }
}
