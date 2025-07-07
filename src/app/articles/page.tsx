'use client';

import { useState, useEffect, useMemo } from 'react';

// Articleのデータ型を定義します
interface Article {
  id: number;
  title: string;
  summary: string;
  date: string;
  url?: string;
  tags: string[];
}

const initialArticles: Article[] = [
  { 
    id: 1, 
    title: "自宅サーバ構築記", 
    summary: "自宅にUbuntuサーバを立ててみた話。", 
    date: "2024-01-15", 
    url: "http://kijin23721.duckdns.org/",
    tags: ["#ネットワーク", "#サーバ構築"] 
  },
  { 
    id: 2, 
    title: "脅威インテリジェンスの基礎", 
    summary: "CTIの基本概念と活用方法について。", 
    date: "2024-02-10",
    tags: ["#脅威インテリジェンス", "#CTI"]
  },
  { 
    id: 3, 
    title: "XSSテスト記事 (Title)", 
    summary: "これはXSSのテスト用概要です。<img src='x' onerror='// この部分は後でテストします' alt='test image'>", 
    date: "2024-03-01",
    tags: ["#XSS", "#脆弱性"]
  },
];

// HTMLをそのまま描画するコンポーネント
const VulnerableHTMLRenderer = ({ htmlString }: { htmlString: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};


export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ===== ここから追加 =====
  // useMemoを使って、記事データからユニークなタグのリストを一度だけ生成します
  const uniqueTags = useMemo(() => {
    const allTags = initialArticles.flatMap(article => article.tags);
    // Setを使って重複を削除し、配列に戻します
    return [...new Set(allTags)];
  }, []);
  // ===== ここまで追加 =====

  useEffect(() => {
    setIsLoading(true);
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      const sortedArticles = [...initialArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setFilteredArticles(sortedArticles);
      setTimeout(() => setIsLoading(false), 200);
      return;
    }

    const searchedArticles = initialArticles
      .map(article => {
        let score = 0;
        const normalizedQuery = query.startsWith('#') ? query.slice(1) : query;

        if (article.title.toLowerCase().includes(query)) score += 3;
        if (article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) score += 2;
        if (article.summary.toLowerCase().includes(query)) score += 1;
        
        return { ...article, score };
      })
      .filter(article => article.score > 0)
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    setFilteredArticles(searchedArticles);
    setTimeout(() => setIsLoading(false), 200);

  }, [searchQuery]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
      
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        {/* 検索ボックス */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="キーワードや #タグ で検索..."
          className="w-full max-w-lg p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ===== ここから追加 ===== */}
        {/* タグ一覧を表示するエリア */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-600 self-center">タグ:</span>
          {uniqueTags.map(tag => (
            <button
              key={tag}
              // ボタンをクリックしたら、そのタグ名を検索クエリに設定する
              onClick={() => setSearchQuery(tag)}
              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
        {/* ===== ここまで追加 ===== */}
      </div>

      {isLoading ? (
        <p className="text-gray-500">検索中...</p>
      ) : (
        <div className="space-y-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div key={article.id} className="p-4 border rounded-md shadow-sm">
                <h2 className="text-xl font-semibold mb-1">
                  <VulnerableHTMLRenderer htmlString={article.title} />
                </h2>
                {article.url ? (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
                    外部リンク
                  </a>
                ) : (
                  <span className="text-gray-500 text-sm mb-2 inline-block">内部記事</span>
                )}
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
            ))
          ) : (
            <div>
              <p className="text-gray-600">検索結果がありませんでした。</p>
              <div className="mt-2 p-4 border-l-4 border-red-400 bg-red-50">
                <span>検索キーワード: </span>
                <span dangerouslySetInnerHTML={{ __html: searchQuery }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
