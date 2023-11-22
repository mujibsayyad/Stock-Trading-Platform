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
