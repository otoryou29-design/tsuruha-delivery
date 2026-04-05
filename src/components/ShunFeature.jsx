const G = "#4d8c00"
const IMG_V = "v6"

const SPRING_ITEMS = [
  {
    name: "春キャベツ",
    img: "cabbage-half.jpg",
    season: "3月〜5月",
    desc: "冬キャベツと比べて巻きがゆるく、葉が柔らかいのが特徴。水分量が多くみずみずしい甘みがあり、生食に最適です。ビタミンCはみかんとほぼ同量で、胃の粘膜を保護するビタミンU（キャベジン）も豊富。",
    nutrients: ["ビタミンC", "ビタミンU", "カロテン", "カリウム"],
    howToEat: "千切りサラダや浅漬けなど、まずは生で。炒め物にする場合はサッと火を通す程度が甘みを活かすコツです。",
  },
  {
    name: "新玉ねぎ",
    img: "shin-tamanegi.jpg",
    season: "3月〜5月",
    desc: "収穫後すぐに出荷されるため、通常の玉ねぎより水分が多く辛みが少ないのが特徴。スライスしてそのまま食べられるほどフレッシュな味わいです。血液をサラサラにする硫化アリルを豊富に含みます。",
    nutrients: ["ビタミンB1", "アリシン", "硫化アリル"],
    howToEat: "スライスしてサラダやマリネに。加熱する場合はスープがおすすめ。栄養素が溶け出した汁ごと食べられます。",
  },
  {
    name: "アスパラガス",
    img: "asparagus.jpg",
    season: "4月〜6月",
    desc: "春から初夏にかけてが旬。名前の由来でもあるアスパラギン酸は、疲労回復やスタミナ増強に効果的。穂先にはルチンが含まれ、血管を丈夫にする働きがあります。",
    nutrients: ["アスパラギン酸", "ルチン", "ビタミンA", "ビタミンC"],
    howToEat: "根元の硬い部分はピーラーで薄く皮をむいて。ベーコン巻きやバターソテーが定番。茹でてマヨネーズも絶品。",
  },
  {
    name: "ほうれん草",
    img: "spinach.jpg",
    season: "通年（春は特においしい）",
    desc: "鉄分の王様として知られる葉物野菜。春のほうれん草は冬に比べてアクが少なく、甘みがあって食べやすいのが特徴。葉酸も豊富で、女性に嬉しい栄養素がたっぷり。",
    nutrients: ["鉄分", "葉酸", "ビタミンK", "ビタミンC"],
    howToEat: "おひたしやごま和えの定番に加え、バター炒めやキッシュにも。春のほうれん草は生でサラダにしてもおいしいです。",
  },
  {
    name: "小松菜",
    img: "komatsuna.jpg",
    season: "通年（春は柔らかく甘い）",
    desc: "カルシウムの含有量はほうれん草の3倍以上。アクが少なくクセがないため、どんな料理にも合わせやすい万能野菜です。鉄分やビタミンCも豊富に含みます。",
    nutrients: ["カルシウム", "鉄分", "ビタミンC", "ビタミンA"],
    howToEat: "炒め物や味噌汁の具材に。ナムルやお浸しもおすすめ。生のままスムージーに入れると栄養を丸ごと摂れます。",
  },
  {
    name: "ブロッコリー",
    img: "broccoli.jpg",
    season: "11月〜4月",
    desc: "ビタミンCの含有量はレモンの約2倍。がん予防効果が注目されるスルフォラファンも含まれ、「野菜の王様」とも呼ばれます。茹でても栄養が残りやすいのが嬉しいポイント。",
    nutrients: ["ビタミンC", "食物繊維", "スルフォラファン", "ビタミンK"],
    howToEat: "茹ですぎは禁物。蒸し茹で2〜3分がベスト。サラダ、グラタン、パスタの具材に。茎も薄切りにして炒め物に使えます。",
  },
]

