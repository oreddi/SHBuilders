const { Client } = require('pg');

const regions = [
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-eu-west-2.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-ap-southeast-2.pooler.supabase.com',
  'aws-0-ap-northeast-1.pooler.supabase.com',
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-sa-east-1.pooler.supabase.com'
];

async function checkRegions() {
  const password = "Mp9gOi3X4YHfwTXh";
  for (const region of regions) {
    const connectionString = `postgresql://postgres.urtqpnnlbutqzoggxpgg:${password}@${region}:5432/postgres`;
    const client = new Client({ connectionString, connectionTimeoutMillis: 3000 });
    
    try {
      await client.connect();
      console.log(`✅ SUCCESS on ${region}!`);
      await client.end();
      return;
    } catch (err) {
      if (err.message.includes('password authentication failed')) {
        console.log(`⚠️ Password failed on ${region} (but tenant was found!)`);
      } else if (!err.message.includes('not found')) {
        console.log(`❌ ${region}: ${err.message}`);
      }
    }
  }
  console.log("Finished checking all regions.");
}

checkRegions();
