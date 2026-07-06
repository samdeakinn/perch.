import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'perch.',
    short_name: 'perch.',
    description: 'an ai inbox for everything that quietly auto-renews.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080d0c',
    theme_color: '#080d0c',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
