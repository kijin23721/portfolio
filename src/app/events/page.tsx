// src/app/events/page.tsx
const eventsAndInterns = [
  { id: 1, name: "セキュリティ・キャンプ全国大会202X", type: "セキュリティイベント", period: "202X年8月", role: "参加者", learnings: "Webセキュリティ、フォレンジックなど幅広く学習" },
  { id: 2, name: "サイボウズ サマーインターン (仮)", type: "就活インターン", period: "202X年X月", role: "インターン生", learnings: "プロダクトセキュリティの実務体験（予定）" },
  // 他のイベントやインターンを追加
];

export default function EventsPage() {
  const securityEvents = eventsAndInterns.filter(item => item.type === "セキュリティイベント");
  const internships = eventsAndInterns.filter(item => item.type === "就活インターン");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">参加したイベント・インターン</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">セキュリティイベント</h2>
        {securityEvents.length > 0 ? (
          <ul className="space-y-4">
            {securityEvents.map(event => (
              <li key={event.id} className="p-3 border rounded-md">
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-sm text-gray-600">期間: {event.period} | 役割: {event.role}</p>
                <p className="text-sm mt-1">学んだこと: {event.learnings}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>参加したセキュリティイベントはありません。</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">就活インターン</h2>
        {internships.length > 0 ? (
          <ul className="space-y-4">
            {internships.map(intern => (
              <li key={intern.id} className="p-3 border rounded-md">
                <h3 className="font-semibold">{intern.name}</h3>
                <p className="text-sm text-gray-600">期間: {intern.period} | 役割: {intern.role}</p>
                <p className="text-sm mt-1">学んだこと: {intern.learnings}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>参加した就活インターンはありません。</p>
        )}
      </section>
    </div>
  );
}