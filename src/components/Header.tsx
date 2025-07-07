import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          no_kijin23721のポートフォリオ
        </Link>
        <nav>
          <Link href="/articles" className="px-3 hover:text-gray-300">
            記事
          </Link>
          <Link href="/events" className="px-3 hover:text-gray-300">
            参加イベント・インターン
          </Link>
          {/* ===== ここに「掲示板」へのリンクを追加します ===== */}
          <Link href="/board" className="px-3 hover:text-gray-300">
            掲示板
          </Link>
          {/* ===== ここまで ===== */}
        </nav>
      </div>
      {/* バナー画像などをここに追加しても良い */}
    </header>
  );
};

export default Header;
