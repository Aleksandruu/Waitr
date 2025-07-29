import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import { Providers } from './providers';
import "../App.scss";
import "../index.scss";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Waitr - Restaurant Management System',
  description: 'Modern restaurant management and ordering system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}