import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash, randomBytes } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const articles = [
  { slug: 'insurance-loyalty-penalty', title: 'The UK Insurance Loyalty Penalty: What Changed and What Didn\'t', excerpt: 'The FCA banned price walking in 2022, but millions are still overpaying. Here\'s what happened and what hasn\'t changed.', date: '2 Jul 2026', readTime: 4, template: 'insurance-loyalty-penalty' },
  { slug: 'car-insurance-auto-renewal', title: 'The £560m Car Insurance Auto-Renewal Tax', excerpt: '47% of UK drivers don\'t check before renewing. The average overpayment is £82 a year. Here\'s where that money goes.', date: '30 Jun 2026', readTime: 3, template: 'car-insurance-auto-renewal' },
  { slug: 'broadband-out-of-contract', title: 'Out-of-Contract Pricing: Broadband\'s Quietest Leak', excerpt: 'Your broadband doubled and you didn\'t notice. Out-of-contract pricing is costing UK households hundreds a year.', date: '28 Jun 2026', readTime: 4, template: 'broadband-out-of-contract' },
  { slug: 'forgotten-subscriptions', title: 'The £1.6bn Subscription Trap', excerpt: 'Unwanted subscriptions cost UK consumers £1.6 billion a year. Not because they\'re expensive — because they\'re forgotten.', date: '25 Jun 2026', readTime: 3, template: 'forgotten-subscriptions' },
  { slug: 'domain-renewal-lapses', title: 'Domain Renewal Lapses: The Most Preventable Financial Loss', excerpt: 'A forgotten domain renewal can cost ten times the original price to fix. Here\'s why it happens and how to stop it.', date: '23 Jun 2026', readTime: 3, template: 'domain-renewal-lapses' },
];

const pages = ['problem', 'how-it-works', 'comparison', 'proof', 'pricing', 'uses', 'waitlist', 'privacy', 'brand', 'dashboard', 'blog'];

app.get('/', (_, res) => res.render('index', { currentPage: 'index' }));
pages.forEach(p => {
  app.get(`/${p}`, (_, res) => {
    if (p === 'blog') return res.render('blog', { currentPage: 'blog', articles });
    res.render(p, { currentPage: p });
  });
});

articles.forEach(a => {
  app.get(`/blog/${a.slug}`, (_, res) => res.render('article', { currentPage: 'blog', article: a }));
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

function getWaitlist(){
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

app.use((_, res) => res.status(404).render('index', { currentPage: 'index' }));

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`perch. running at http://localhost:${PORT}`));
}
