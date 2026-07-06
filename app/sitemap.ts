import type { MetadataRoute } from 'next';
import { articles } from '@/lib/articles';

const SITE = 'https://perch.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  const primary = ['', 'problem', 'how-it-works', 'comparison', 'proof', 'pricing', 'uses', 'demo', 'app', 'waitlist', 'features', 'dashboard', 'calculator', 'penalty-map', 'community'];
  const secondary = ['privacy', 'brand', 'blog', 'changelog', 'roadmap', 'about', 'terms', 'contact', 'download', 'resources', 'digest', 'stats', 'tool'];
  return [
    ...primary.map((u) => ({ url: `${SITE}/${u}`, lastModified: new Date(now), changeFrequency: 'weekly' as const, priority: 0.9 })),
    ...secondary.map((u) => ({ url: `${SITE}/${u}`, lastModified: new Date(now), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${SITE}/blog/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
