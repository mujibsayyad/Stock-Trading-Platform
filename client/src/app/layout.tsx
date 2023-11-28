import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { Providers } from '@/lib/providers';
import ThemeRegistry from './components/ThemeRegistry';
import Navbar from './components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Trading Platform',
  description: 'Real Time Stock Trading Platform',
  openGraph: {
    authors: 'Mujib Sayyad',
    title: 'Stock Trading Platform',
    description: 'Indian NSE Stock Trading Platform',
    url: 'https://stock-platform.vercel.app',
    images: [
      {
        url: 'https://res.cloudinary.com/dcvbqthie/image/upload/v1701194279/STP_meta.png',
        width: 600,
        height: 600,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang='en'>
        <body className={inter.className}>
          <Navbar />
          <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
          <Analytics />
        </body>
      </html>
    </Providers>
  );
}
