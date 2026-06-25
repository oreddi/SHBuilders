import { NextResponse } from 'next/server';
import https from 'https';

function fetchFromBox(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (boxRes) => {
      let data = '';
      boxRes.on('data', (chunk) => { data += chunk; });
      boxRes.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

export async function GET(request, { params }) {
  const { id: folderId } = await params;
  const folderUrl = `https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/${folderId}`;

  try {
    const data = await fetchFromBox(folderUrl);
    const regex = /Box\.postStreamData = (\{.*?\});/s;
    const match = data.match(regex);

    if (match && match[1]) {
      const payload = JSON.parse(match[1]);
      const items = payload['/app-api/enduserapp/shared-folder']?.items || [];

      const images = items.filter(item => item.type === 'file').slice(0, 10).map(file => {
        const downloadUrl = `https://app.box.com/index.php?rm=box_download_shared_file&shared_name=9shlu6n0hhs5qnwq4gk767x6p25uzh0a&file_id=f_${file.id}`;
        return {
          id: file.id,
          name: file.name,
          img: downloadUrl
        };
      });

      return NextResponse.json({ folderId, images });
    } else {
      return NextResponse.json({ error: 'Could not find Box data payload in subfolder' }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching from Box subfolder', details: err.message }, { status: 500 });
  }
}
