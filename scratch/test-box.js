const https = require('https');

function testBoxPagination() {
  const url = 'https://app.box.com/app-api/enduserapp/elements/folder?item_id=136585239866&offset=30&limit=30&shared_name=9shlu6n0hhs5qnwq4gk767x6p25uzh0a';
  
  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      try {
        const json = JSON.parse(data);
        console.log('Got items:', json.items?.length || 'No items array');
        if (json.items) {
          console.log(json.items.slice(0, 3).map(i => i.name));
        }
      } catch (e) {
        console.log('Not JSON:', data.slice(0, 500));
      }
    });
  });
}

testBoxPagination();
