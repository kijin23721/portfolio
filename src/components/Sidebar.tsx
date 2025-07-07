import Link from 'next/link';

const Sidebar = () => {
  return (
    // ===== ここを修正 =====
    // モバイルでは幅いっぱい、mdサイズ以上で幅を固定(w-64)し、右に余白(mr-8)を追加
    <aside className="w-full md:w-64 md:mr-8 mb-8 md:mb-0">
    {/* ===== ここまで ===== */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">プロフィール</h2>
        <p className="text-sm mb-2">
          <strong>名前:</strong> no_kijin23721
        </p>
        <p className="text-sm mb-4">
          セキュリティエンジニアを目指して学習中です。
        </p>
        <h3 className="font-semibold mb-2">連絡先・リンク</h3>
        <ul className="text-sm space-y-1">
          <li>
            <a href="https://github.com/kijin23721" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://x.com/your_twitter" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              X (旧Twitter)
            </a>
          </li>
          {/* 他のリンク */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
