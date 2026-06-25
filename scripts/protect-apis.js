const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'route.js') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Don't process if already contains auth
      if (content.includes("import { auth } from '@/auth'")) continue;
      
      // Add import
      content = `import { auth } from '@/auth';\n` + content;
      
      // Add auth check to functions
      content = content.replace(/export async function (GET|POST|PATCH|DELETE|PUT)\(.*?\) \{/g, match => {
        return `${match}\n  const session = await auth();\n  if (!session) return new NextResponse("Unauthorized", { status: 401 });\n`;
      });
      
      fs.writeFileSync(fullPath, content);
      console.log('Protected:', fullPath);
    }
  }
}

processDir(path.join(__dirname, '../src/app/api/pm'));
