import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Source_Serif_4, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ClientFX from '@/components/ClientFX';
import ObservatoryLayer from '@/components/three/ObservatoryLayer';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-body', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

const SITE = 'https://perch.vercel.app';
const DESC = 'perch. is an ai inbox for everything that quietly auto-renews. forward an email or upload a document, get a verdict: renew, cancel, or renegotiate.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'perch. — every auto-renewal in one inbox', template: '%s — perch.' },
  description: DESC,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'perch.',
    title: 'perch.',
    description: DESC,
    url: SITE,
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
    locale: 'en_GB',
  },
  twitter: { card: 'summary_large_image', site: '@perch_app', title: 'perch.', description: DESC, images: ['/og-image.svg'] },
  icons: { icon: '/favicon.svg' },
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#080d0c' }, { media: '(prefers-color-scheme: light)', color: '#f5f2eb' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" data-theme="dark" className={`${playfair.variable} ${sourceSerif.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">skip to main content</a>
        <ObservatoryLayer />
        <Nav />
        <div className="page" id="main-content" role="main">{children}</div>
        <Footer />
        <ClientFX />
      </body>
    </html>
  );
}
