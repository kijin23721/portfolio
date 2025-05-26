// src/app/articles/page.tsx
// 仮のデータ（後でDBから取得するように変更）
const articles = [
  { id: 1, title: "自宅サーバ構築記 #ネットワーク", summary: "自宅にUbuntuサーバを立ててみた話。", date: "2024-01-15", tags: ["#ネットワーク"], url: "https://qiita.com/your_user/items/xxxx" },
  { id: 2, title: "脅威インテリジェンスの基礎 #脅威インテリジェンス", summary: "CTIの基本概念と活用方法について。", date: "2024-02-01", tags: ["#脅威インテリジェンス", "#セキュリティ"] },
  // 意図的なXSS脆弱性を含んだ記事データ（後で診断用）
  { id: 3, title: "XSSテスト記事 <script>alert('XSS on title!')</script>", summary: "これはXSSのテスト用概要です。<img src=x onerror=alert('XSS_in_summary') />", date: "2024-02-10", tags: ["#テスト"] }
];

// 意図的にXSSを発生させるためのコンポーネント（後で堅牢化する対象）
const VulnerableHTMLRenderer = ({ htmlString }: { htmlString: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export default function ArticlesPage() {
  // TODO: タグフィルター機能
  // TODO: 時系列ソート

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
      {/* TODO: タグフィルターボタン */}
      <div className="space-y-6">
        {articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((article) => (
          <div key={article.id} className="p-4 border rounded-md shadow-sm">
            <h2 className="text-xl font-semibold mb-1">
              {/* タイトルにもXSS脆弱性を作り込む */}
              <VulnerableHTMLRenderer htmlString={article.title} />
            </h2>
            {article.url ? (
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
                外部リンク
              </a>
            ) : (
              <span className="text-gray-500 text-sm mb-2 inline-block">内部記事</span>
            )}
            {/* 概要にもXSS脆弱性を作り込む */}
            <div className="text-gray-700 mb-2 text-sm">
               <VulnerableHTMLRenderer htmlString={article.summary} />
            </div>
            <p className="text-xs text-gray-500 mb-2">公開日: {article.date}</p>
            <div>
              {article.tags.map(tag => (
                <span key={tag} className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-2 mb-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}