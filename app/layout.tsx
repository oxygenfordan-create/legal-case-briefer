import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Case Briefer',
  description: 'Instantly parse and digest heavy legal cases into a clean brief.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
