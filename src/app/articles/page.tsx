'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { initialArticles, Article } from './data'; 

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
         {article.content}
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
    const allTags = initialArticles.flatMap(article => article.tags);
    return [...new Set(allTags)];
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      // ===== ここを修正 =====
      // デフォルトの表示順を、日付ではなくIDの降順（大きいものが上）に変更
      const sortedArticles = [...initialArticles].sort((a, b) => b.id - a.id);
      setFilteredArticles(sortedArticles);
      setTimeout(() => setIsLoading(false), 100);
      return;
    }

    const searchedArticles = initialArticles
      .map(article => {
        let score = 0;
        const normalizedQuery = query.startsWith('#') ? query.slice(1) : query;
        if (article.title.toLowerCase().includes(query)) score += 3;
        if (article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) score += 2;
        if (article.content.toLowerCase().includes(query)) score += 1;
        return { ...article, score };
      })
      .filter(article => article.score > 0)
      .sort((a, b) => {
        // ===== ここを修正 =====
        // 検索結果のソート順を、スコアが同じ場合はIDの降順に変更
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
