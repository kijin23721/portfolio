// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Tailwind CSS用
import Header from '@/components/Header'; // '@/' は src/ を指すエイリアス
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'no_kijin23721のポートフォリオ',
  description: 'セキュリティエンジニアを目指す学生のポートフォリオサイト',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-1 container mx-auto mt-4">
            <Sidebar />
            <main className="flex-1 p-4">{children}</main>
          </div>
          <footer className="bg-gray-700 text-white text-center p-4">
            © 2024 no_kijin23721
          </footer>
        </div>
      </body>
    </html>
  );
}