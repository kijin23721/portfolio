// src/app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">はじめに</h1>
      <p className="mb-2">
        こんにちは！no_kijin23721です。
      </p>
      <p className="mb-2">
        このサイトは、私の活動や成果物をまとめたポートフォリオです。
        セキュリティエンジニアおよびセキュリティコンサルタントを目指し、日々学習と研究に取り組んでいます。
      </p>
      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-3">スキルセット</h2>
        <ul className="list-disc list-inside">
          <li>Webアプリケーションセキュリティ</li>
          <li>ネットワークセキュリティ</li>
          <li>脅威インテリジェンス</li>
          {/* その他スキル */}
        </ul>
      </section>
      {/* その他、自己紹介や目標などを記述 */}
    </div>
  );
}