'use client'; // ハンバーガーメニューの状態管理のため 'use client' が必要

import Link from 'next/link';
import { useState } from 'react'; // メニューの開閉状態を管理するために useState をインポート

const Header = () => {
  // メニューが開いているかどうかの状態 (true: 開いている, false: 閉じている)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          no_kijin23721
        </Link>
        
        {/* PC表示用のナビゲーション (画面がmdサイズ以上の時に表示) */}
        <nav className="hidden md:flex space-x-4">
          <Link href="/articles" className="px-3 py-2 hover:text-gray-300">
            記事
          </Link>
          <Link href="/events" className="px-3 py-2 hover:text-gray-300">
            参加イベント
          </Link>
          <Link href="/board" className="px-3 py-2 hover:text-gray-300">
            掲示板
          </Link>
        </nav>

        {/* モバイル表示用のハンバーガーメニューボタン (画面がmdサイズ未満の時に表示) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {/* メニューアイコン (SVG) */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* モバイル用のメニュー (isMenuOpenがtrueの時だけ表示) */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-2">
            <Link href="/articles" className="px-3 py-2 hover:bg-gray-700 rounded" onClick={() => setIsMenuOpen(false)}>
              記事
            </Link>
            <Link href="/events" className="px-3 py-2 hover:bg-gray-700 rounded" onClick={() => setIsMenuOpen(false)}>
              参加イベント
            </Link>
            <Link href="/board" className="px-3 py-2 hover:bg-gray-700 rounded" onClick={() => setIsMenuOpen(false)}>
              掲示板
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

