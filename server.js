import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const rateLimitMap = new Map();
const RATE_WINDOW = 60000;
const RATE_MAX = 10;

function rateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  // Relaxed CSP for fonts, analytics-none
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'");
  next();
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use(securityHeaders);
app.use((_, res, next) => { pageViews++; next(); });
process.on('SIGINT', savePageViews);
process.on('SIGTERM', savePageViews);
app.use(express.static(join(__dirname, 'public'), { maxAge: '7d', immutable: true }));
app.get('/api/views', (_, res) => res.json({ ok: true, views: pageViews }));
app.use('/downloads', express.static(join(__dirname, 'public/downloads'), { maxAge: '1h' }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

const dataDir = process.env.VERCEL ? '/tmp/data' : join(__dirname, 'data');

const articles = [
  { slug: 'july-renewal-season', title: 'why july is the worst month for auto-renewals', excerpt: 'july is peak renewal season for everything from car insurance to gym memberships. here\'s why and what to watch for.', date: '4 Jul 2026', readTime: 4, template: 'july-renewal-season' },
  { slug: 'insurance-loyalty-penalty', title: 'the uk insurance loyalty penalty: what changed and what didn\'t', excerpt: 'the fca banned price walking in 2022, but millions are still overpaying. here\'s what happened and what hasn\'t changed.', date: '2 Jul 2026', readTime: 4, template: 'insurance-loyalty-penalty' },
  { slug: 'car-insurance-auto-renewal', title: 'the £560m car insurance auto-renewal tax', excerpt: '47% of uk drivers don\'t check before renewing. the average overpayment is £82 a year. here\'s where that money goes.', date: '30 Jun 2026', readTime: 3, template: 'car-insurance-auto-renewal' },
  { slug: 'broadband-out-of-contract', title: 'out-of-contract pricing: broadband\'s quietest leak', excerpt: 'your broadband doubled and you didn\'t notice. out-of-contract pricing is costing uk households hundreds a year.', date: '28 Jun 2026', readTime: 4, template: 'broadband-out-of-contract' },
  { slug: 'forgotten-subscriptions', title: 'the £1.6bn subscription trap', excerpt: 'unwanted subscriptions cost uk consumers £1.6 billion a year. not because they\'re expensive — because they\'re forgotten.', date: '25 Jun 2026', readTime: 3, template: 'forgotten-subscriptions' },
  { slug: 'domain-renewal-lapses', title: 'domain renewal lapses: the most preventable financial loss', excerpt: 'a forgotten domain renewal can cost ten times the original price to fix. here\'s why it happens and how to stop it.', date: '23 Jun 2026', readTime: 3, template: 'domain-renewal-lapses' },
];

const pages = ['problem', 'how-it-works', 'comparison', 'proof', 'pricing', 'uses', 'waitlist', 'privacy', 'brand', 'dashboard', 'blog', 'demo', 'tool', 'changelog', 'roadmap', 'about', 'terms', 'contact', 'download', 'features', 'resources'];

app.get('/', (_, res) => res.render('index', { currentPage: 'index' }));
app.get('/get-access', (_, res) => res.redirect(301, '/waitlist'));
app.get('/digest', (_, res) => res.render('digest', { currentPage: 'digest' }));
app.get('/health', (_, res) => res.json({ status: 'ok', uptime: process.uptime() }));
pages.forEach(p => {
  app.get(`/${p}`, (_, res) => {
    if (p === 'blog') return res.render('blog', { currentPage: 'blog', articles });
    res.render(p, { currentPage: p });
  });
});

app.get('/stats', (_, res) => {
  const s = getWaitlistStats();
  res.render('stats', { currentPage: 'stats', stats: s });
});

app.get('/robots.txt', (_, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://perch.vercel.app/sitemap.xml');
});

app.get('/sitemap.xml', (_, res) => {
  const primary = ['','problem','how-it-works','comparison','proof','pricing','uses','demo','download','tool','waitlist','features','dashboard'];
  const secondary = ['privacy','brand','blog','changelog','roadmap','about','terms','contact','digest','stats','dashboard','resources'];
  const blogUrls = articles.map(a => `blog/${a.slug}`);
  const all = [...primary.map(u => ({url:u,priority:'0.9',changefreq:'weekly'})),
    ...secondary.map(u => ({url:u,priority:'0.6',changefreq:'monthly'})),
    ...blogUrls.map(u => ({url:u,priority:'0.7',changefreq:'monthly'}))
  ];
  const now = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${all.map(u => `<url><loc>https://perch.vercel.app/${u.url}</loc><lastmod>${now}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n  ')}
</urlset>`;
  res.type('application/xml').send(xml);
});

app.get('/blog/feed.xml', (_, res) => {
  const items = articles.map(a => `
    <entry>
      <title>${a.title}</title>
      <link>https://perch.vercel.app/blog/${a.slug}</link>
      <id>https://perch.vercel.app/blog/${a.slug}</id>
      <updated>${new Date(a.date).toISOString()}</updated>
      <summary>${a.excerpt}</summary>
    </entry>`).join('\n');

  res.set('Content-Type', 'application/atom+xml');
  res.send(`<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>perch. blog</title>
      <link href="https://perch.vercel.app/blog" />
      <id>https://perch.vercel.app/blog</id>
      <updated>${new Date().toISOString()}</updated>
      ${items}
    </feed>`);
});

articles.forEach(a => {
  app.get(`/blog/${a.slug}`, (_, res) => res.render('article', { currentPage: 'blog', article: a, articles }));
});

let pageViews = 0;

function ensureDataDir(){
  try { if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true }); } catch(_) {}
  try {
    const pvFile = join(dataDir, 'pageviews.txt');
    if (existsSync(pvFile)) pageViews = parseInt(readFileSync(pvFile, 'utf-8').trim(), 10) || 0;
  } catch(_) {}
}

function savePageViews(){
  try {
    writeFileSync(join(dataDir, 'pageviews.txt'), String(pageViews));
  } catch(_) {}
}

ensureDataDir();

function getWaitlist(){
  ensureDataDir();
  const file = join(dataDir, 'waitlist.jsonl');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf-8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
}

function getReferrals(){
  const file = join(dataDir, 'referrals.jsonl');
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf-8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
}

function referralCode(email){
  return createHash('md5').update(email + 'perch2026').digest('hex').slice(0, 8);
}

app.post('/api/waitlist', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (!rateLimit(ip)) return res.status(429).json({ ok: false, error: 'too many requests — slow down' });

  const { name, email, segment, estimated_exposure } = req.body;
  if (!name || !email) return res.status(400).json({ ok: false, error: 'name and email required' });

  const existing = getWaitlist().find(e => e.email === email);
  if (existing) return res.json({ ok: true, existing: true });

  const entry = { name, email, segment, estimated_exposure: estimated_exposure || null, ref: referralCode(email), at: new Date().toISOString() };
  const file = join(dataDir, 'waitlist.jsonl');

  try {
    writeFileSync(file, JSON.stringify(entry) + '\n', { flag: 'a' });
    console.log('Waitlist signup:', entry.email);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save waitlist entry:', err);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

app.get('/api/waitlist/status', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ ok: false, error: 'email required' });

  const list = getWaitlist();
  const idx = list.findIndex(e => e.email === email);
  if (idx === -1) return res.json({ ok: true, found: false });

  const entry = list[idx];
  const referrals = getReferrals().filter(r => r.referee === email).length;
  const position = idx + 1;
  const total = list.length;
  const estimatedAccess = position <= Math.ceil(total * 0.2)
    ? 'Within the next 2 weeks'
    : position <= Math.ceil(total * 0.5)
      ? 'Within the next month'
      : 'Within the next 6–8 weeks';

  res.json({
    ok: true, found: true,
    position, total,
    estimatedAccess,
    referralCode: entry.ref,
    referralCount: referrals,
    name: entry.name,
    segment: entry.segment
  });
});

function getWaitlistStats(){
  const list = getWaitlist();
  const refs = getReferrals();
  const total = list.length;
  const households = list.filter(e => e.segment === 'household').length;
  const businesses = list.filter(e => e.segment === 'business').length;
  const totalRefs = refs.length;
  const today = new Date().toISOString().slice(0,10);
  const todaySignups = list.filter(e => e.at && e.at.slice(0,10) === today).length;

  const byDate = {};
  list.forEach(e => {
    if (!e.at) return;
    const d = e.at.slice(0,10);
    byDate[d] = (byDate[d] || 0) + 1;
  });
  const signupsByDay = Object.entries(byDate).sort((a,b) => a[0].localeCompare(b[0])).slice(-30).map(([date,count]) => ({date,count}));

  const avg = total > 0 ? Math.round(totalRefs / total * 10) / 10 : 0;

  return { total, households, businesses, totalRefs, todaySignups, avgReferralsPerPerson:avg, signupsByDay };
}

app.get('/api/waitlist/stats', (_, res) => {
  res.json({ ok:true, ...getWaitlistStats() });
});

app.get('/api/waitlist/count', (_, res) => {
  const list = getWaitlist();
  res.json({ ok: true, count: list.length });
});

app.post('/api/waitlist/referral', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ ok: false, error: 'email required' });

  const list = getWaitlist();
  const exists = list.find(e => e.email === email);
  if (!exists) return res.status(404).json({ ok: false, error: 'not found' });

  const file = join(dataDir, 'referrals.jsonl');
  const entry = { referee: email, at: new Date().toISOString() };

  try {
    writeFileSync(file, JSON.stringify(entry) + '\n', { flag: 'a' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

app.use((_, res) => res.status(404).render('404', { currentPage: '404' }));

app.use((err, _, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).type('html').send(`
    <!DOCTYPE html><html lang="en-GB"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>error — perch.</title><style>body{background:#0a0e0d;color:#edefed;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:20px;}
    h1{font-family:Georgia,serif;font-size:48px;color:#c98a3a;margin-bottom:8px;}p{color:#a3aba7;max-width:400px;line-height:1.6;}
    a{color:#c98a3a;text-decoration:underline;}</style></head><body><div>
    <h1>something went wrong</h1><p>we've been notified. in the meantime, <a href="/">go back home</a> or <a href="/contact">let us know</a> what happened.</p>
    </div></body></html>
  `);
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`perch. running at http://localhost:${PORT}`));
}
