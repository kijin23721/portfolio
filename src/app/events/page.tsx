// 経験データの型を定義
interface Experience {
  id: number;
  name: string;
  category: 'セキュリティイベント' | '就活インターン' | '参加CTF';
  period: string;
  role: string;
  learnings?: string; // CTFなどでは「学んだこと」がない場合もあるため、オプショナルにする
}

// ご指定いただいたデータで更新
const experiences: Experience[] = [
  // セキュリティイベント
  { id: 1, name: "SECCON Beginners 2024 札幌", category: "セキュリティイベント", period: "2024年9月", role: "参加者", learnings: "Crypto問題とWeb問題を扱ったCTFの演習" },
  { id: 2, name: "ひよこまめ教習所", category: "セキュリティイベント", period: "2025年5月", role: "参加者", learnings: "攻撃と堅牢化の流れ" },
  { id: 3, name: "SC4Y('25#2) Micro Hardening Basic", category: "セキュリティイベント", period: "2025年6月", role: "参加者", learnings: "3人チームでの防御計画と堅牢化" },
  // 就活インターン
  { id: 4, name: "富士通", category: "就活インターン", period: "2023年8月", role: "参加者", learnings: "Azure" },
  { id: 5, name: "Accenture", category: "就活インターン", period: "2023年9月", role: "参加者", learnings: "スクラム開発" },
  { id: 6, name: "DTCY", category: "就活インターン", period: "2023年10月", role: "参加者", learnings: "セキュリティコンサル" },
  { id: 7, name: "PwC", category: "就活インターン", period: "2023年10月", role: "参加者", learnings: "Tableau" },
  { id: 8, name: "伊藤忠サイバー&インテリジェンス", category: "就活インターン", period: "2024年2月", role: "参加者", learnings: "脅威インテリジェンス" },
  // 参加CTF
  { id: 9, name: "DIVER OSINT CTF2025", category: "参加CTF", period: "2025年6月", role: "参加者" },
  { id: 10, name: "国際研 OSINT CTF2025", category: "参加CTF", period: "2025年6月", role: "主催者" },
];

// 各セクションを描画するための再利用可能なコンポーネント
const ExperienceSection = ({ title, items }: { title: string, items: Experience[] }) => {
  if (items.length === 0) {
    return null; // アイテムがなければセクション自体を表示しない
  }
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{title}</h2>
      <ul className="space-y-4">
        {items.map(item => (
          <li key={item.id} className="p-4 border rounded-md bg-white shadow-sm">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-600">期間: {item.period} | 役割: {item.role}</p>
            {/* 「学んだこと」が存在する場合のみ表示 */}
            {item.learnings && <p className="text-sm mt-2"><strong>学んだこと:</strong> {item.learnings}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default function EventsPage() {
  // カテゴリごとにデータをフィルタリング
  const securityEvents = experiences.filter(item => item.category === "セキュリティイベント");
  const internships = experiences.filter(item => item.category === "就活インターン");
  const ctfs = experiences.filter(item => item.category === "参加CTF");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">参加したイベント・インターン・CTF</h1>
      
      {/* 各セクションをコンポーネントを使って描画 */}
      <ExperienceSection title="セキュリティイベント" items={securityEvents} />
      <ExperienceSection title="就活インターン" items={internships} />
      <ExperienceSection title="参加CTF" items={ctfs} />
    </div>
  );
}
