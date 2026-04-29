import https from 'https';

const BOX_LINK = 'https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/136585239866';

const DEFAULT_IMAGE = "/images/Wildwood Ave.jpg";

export const handler = async (event) => {
  return new Promise((resolve) => {
    https.get(BOX_LINK, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const regex = /Box\.postStreamData = (\{.*?\});/s;
          const match = data.match(regex);
          
          if (match && match[1]) {
            const payload = JSON.parse(match[1]);
            const items = payload['/app-api/enduserapp/shared-folder']?.items || [];
            
            const projects = items.filter(item => item.type === 'folder').map(folder => {
              return {
                name: folder.name,
                img: DEFAULT_IMAGE, // Update this logic if you host images in S3
                cat: "Custom Home"
              };
            });

            resolve({
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin": "*", // Allow React to fetch this
                "Content-Type": "application/json"
              },
              body: JSON.stringify(projects)
            });
          } else {
            resolve({ statusCode: 500, body: JSON.stringify({ error: "Data not found" }) });
          }
        } catch (err) {
          resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
        }
      });
    }).on('error', (err) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
    });
  });
};
