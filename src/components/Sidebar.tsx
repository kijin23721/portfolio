// src/components/Sidebar.tsx
const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-2">プロフィール</h2>
      <p className="text-sm mb-4">
        セキュリティエンジニアやセキュリティコンサルを目指す大学院修士１年です。
        CISSPアソシエイト、サイバー予備自衛官（一等陸曹）です。
        産業用制御システムセキュリティを研究中。仙台の制御システムセキュリティセンターとの共同研究。
      </p>
      <h3 className="font-semibold mb-1">Links</h3>
      <ul className="text-sm">
        <li><a href="https://x.com/no_kijin23721" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter</a></li>
        <li><a href="https://qiita.com/no_kijin23721" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Qiita</a></li>
        <li><a href="https://note.com/no_kijin23721" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Note</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;