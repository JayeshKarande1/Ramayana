import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TempleParticles from '@/components/TempleParticles';
import CinematicIntro from '@/components/CinematicIntro';

export const metadata: Metadata = {
  title: "Valmiki Ramayana — Complete Sanskrit Epic with Meanings & Exploration",
  description: "Read the complete Valmiki Ramayana online: 21,640+ Sanskrit shlokas across 7 Kandas with word-by-word meanings, 194 personalities, interactive 14-year journey map, and 108 names pradakshina.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#07050d] text-[#f3f0e6] antialiased relative">
        <TempleParticles />
        <CinematicIntro />
        <Header />
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
