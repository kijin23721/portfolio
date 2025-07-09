import { initialArticles } from '../data';
import { notFound } from 'next/navigation';

// ===== ここから追加 =====
// ビルド時に静的生成するページのパスをNext.jsに教えます。
// これにより、内部記事のページだけがビルド対象になります。
export async function generateStaticParams() {
  // 内部記事（urlプロパティがないもの）のIDだけを抽出して返す
  return initialArticles
    .filter(article => !article.url)
    .map((article) => ({
      id: article.id.toString(),
    }));
}
// ===== ここまで =====

// コンポーネントのPropsの型を明示的に定義します
type Props = {
  params: { id: string };
};

export default function ArticleDetailPage({ params }: Props) {
  const article = initialArticles.find(p => p.id === Number(params.id));

  // 記事が見つからない場合、または外部リンクの場合は404ページを表示します
  if (!article || article.url) {
    notFound();
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
