'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// 記事の型定義
interface Article {
  id: number;
  title: string;
  summary: string; // 一覧では概要のみ表示
  date: string;
  url?: string;
  tags: string[];
}

// 記事一覧で表示するためのデータ
const articlesForList: Article[] = [
  { 
    id: 3, 
    title: "Silver Fox APTによる企業・金融セクターへの標的攻撃(ValleyRAT)",
    summary: "偽のソフトウェアアップデートを装い、強力なバックドア「ValleyRAT」を用いて企業や金融セクターを狙う中国系APTグループ「Silver Fox」の活動を解説します。",
    date: "2025-07-09",
    tags: ["#脅威インテリジェンス", "#CTI"]
  },
  { 
    id: 2, 
    title: "中国の脅威アクターUAT-6382による米国重要インフラへの侵入(Trimble Cityworks、CVE-2025-0994)",
    summary: "資産管理ソフトウェアのゼロデイ脆弱性を悪用し、米国の重要インフラに侵入する脅威アクター「UAT-6382」の攻撃キャンペーンを分析します。",
    date: "2025-07-09",
    tags: ["#脅威インテリジェンス", "#CTI"]
  },
  { 
    id: 1, 
    title: "chatGPTを用いて２週間でCISSPに合格してみた", 
    summary: "情報セキュリティの国際的な認定資格であるCISSPに、ChatGPTを最大限活用して短期間で合格した際の学習戦略や具体的なプロンプトについて解説しています。この記事はQiitaで公開しています。",
    date: "2025-07-09", 
    url: "https://qiita.com/no_kijin23721/items/ee3b8687d5944dfbc4a2",
    tags: ["#CISSP", "#学習"] 
  }
];

// HTMLをそのまま描画するコンポーネント
const VulnerableHTMLRenderer = ({ htmlString }: { htmlString: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

// 記事カードのコンポーネント
const ArticleCard = ({ article }: { article: Article }) => {
  const cardContent = (
    <>
      <h2 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">
        <VulnerableHTMLRenderer htmlString={article.title} />
      </h2>
      <p className="text-gray-700 mb-2 text-sm line-clamp-2">
         {article.summary}
      </p>
      <p className="text-xs text-gray-500 mb-2">公開日: {article.date}</p>
      <div>
        {article.tags.map(tag => (
          <span key={tag} className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-2 mb-1">
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  if (article.url) {
    return (
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block p-4 border rounded-md shadow-sm hover:shadow-lg hover:border-blue-500 transition-all group"
      >
        {cardContent}
      </a>
    );
  } else {
    // リンク先を静的なパスに変更
    return (
      <Link 
        href={`/articles/${article.id}`} 
        className="block p-4 border rounded-md shadow-sm hover:shadow-lg hover:border-blue-500 transition-all group"
      >
        {cardContent}
      </Link>
    );
  }
};

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const uniqueTags = useMemo(() => {
    const allTags = articlesForList.flatMap(article => article.tags);
    return [...new Set(allTags)];
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      setFilteredArticles(articlesForList);
      setTimeout(() => setIsLoading(false), 100);
      return;
    }

    const searchedArticles = articlesForList
      .map(article => {
        let score = 0;
        const normalizedQuery = query.startsWith('#') ? query.slice(1) : query;
        if (article.title.toLowerCase().includes(query)) score += 3;
        if (article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) score += 2;
        if (article.summary.toLowerCase().includes(query)) score += 1; // 検索対象は概要文
        return { ...article, score };
      })
      .filter(article => article.score > 0)
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return b.id - a.id;
      });

    setFilteredArticles(searchedArticles);
    setTimeout(() => setIsLoading(false), 100);
  }, [searchQuery]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
      
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="キーワードや #タグ で検索..."
          className="w-full max-w-lg p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-600 self-center">タグ:</span>
          {uniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">検索中...</p>
      ) : (
        <div className="space-y-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
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
