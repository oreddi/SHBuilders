const https = require('https');

function testBoxPagination(page) {
  const url = `https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a?page=${page}`;
  
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/Box\.postStreamData = (\{.*?\});/s);
      if (match) {
        const payload = JSON.parse(match[1]);
        const items = payload['/app-api/enduserapp/shared-folder']?.items || [];
        console.log(`Page ${page} - Items found:`, items.length);
      }
    });
  });
}

testBoxPagination(1);
testBoxPagination(2);
testBoxPagination(3);
testBoxPagination(4);
