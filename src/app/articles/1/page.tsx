import { initialArticles } from '../data';

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = initialArticles.find(p => p.id === Number(params.id));

  // ===== ここを修正 =====
  // 記事が見つからない場合、または見つかった記事が外部リンク（urlを持つ）の場合、
  // 「見つかりません」ページを表示するようにします。
  if (!article || article.url) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">記事が見つかりません</h1>
        <p className="mt-4">指定された記事は存在しないか、内部記事ではありません。</p>
      </div>
    );
  }

  return (
    <article className="prose lg:prose-xl max-w-none">
      <h1 dangerouslySetInnerHTML={{ __html: article.title }} />
      
      <div className="mb-8 text-gray-500">
        <span>公開日: {article.date}</span>
        <div className="mt-2">
          {article.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div 
        className="whitespace-pre-wrap" 
        dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} 
      />
    </article>
  );
}
