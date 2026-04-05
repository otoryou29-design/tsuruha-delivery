const G = "#4d8c00"
const IMG_V = "v6"

const SPRING_ITEMS = [
  {
    name: "春キャベツ",
    img: "cabbage-half.jpg",
    season: "3月〜5月",
    desc: "葉が柔らかく、みずみずしい食感が魅力。冬キャベツに比べて甘みが強く、生食に最適です。",
    nutrients: ["ビタミンC", "ビタミンU", "カロテン"],
    howToEat: "サラダなど生食がおすすめ。ロールキャベツや浅漬けにも。",
  },
  {
    name: "新玉ねぎ",
    img: "shin-tamanegi.jpg",
    season: "3月〜5月",
    desc: "収穫後すぐに出荷されるため辛みが少なく、フレッシュな食感。水分が多くジューシーです。",
    nutrients: ["ビタミンB1", "アリシン", "硫化アリル"],
    howToEat: "スライスして生食やマリネ。スープにすると栄養を逃しません。",
  },
  {
    name: "アスパラガス",
    img: "asparagus.jpg",
    season: "4月〜6月",
    desc: "旨味とコクが強く、食感が柔らか。疲労回復に効果的なアスパラギン酸を豊富に含みます。",
    nutrients: ["アスパラギン酸", "ルチン", "ビタミンA"],
    howToEat: "ベーコン巻きやソテー。茹でてサラダにも。",
  },
  {
    name: "ほうれん草",
    img: "spinach.jpg",
    season: "通年（春もおいしい）",
    desc: "鉄分が豊富で栄養価の高い葉物野菜。春のほうれん草はアクが少なく食べやすいのが特徴。",
    nutrients: ["鉄分", "葉酸", "ビタミンK"],
    howToEat: "おひたし、ごま和え、炒め物。バター炒めが絶品。",
  },
  {
    name: "小松菜",
    img: "komatsuna.jpg",
    season: "通年（春は特に柔らか）",
    desc: "カルシウムはほうれん草の3倍以上。クセがなく、どんな料理にも合わせやすい万能野菜です。",
    nutrients: ["カルシウム", "鉄分", "ビタミンC"],
    howToEat: "炒め物、味噌汁、ナムル。生でスムージーにも。",
  },
  {
    name: "ブロッコリー",
    img: "broccoli.jpg",
    season: "11月〜4月",
    desc: "ビタミンCはレモンの2倍。茹でても栄養が残りやすく、食べ応えのある緑黄色野菜です。",
    nutrients: ["ビタミンC", "食物繊維", "スルフォラファン"],
    howToEat: "蒸し茹でがベスト。サラダ、グラタン、炒め物。",
  },
]

export default function ShunFeature({ onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* ヘッダー */}
      <header style={{ background: G, padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#fff", padding: "4px 8px" }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>旬を食べよう</span>
      </header>

      {/* ヒーロー（春らしいパステル） */}
      <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 40%, #fff 100%)", padding: "48px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* 桜の花びら装飾 */}
        <div style={{ position: "absolute", top: 20, right: 30, width: 60, height: 60, borderRadius: "50%", background: "rgba(251,191,191,.3)" }} />
        <div style={{ position: "absolute", top: 80, left: 20, width: 30, height: 30, borderRadius: "50%", background: "rgba(251,191,191,.2)" }} />
        <div style={{ position: "absolute", bottom: 40, right: 60, width: 20, height: 20, borderRadius: "50%", background: "rgba(167,243,208,.4)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 3, marginBottom: 12 }}>SPRING 2026</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.3, margin: "0 0 12px" }}>旬を食べよう。</h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, maxWidth: 400, margin: "0 auto" }}>
            春の訪れとともに、みずみずしい旬の野菜が届きます。<br />
            今が一番おいしい食材をご紹介します。
          </p>
        </div>
      </div>

      {/* 春野菜の特徴 */}
      <section style={{ padding: "40px 20px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ background: "#f0fdf4", borderRadius: 16, padding: "24px 20px", borderLeft: `4px solid ${G}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: G, marginBottom: 8 }}>春野菜のチカラ</div>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.9, margin: 0 }}>
            春野菜には、冬の間に溜まった老廃物を排出するデトックス効果があります。
            独特のほろ苦さは植物性アルカロイドによるもので、新陳代謝を促し、免疫力を高めてくれます。
          </p>
        </div>
      </section>

      {/* 旬の野菜カタログ */}
      <section style={{ padding: "0 20px 48px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 8 }}>SPRING VEGETABLES</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 28 }}>今が旬の野菜</h2>

        {SPRING_ITEMS.map((item, i) => (
          <div key={i} style={{ marginBottom: 24, background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
            {/* 画像 */}
            <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
              <img src={`/products/${item.img}?${IMG_V}`} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 12, left: 12, background: G, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 6 }}>
                旬 {item.season}
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              {/* 名前 */}
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", margin: "0 0 8px" }}>{item.name}</h3>

              {/* 説明 */}
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9, marginBottom: 16 }}>{item.desc}</p>

              {/* 栄養素 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {item.nutrients.map(n => (
                  <span key={n} style={{ fontSize: 11, fontWeight: 700, background: "#f0fdf4", color: G, padding: "4px 12px", borderRadius: 20, border: `1px solid ${G}30` }}>{n}</span>
                ))}
              </div>

              {/* 食べ方 */}
              <div style={{ background: "#fafafa", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: G, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 2 }}>おすすめの食べ方</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{item.howToEat}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 店舗案内 */}
      <section style={{ background: G, padding: "48px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 12 }}>旬の野菜を<br />お近くのツルハドラッグで</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.8, marginBottom: 24 }}>
            福島県内のツルハドラッグ各店舗の青果コーナーにて販売中。<br />
            新鮮な旬の野菜を、毎日お届けしています。
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
