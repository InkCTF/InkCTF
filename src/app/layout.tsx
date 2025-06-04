import type { Metadata } from 'next';
import { Inter, Montserrat, Source_Code_Pro } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ink-ctf-game.vercel.app'),
  title: 'ink!CTF',
  description: 'Learn smart contract security by exploiting vulnerabilities in ink! contracts in a gamified environment.',
  keywords: 'ink!, Polkadot, smart contracts, security, CTF, capture the flag, blockchain, Rust',
  authors: [{ name: 'ink! Alliance' }],
  icons: [{ rel: 'icon', url: '/og-image.png' }],
  openGraph: {
    title: 'ink!CTF - Capture The Flag for ink! Smart Contracts',
    description: 'Learn smart contract security by exploiting vulnerabilities in ink! contracts in a gamified environment.',
    url: '/',
    siteName: 'ink!CTF',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ink!CTF - Capture The Flag for ink! Smart Contracts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ink!CTF - Capture The Flag for ink! Smart Contracts',
    description: 'Learn smart contract security by exploiting vulnerabilities in ink! contracts in a gamified environment.',
    images: ['/twitter-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${sourceCodePro.variable} ${inter.variable}`}>
      <head>
        {/* Custom font for Freude - as it's not available on Google Fonts */}
        <link rel="stylesheet" href="/fonts/freude/freude.css" />
        {/* Favicon */}
        <link rel="icon" href="/og-image.png" sizes="any" />
      </head>
      <body className="bg-gradient-to-br from-[#1a0b2e] via-[#2a1758] to-[#1a0b2e] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
