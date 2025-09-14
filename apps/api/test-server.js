// Simple test script to verify the server works
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Health endpoint working correctly!');
      process.exit(0);
    } else {
      console.log('❌ Health endpoint failed');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Server not running or connection failed:', err.message);
  console.log('💡 Make sure to run: pnpm run dev');
  process.exit(1);
});

req.end();