export default function ShunFeature({ onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`
        @keyframes sakuraPage { 0% { transform: translateY(-10px) rotate(0deg); opacity: 0; } 10% { opacity: .6; } 100% { transform: translateY(500px) rotate(360deg); opacity: 0; } }
      `}</style>

      {/* ヘッダー */}
      <header style={{ background: G, padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#fff", padding: "4px 8px" }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>旬を食べよう</span>
      </header>

      {/* ヒーロー（春デザイン・桜の花びら） */}
      <div style={{ position: "relative", background: "linear-gradient(180deg, #fef7f0 0%, #fdf2f8 30%, #f0fdf4 70%, #fff 100%)", padding: "52px 24px 48px", textAlign: "center", overflow: "hidden" }}>
        {/* 桜の花びら */}
        {[...Array(8)].map((_, j) => (
          <div key={j} style={{
            position: "absolute", top: -10, left: `${5 + j * 12}%`, zIndex: 1,
            width: j % 2 === 0 ? 12 : 8, height: j % 2 === 0 ? 12 : 8,
            background: `rgba(244,${160 + j * 10},${180 + j * 5},${0.35 + (j % 3) * 0.1})`,
            borderRadius: "50% 0 50% 50%",
            animation: `sakuraPage ${7 + j * 1.2}s ${j * 0.8}s linear infinite`,
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 3, marginBottom: 10 }}>SPRING 2026</div>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.2, margin: "0 0 16px" }}>旬を食べよう。</h1>
          <div style={{ width: 40, height: 3, background: G, margin: "0 auto 16px", borderRadius: 2 }} />
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>2026.04.05</div>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2, maxWidth: 420, margin: "0 auto" }}>
            春の訪れとともに、みずみずしい旬の野菜たちが<br />
            産地から届き始めました。
          </p>
        </div>
      </div>

      {/* 挨拶・導入 */}
      <section style={{ padding: "40px 20px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ background: "#fafafa", borderRadius: 16, padding: "28px 24px" }}>
          <p style={{ fontSize: 15, color: "#334155", lineHeight: 2.2, margin: 0 }}>
            いつもOTOKAWAをご利用いただきまして、ありがとうございます。
          </p>
          <p style={{ fontSize: 15, color: "#334155", lineHeight: 2.2, margin: "12px 0 0" }}>
            春は野菜がもっともおいしくなる季節。
            冬の間にじっくり蓄えた栄養と甘みを持った野菜たちが、食卓を彩ります。
            今回は、今まさに旬を迎えている春野菜をご紹介します。
          </p>
        </div>
      </section>

      {/* 春野菜の豆知識 */}
      <section style={{ padding: "0 20px 40px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ borderLeft: `4px solid ${G}`, paddingLeft: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>春野菜のチカラ</div>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2, margin: 0 }}>
            春野菜に含まれる独特のほろ苦さは「植物性アルカロイド」によるもの。
            冬の間に溜まった老廃物の排出を促すデトックス効果があり、
            新陳代謝を活発にして免疫力を高めてくれます。
          </p>
        </div>
      </section>

      {/* 目次 */}
      <section style={{ padding: "0 20px 40px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ background: "#f0fdf4", borderRadius: 14, padding: "20px 24px" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: G, marginBottom: 12 }}>この記事の内容</div>
          {SPRING_ITEMS.map((item, i) => (
            <a key={i} href={`#shun-${i}`} style={{ display: "block", fontSize: 14, color: "#334155", padding: "6px 0", textDecoration: "none", borderBottom: i < SPRING_ITEMS.length - 1 ? "1px solid #dcfce7" : "none" }}
              onClick={e => { e.preventDefault(); document.getElementById(`shun-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}>
              <span style={{ color: G, fontWeight: 800, marginRight: 8 }}>{i + 1}.</span>{item.name}<span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>{item.season}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 各野菜の詳細 */}
      <section style={{ padding: "0 20px 48px", maxWidth: 640, margin: "0 auto" }}>
        {SPRING_ITEMS.map((item, i) => (
          <article key={i} id={`shun-${i}`} style={{ marginBottom: 40 }}>
            {/* 番号+タイトル */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: G, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a1a", margin: 0 }}>{item.name}</h2>
                <div style={{ fontSize: 12, color: G, fontWeight: 700, marginTop: 2 }}>旬: {item.season}</div>
              </div>
            </div>

            {/* 画像 */}
            <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
              <img src={`/products/${item.img}?${IMG_V}`} alt={item.name} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
            </div>

            {/* 説明 */}
            <p style={{ fontSize: 15, color: "#334155", lineHeight: 2.1, marginBottom: 16 }}>{item.desc}</p>

            {/* 栄養素 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>主な栄養素</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.nutrients.map(n => (
                  <span key={n} style={{ fontSize: 12, fontWeight: 700, background: "#f0fdf4", color: G, padding: "5px 14px", borderRadius: 20, border: `1px solid ${G}25` }}>{n}</span>
                ))}
              </div>
            </div>

            {/* おすすめの食べ方 */}
            <div style={{ background: "#fafafa", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: G, marginBottom: 6 }}>おすすめの食べ方</div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.9, margin: 0 }}>{item.howToEat}</p>
            </div>

            {/* セパレーター */}
            {i < SPRING_ITEMS.length - 1 && (
              <div style={{ borderBottom: "1px solid #e5e7eb", marginTop: 40 }} />
            )}
          </article>
        ))}
      </section>

      {/* まとめ */}
      <section style={{ padding: "40px 20px 48px", maxWidth: 640, margin: "0 auto", background: "#fafafa", borderRadius: 16 }}>
        <div style={{ padding: "0 4px" }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 16 }}>まとめ</div>
          <p style={{ fontSize: 15, color: "#334155", lineHeight: 2.2 }}>
            春は野菜の甘みと栄養価が最も高まる季節です。
            旬の野菜を食べることは、おいしいだけでなく、
            身体のデトックスや免疫力アップにもつながります。
          </p>
          <p style={{ fontSize: 15, color: "#334155", lineHeight: 2.2, marginTop: 12 }}>
            音川青果では、信頼できる産地から厳選した旬の野菜を
            福島県内のツルハドラッグ各店舗にお届けしています。
            ぜひこの春、旬の味覚をお楽しみください。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: G, padding: "48px 20px", textAlign: "center", marginTop: 40 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 12 }}>旬の野菜を<br />お近くのツルハドラッグで</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.8, marginBottom: 24 }}>
            福島県内のツルハドラッグ各店舗の青果コーナーにて販売中。
          </p>
          <button onClick={onBack} style={{
            padding: "14px 32px", borderRadius: 28, background: "#fff", color: G,
            fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "inherit",
          }}>ホームに戻る</button>
        </div>
      </section>

      <div style={{ height: 60 }} />
    </div>
  )
}
