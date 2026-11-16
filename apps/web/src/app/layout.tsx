import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/layout/sidebar';
import { Header } from '../components/layout/header';

export const metadata: Metadata = {
  title: 'DevForge — Autonomous AI Engineering Platform',
  description: 'From repository to release-ready code with continuous human-in-the-loop governance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-slate-100 antialiased flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-8 bg-[#090a0f]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
