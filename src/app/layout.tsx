import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
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
          {/* ===== ここを修正 ===== */}
          {/* モバイルでは縦積み(flex-col)、mdサイズ以上で横並び(md:flex-row)に変更 */}
          <div className="flex flex-col md:flex-row flex-1 container mx-auto mt-4">
          {/* ===== ここまで ===== */}
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
