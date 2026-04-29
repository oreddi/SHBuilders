import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOX_LINK = 'https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/136585239866';

// Map of known project folders to available images. 
// If the boss uploads a new folder without a specific image, it falls back to a generic one.
const IMAGE_MAP = {
  "23964 Unbridled Loop": "/images/Wildwood Ave.jpg",
  "24253 Alydar Loop": "/images/Alydar Loop inside.jpg",
  "1011 Wildwood Ave": "/images/WildwoodAveraInside.jpg",
  "30293 Persimmon Dr": "/images/PersimmonDr.jpg",
  "6001 Ridgefield Pl": "/images/RidgeField PI Exteriors.jpg",
  "3000 Johnson Rd W": "/images/JOHNSONRDW.jpg",
  "1633 Phillips Lane": "/images/IsabelWay.jpg",
  "7823 Murray Heights": "/images/WildWoodAveraInside2.jpg",
  "8543 Three Dean Way": "/images/PherinWoodExteriors.jpg",
  "3821 Isabel Way W": "/images/IsabelWayWOutside (1).jpg",
  "31488 Buckingham Blvd": "/images/8095Vane Ct,Theodore.jpg",
  "6275 Bell Creek Ct E": "/images/PersimmonDrKitchen.jpg",
  "9010 Eastwood Dr": "/images/8095Vane,Inside.jpg",
  "205 Park Ave": "/images/8095VaneInside.jpg",
  "6567 Addison Woods": "/images/Wildwood Ave.jpg",
};

const AVAILABLE_IMAGES = [
  "/images/Wildwood Ave.jpg",
  "/images/Alydar Loop inside.jpg",
  "/images/WildwoodAveraInside.jpg",
  "/images/PersimmonDr.jpg",
  "/images/RidgeField PI Exteriors.jpg",
  "/images/JOHNSONRDW.jpg",
  "/images/IsabelWay.jpg",
  "/images/WildWoodAveraInside2.jpg",
  "/images/PherinWoodExteriors.jpg",
  "/images/IsabelWayWOutside (1).jpg",
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
        
        // Reset index so it's consistent
        imageIndex = 0;
        
        const projects = items.filter(item => item.type === 'folder').map(folder => {
          return {
            name: folder.name,
            img: IMAGE_MAP[folder.name] || getNextImage(),
            cat: "Custom Home"
          };
        });

        if (projects.length > 0) {
          const fileContent = `export const PROJECTS = ${JSON.stringify(projects, null, 2)};`;
          fs.writeFileSync(path.join(__dirname, '../src/data/projects.js'), fileContent);
          console.log(`Successfully synced ${projects.length} projects from Box!`);
        } else {
          console.log("No folders found in the Box link.");
        }
      } else {
        console.log("Could not find Box data payload in the HTML.");
      }
    } catch (err) {
      console.error("Error parsing Box data:", err);
    }
  });
}).on('error', (err) => {
  console.error("Failed to fetch Box link:", err);
});
