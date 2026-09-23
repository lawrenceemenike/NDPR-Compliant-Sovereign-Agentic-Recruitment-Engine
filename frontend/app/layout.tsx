import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AegisRecruit | Brendan Nicholas Holdings',
  description: 'NDPR-Compliant Sovereign Agentic Recruitment Engine for Brendan Nicholas Holdings Executive Board',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#D4AF37] selection:text-black">
        {children}
      </body>
    </html>
  );
}
