const G = "#4d8c00"
const IMG_V = "v6"

const VARIETIES = [
  {
    name: "大粒いちご",
    img: "ichigo.jpg",
    desc: "一粒一粒が大きく、甘みと酸味のバランスが抜群。果汁たっぷりでジューシーな食感。そのまま食べて最高の贅沢です。",
    price: "398〜498",
  },
  {
    name: "小粒いちご",
    img: "ichigo-pack.jpg",
    desc: "手軽に楽しめるパック入り。小粒でも甘さはしっかり。ご家庭のおやつやデザートにぴったりです。",
    price: "278〜333",
  },
  {
    name: "大粒いちご 箱売り",
    img: "ichigo-box-l.jpg",
    desc: "大粒いちごの箱売り。贈り物にも最適。たっぷり入ってお得です。",
    price: "1,580",
  },
  {
    name: "小粒いちご 箱売り",
    img: "ichigo-box-s.jpg",
    desc: "ご家族やお友達とシェアにぴったり。まとめ買いでお得に楽しめます。",
    price: "980",
  },
]

export default function IchigoFeature({ onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* ヘッダー */}
      <header style={{ background: G, padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#fff", padding: "4px 8px" }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>旬のいちご特集</span>
      </header>

      {/* ヒーロー */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={`/products/ichigo-box-l.jpg?${IMG_V}`} alt="福島県産いちご"
          style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.8)", letterSpacing: 3, marginBottom: 6 }}>OTOKAWA SEIKA</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>旬のいちご特集</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.85)", marginTop: 6 }}>福島県産 甘くてジューシー</div>
        </div>
      </div>

      {/* 導入セクション */}
      <section style={{ padding: "40px 20px", maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 16, lineHeight: 1.4 }}>
          福島県のいちごは、<br />甘さが違います。
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2 }}>
          福島県は冬の日照時間が長く、昼夜の寒暖差が大きいため、いちごの糖度が高くなります。
          音川青果では、信頼できる生産者から直接仕入れた新鮮ないちごを、鮮度を保ったままツルハドラッグ各店舗にお届けしています。
        </p>

      </section>

      {/* いちごギャラリー */}
      <section style={{ padding: "0 20px 40px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ gridColumn: "1 / -1", borderRadius: 14, overflow: "hidden" }}>
            <img src={`/products/ichigo-pack.jpg?${IMG_V}`} alt="とちおとめパック" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ borderRadius: 14, overflow: "hidden" }}>
            <img src={`/products/ichigo-box-s.jpg?${IMG_V}`} alt="小粒箱売り" style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ borderRadius: 14, overflow: "hidden" }}>
            <img src={`/products/ichigo.jpg?${IMG_V}`} alt="大粒いちご" style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* 品種・商品紹介 */}
      <section style={{ background: "#fef2f2", padding: "48px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", letterSpacing: 2, marginBottom: 8 }}>LINEUP</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 28 }}>取り扱い商品</h2>

          {VARIETIES.map((v, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              <img src={`/products/${v.img}?${IMG_V}`} alt={v.name} style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "20px 20px 24px" }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", marginBottom: 8 }}>{v.name}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.9, marginBottom: 12 }}>{v.desc}</p>
                {v.price && (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>税別</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: "#dc2626" }}>¥</span>
                    <span style={{ fontSize: 32, fontWeight: 900, color: "#dc2626", lineHeight: 1 }}>{v.price}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* おいしい食べ方 */}
      <section style={{ padding: "48px 20px", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 8 }}>HOW TO EAT</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1a1a1a", marginBottom: 24 }}>おいしい食べ方</h2>
        <div style={{ display: "grid", gap: 16 }}>
          {[
            { title: "そのまま食べる", desc: "ヘタを持って先端から食べると、最後まで甘さを感じられます。食べる30分前に冷蔵庫から出すのがおすすめ。", icon: "🍓" },
            { title: "練乳をつけて", desc: "お子様にも大人気。練乳の甘さといちごの酸味が絶妙にマッチします。", icon: "🥛" },
            { title: "いちごミルク", desc: "潰していちごに牛乳と砂糖を加えるだけ。簡単なのに贅沢な味わい。", icon: "🥤" },
          ].map(item => (
            <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f8fafc", borderRadius: 14, padding: "18px 16px" }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 店舗案内 */}
      <section style={{ background: G, padding: "48px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 12 }}>お近くのツルハドラッグで<br />お買い求めいただけます</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.8, marginBottom: 24 }}>
            福島県内のツルハドラッグ各店舗の青果コーナーにて販売中。<br />
            旬の時期だけの限定商品です。お早めにどうぞ。
          </p>
          <button onClick={onBack} style={{
            padding: "14px 32px", borderRadius: 28, background: "#fff", color: G,
            fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "inherit",
          }}>商品一覧に戻る</button>
        </div>
      </section>

      <div style={{ height: 60 }} />
    </div>
  )
}
