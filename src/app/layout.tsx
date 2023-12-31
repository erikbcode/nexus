import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '../components/Providers';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Nexus',
  description: 'Where Conversations Start',
};

export default function RootLayout({ children, authModal }: { children: React.ReactNode; authModal: React.ReactNode }) {
  return (
    <html lang="en" className={cn('text-slate-900 antialiased', inter.className)} suppressHydrationWarning={true}>
      <body className="min-h-screen antialiased">
        <Providers>
          <Navbar />
          {authModal}
          <div className="container max-w-full mx-auto h-full pt-12">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
