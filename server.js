import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

const pages = ['problem', 'how-it-works', 'proof', 'pricing', 'waitlist', 'privacy'];

app.get('/', (_, res) => res.render('index', { currentPage: 'index' }));
pages.forEach(p => {
  app.get(`/${p}`, (_, res) => res.render(p, { currentPage: p }));
});

app.post('/api/waitlist', (req, res) => {
  const { name, email, segment } = req.body;
  if (!name || !email) return res.status(400).json({ ok: false, error: 'name and email required' });

  const dir = join(__dirname, 'data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const entry = { name, email, segment, at: new Date().toISOString() };
  const file = join(dir, 'waitlist.jsonl');

  try {
    writeFileSync(file, JSON.stringify(entry) + '\n', { flag: 'a' });
    console.log('Waitlist signup:', entry);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save waitlist entry:', err);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

app.use((_, res) => res.status(404).render('index', { currentPage: 'index' }));

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`perch. running at http://localhost:${PORT}`));
}
