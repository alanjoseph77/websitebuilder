/**
 * IndexNow Submission Script
 * Notifies Bing instantly when URLs are added, updated, or removed.
 * 
 * Usage:
 *   node scripts/indexnow.js                    # Submit the homepage
 *   node scripts/indexnow.js /page1 /page2      # Submit specific paths
 */

const https = require('https');

const CONFIG = {
  host: 'studio.otaga.in',
  key: 'a4e37b1c24e4845b0a7f0e3d8c9f12567',
  keyLocation: 'https://studio.otaga.in/a4e37b1c24e4845b0a7f0e3d8c9f12567.txt',
  searchEngine: 'api.indexnow.org',
};

function submitUrls(paths = ['/']) {
  const urlList = paths.map(p => `https://${CONFIG.host}${p}`);

  const payload = JSON.stringify({
    host: CONFIG.host,
    key: CONFIG.key,
    keyLocation: CONFIG.keyLocation,
    urlList: urlList,
  });

  const options = {
    hostname: CONFIG.searchEngine,
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const status = res.statusCode;
        if (status === 200 || status === 202) {
          console.log(`✅ IndexNow: Successfully submitted ${urlList.length} URL(s)`);
          urlList.forEach(u => console.log(`   → ${u}`));
          console.log(`   Status: ${status}`);
          resolve({ status, body });
        } else {
          console.error(`❌ IndexNow: Submission failed with status ${status}`);
          console.error(`   Response: ${body}`);
          reject(new Error(`IndexNow returned status ${status}: ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ IndexNow: Network error - ${err.message}`);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

// CLI execution
const args = process.argv.slice(2);
const paths = args.length > 0 ? args : ['/'];

console.log('🔔 IndexNow: Submitting URLs to Bing...\n');
submitUrls(paths)
  .then(() => console.log('\n✨ Done!'))
  .catch(() => process.exit(1));
