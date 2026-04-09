const https = require('https');
const { URL } = require('url');

function requestJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'GET', headers: { 'User-Agent': 'OpenClaw/BDJobsSkill' } }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ statusCode: res.statusCode, body: JSON.parse(body) }); }
        catch { resolve({ statusCode: res.statusCode, body }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const jobId = process.argv.find(v => v.startsWith('--jobId='))?.split('=')[1];
  if (!jobId) throw new Error('Missing --jobId=');
  const url = new URL('https://gateway.bdjobs.com/jobapply/api/JobSubsystem/Job-Details');
  url.searchParams.set('jobId', String(jobId));
  const res = await requestJson(url.toString());
  console.log(JSON.stringify(res.body?.data?.[0] || null, null, 2));
})().catch(err => {
  console.error(err.stack || String(err));
  process.exit(1);
});
