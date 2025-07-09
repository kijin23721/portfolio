const Sidebar = () => {
  return (
    <aside className="w-full md:w-64 md:mr-8 mb-8 md:mb-0">
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">プロフィール</h2>
        <p className="text-sm mb-2">
          <strong>名前:</strong> no_kijin23721
        </p>
        {/* ===== ここを修正 ===== */}
        <p className="text-sm mb-4">
          北大文B4→情理新M1 / 学部での研究：満洲国対蒙政策と工作 / 大学院での研究：産業用制御システムセキュリティ×データ駆動型セキュリティ / CISSP(準会員) / サイバー予備自(一曹)
        </p>
        <h3 className="font-semibold mb-2">連絡先・リンク</h3>
        <ul className="text-sm space-y-1">
          <li>
            <a href="https://github.com/kijin23721" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              GitHub
            </a>
          </li>
          <li>
            {/* XのURLを修正 */}
            <a href="https://x.com/no_kijin23721" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
