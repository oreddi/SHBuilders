const https = require('https');

function testBoxPagination() {
  const url = 'https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a?page=2';
  
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      const match = data.match(/Box\.postStreamData = (\{.*?\});/s);
      if (match) {
        const payload = JSON.parse(match[1]);
        const items = payload['/app-api/enduserapp/shared-folder']?.items || [];
        console.log('Items found:', items.length);
        if (items.length > 0) {
          console.log(items.slice(0, 3).map(i => i.name));
        }
      } else {
        console.log('No postStreamData found');
      }
    });
  });
}

testBoxPagination();
