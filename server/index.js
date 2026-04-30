import express from 'express';
import cors from 'cors';
import https from 'https';

const app = express();
app.use(cors()); // Allow React to fetch data from this API

const BOX_LINK = 'https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/136585239866';

// The images currently available in the public/images folder
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

let imageIndex = 0;
function getNextImage() {
  const img = AVAILABLE_IMAGES[imageIndex];
  imageIndex = (imageIndex + 1) % AVAILABLE_IMAGES.length;
  return img;
}

app.get('/api/projects', (req, res) => {
  https.get(BOX_LINK, (boxRes) => {
    let data = '';
    boxRes.on('data', (chunk) => { data += chunk; });
    boxRes.on('end', () => {
      try {
        const regex = /Box\.postStreamData = (\{.*?\});/s;
        const match = data.match(regex);
        
        if (match && match[1]) {
          const payload = JSON.parse(match[1]);
          const items = payload['/app-api/enduserapp/shared-folder']?.items || [];
          
          imageIndex = 0; // Reset index to keep image mapping consistent
          
          const projects = items.filter(item => item.type === 'folder').map(folder => {
            return {
              id: folder.id,
              name: folder.name,
              img: getNextImage(),
              cat: "Custom Home"
            };
          });

          res.json(projects);
        } else {
          res.status(500).json({ error: 'Could not find Box data payload' });
        }
      } catch (err) {
        res.status(500).json({ error: 'Error parsing Box data', details: err.message });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Failed to fetch Box link', details: err.message });
  });
});

app.get('/api/projects/:folderId', (req, res) => {
  const folderId = req.params.folderId;
  const folderUrl = `https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/${folderId}`;

  https.get(folderUrl, (boxRes) => {
    let data = '';
    boxRes.on('data', (chunk) => { data += chunk; });
    boxRes.on('end', () => {
      try {
        const regex = /Box\.postStreamData = (\{.*?\});/s;
        const match = data.match(regex);
        
        if (match && match[1]) {
          const payload = JSON.parse(match[1]);
          const items = payload['/app-api/enduserapp/shared-folder']?.items || [];
          
          const images = items.filter(item => item.type === 'file').slice(0, 10).map(file => {
            // Using the redirect-based public download link format
            // This URL redirects to the actual image, allowing <img src> to work without complex auth
            const downloadUrl = `https://app.box.com/index.php?rm=box_download_shared_file&shared_name=9shlu6n0hhs5qnwq4gk767x6p25uzh0a&file_id=f_${file.id}`;
            return {
              id: file.id,
              name: file.name,
              img: downloadUrl
            };
          });

          res.json({ folderId, images });
        } else {
          res.status(500).json({ error: 'Could not find Box data payload in subfolder' });
        }
      } catch (err) {
        res.status(500).json({ error: 'Error parsing Box subfolder data', details: err.message });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Failed to fetch Box subfolder link', details: err.message });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API Server running perfectly on port ${PORT}`);
});
