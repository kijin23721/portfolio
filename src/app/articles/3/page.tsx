// MarkdownをHTMLに変換する簡易パーサー
function parseMarkdown(markdown: string): string {
  let html = markdown.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-6 rounded-lg shadow-md mx-auto" />');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 border-l-4 border-blue-500 pl-4">$1</h2>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-red-600 font-mono px-1 rounded-sm">$1</code>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-6"><code>$1</code></pre>');
  html = html.replace(/\n/g, '<br />');
  html = html.replace(/<h2(.*?)<br \/>/g, '<h2$1').replace(/<pre(.*?)<br \/>/g, '<pre$1');
  return html;
}

// 記事データ
const article = {
  id: 3, 
  title: "Silver Fox APTによる企業・金融セクターへの標的攻撃(ValleyRAT)",
  date: "2025-07-09",
  tags: ["#脅威インテリジェンス", "#CTI"],
  content: `## はじめに\n\n「Silver Fox」またの名を「峡谷巨盗 (Xiágǔ Jùdào)」――その名の通り、谷に潜む巨大な盗賊のように、企業や金融セクターから機密情報を狙う中国系のAPT(Advanced Persistent Threat)グループの活動が活発化している。\n\n彼らの主な武器は「ValleyRAT」と呼ばれる強力なバックドア型マルウェアだ。正規のソフトウェアアップデートを装って標的を騙し、システムに深く静かに侵入する。\n\n本稿では、CVPやCheck Pointのレポートに加え、特に中国のセキュリティ企業「火绒安全(Huorong Security)」による詳細な技術分析を基に、このSilver Fox APTの狡猾な手口と、その背後にある地政学的な思惑を掘り下げていく。\n\n## 攻撃キャンペーン：偽のアップデートが招く破滅\n\nSilver Foxの攻撃は、ユーザーの心理的な隙を突く古典的かつ効果的な手口から始まる。\n\n1.  **初期アクセス**: 攻撃者は、Google ChromeやTelegramといった有名ソフトウェアの偽のアップデート通知を装ったフィッシングサイトや、SEOポイズニングを駆使して悪意のあるインストーラーをダウンロードさせる。\n2.  **インストーラーの実行**: ユーザーが偽のインストーラーを実行すると、表面的には正規のインストールプロセスが進行しているように見える。しかし、その裏では多段階のプロセスを経て、最終ペイロードであるValleyRATが展開される。\n\nこの手口の巧妙な点は、ユーザーに何も異常を気づかせないまま、マルウェアの感染を完了させてしまうことにある。\n\n## マルウェア「ValleyRAT」の技術的深層\n\nValleyRAT (別名: Winos) の真の恐ろしさは、その洗練された検知回避技術と強力なスパイ機能にある。ここでは、中国のセキュリティ企業「火绒安全」のレポートを参考に、その核心に迫る。\n\n### 「白加黑」- 正規を装うDLLサイドローディング\n\n火绒安全のレポートでは、ValleyRATの検知回避技術を「**白加黑 (bái jiā hēi)**」と表現している。これは「白（正規のファイル）」に「黒（悪意のあるコード）」を組み合わせる、典型的なDLLサイドローディング手法を指す中国のセキュリティ業界用語だ。\n\n具体的には、ValleyRATは以下のような多重の「白加黑」構造を利用する。\n\n1.  正規のインストーラー（例: Sandboxie）に、悪意のあるDLLを同梱させる。\n2.  正規の実行ファイルがロードされる際に、この悪意のあるDLLが読み込まれる（サイドローディング）。\n3.  このDLLは、さらに別の暗号化されたマルウェア本体をメモリ上に展開し、実行する。\n\nこれにより、多くのセキュリティ製品の静的スキャンや振る舞い検知をすり抜けることが可能になる。\n\n### BYOVD: セキュリティソフトの無力化\n\nValleyRATのもう一つの特徴的な技術が「BYOVD (Bring Your Own Vulnerable Driver)」だ。これは、デジタル署名済みの正規だが脆弱性を持つドライバを意図的にシステムにロードし、その脆弱性を悪用してOSのカーネルレベルで特権昇格を行う攻撃手法である。\n\n火绒安全の分析によれば、ValleyRATはこの手法を用いて、標的のPCにインストールされている**ほぼ全ての主要なアンチウイルスソフトやセキュリティ製品のプロセスを強制終了**させていた。まさに防御システムを根こそぎ無力化する、極めて攻撃的な手法だ。レポート内で「**对抗安全软件 (duìkàng ānquán ruǎnjiàn - 対セキュリティソフトウェア)**」と表現されるこの機能が、彼らの活動の持続性を支えている。\n\n### ValleyRATの機能\n\n無力化されたシステム上で、ValleyRATは以下のようなスパイ活動を行う。\n\n- キー入力の記録（キーロガー）\n- デスクトップのスクリーンショット撮影\n- マイクによる音声の録音\n- ファイルのアップロード／ダウンロード\n- リモートからのコマンド実行\n\nこれにより、攻撃者は標的の機密情報（財務データ、顧客情報、技術情報など）を意のままに窃取することが可能になる。\n\n## 地政学的背景：経済スパイと台湾への圧力\n\nSilver Fox APTの別名「峡谷巨盗」は、彼らの主な動機が経済的利益、すなわち産業スパイであることを示唆している。中国の国家戦略に沿って、外国企業の技術や金融情報を盗み出し、自国の経済的優位性を高めることが目的と考えられる。\n\nしかし、注目すべきは、Check Pointの調査で彼らの標的に台湾の組織が含まれていることが判明している点だ。これは、単なる経済スパイ活動に留まらず、台湾に対する政治的・軍事的な圧力の一環として、サイバー攻撃が利用されている可能性を示している。台湾のインフラや重要企業を標的にすることは、台湾社会の不安定化を狙う「認知戦」の一翼を担っているとも考えられるだろう。\n\n## まとめ\n\nSilver Fox APTとValleyRATは、偽のアップデートというありふれた入口から侵入し、「白加黑」やBYOVDといった高度な技術を駆使してシステムの奥深くまで潜伏する、非常に洗練された脅威だ。\n\n彼らの活動は、中国の国家的な思惑と連動した経済スパイ活動であり、時には台湾への政治的圧力という地政学的な側面も持つ。我々が日常的に利用するソフトウェアのアップデート通知一つにも、このような国際的な諜報戦の罠が潜んでいる可能性がある。\n\nソフトウェアは必ず公式サイトからダウンロードし、安易にインストーラーを実行しないという基本的なセキュリティ対策の徹底が、この「巨大な盗賊」から身を守るための第一歩となる。`,
  sources: [
      { title: '火绒安全: “Winos”木马新变种：携带多个“白加黑”模块对抗安全软件', url: 'https://www.huorong.cn/document/tech/vir_report/1831' },
      { title: 'CVP: Silver Fox APT Targets Global Orgs with Fake Chrome Updates to Deliver ValleyRAT', url: 'https://www.cvpcorp.com/cyber-blog/cyber-threat-awareness-report-february-14-2025' },
      { title: 'GBHackers on Security: Silver Fox APT Targets Global Orgs with Fake Chrome Updates to Deliver ValleyRAT', url: 'https://gbhackers.com/silver-fox-apt/' },
      { title: 'Check Point Research: ValleyRAT: A Look into a Sophisticated Malware Used by Chinese-Speaking Threat Actors', url: 'https://research.checkpoint.com/2023/valleyrat-a-look-into-a-sophisticated-malware-used-by-chinese-speaking-threat-actors/' },
      { title: 'The Hacker News: Chinese Hackers Using New ValleyRAT Malware in Global Espionage Campaign', url: 'https://thehackernews.com/2023/08/chinese-hackers-using-new-valleyrat.html' },
      { title: 'BleepingComputer: Hackers push new ValleyRAT malware via fake software installers', url: 'https://www.bleepingcomputer.com/news/security/hackers-push-new-valleyrat-malware-via-fake-software-installers/' },
      { title: 'Voice of America (Chinese): 报告：中文恶意软件增加或挑战俄网络犯罪主导地位', url: 'https://www.voachinese.com/a/report-increase-in-chinese-language-malware-may-challenge-russian-dominance-of-cybercrime-20230920/7277013.html' }
  ]
};

export default function Article3Page() {
  const parsedContent = parseMarkdown(article.content);

  return (
    <article className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
      <div className="prose lg:prose-xl max-w-none">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{article.title}</h1>
        <div className="mb-8 text-gray-500 flex items-center flex-wrap">
          <span className="mr-4">公開日: {article.date}</span>
          <div className="flex gap-2 flex-wrap">
            {article.tags.map(tag => (
              <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{tag}</span>
            ))}
          </div>
        </div>
        <div className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: parsedContent }} />
        {article.sources && (
          <section className="mt-12 pt-6 border-t">
            <h2 className="text-2xl font-bold mb-4">参考文献・ソース</h2>
            <ul className="list-disc pl-5 space-y-2">
              {article.sources.map((source, index) => (
                <li key={index}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{source.title}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
