import { useState, useEffect, useRef } from "react"
import { onValue, ref, db, set } from "../firebase"

// 商品名→画像ファイルマップ
// ★ 部分一致バグ防止: 長い名前を必ず先に配置
// 例: 「フリルレタス」→「レタス」の順、「たまねぎ」→「ねぎ」の順
const IMAGE_MAP = [
  // --- 複合名（先に判定が必要） ---
  [["フリルレタス"], "frill-lettuce2.jpg"],
  [["サニーレタス"], "sunny-lettuce.jpg"],
  [["グリーンリーフ"], "green-leaf.jpg"],
  [["ミニトマト", "アイコ"], "mini-tomato.jpg"],
  [["房取りトマト"], "fusadori-tomato.jpg"],
  [["新玉ねぎ", "新たまねぎ"], "shin-tamanegi.jpg"],
  [["玉ねぎ", "たまねぎ"], "onion2.jpg"],
  [["長ねぎ", "土ネギ", "長ネギ"], "negi.jpg"],
  [["長ナス", "長なす"], "naga-nasu.jpg"],
  [["なす袋", "なす3P", "なす 3P", "ナス3P"], "nasu3.jpg"],
  [["長いも", "長芋", "土長芋"], "nagaimo.jpg"],
  [["さつまいも", "サツマイモ", "べにはるか"], "satsumaimo.jpg"],
  [["じゃがいも", "ジャガイモ"], "potato.jpg"],
  [["とうもろこし", "コーン"], "corn.jpg"],
  [["レッドキャベツ", "紫キャベツ"], "red-cabbage.jpg"],
  [["キャベツ 1/2", "キャベツ1/2", "キャベツカット"], "cabbage-half.jpg"],
  [["つるむらさき"], "tsurumura.jpg"],
  [["モロヘイヤ"], "moroheiya.jpg"],
  // --- 一般名（後に判定） ---
  [["レタス"], "lettuce.jpg"],
  [["キャベツ"], "cabbage.jpg"],
  [["トマト"], "tomato.jpg"],
  [["ねぎ", "ネギ"], "negi.jpg"],
  [["なす", "ナス"], "nasu.jpg"],
  [["いも"], "potato.jpg"],
  // --- 葉物 ---
  [["水菜"], "mizuna.jpg"],
  [["小松菜"], "komatsuna.jpg"],
  [["ほうれん草"], "spinach.jpg"],
  [["青梗菜", "チンゲン"], "chingensai.jpg"],
  [["ブロッコリー"], "broccoli.jpg"],
  [["にら"], "nira.jpg"],
  [["春菊"], "shungiku.jpg"],
  [["大葉", "しそ"], "ooba.jpg"],
  [["セロリ"], "celery.jpg"],
  [["せり"], "seri.jpg"],
  [["枝豆", "えだまめ"], "edamame.jpg"],
  [["アスパラガス", "アスパラ"], "asparagus.jpg"],
  // --- 果菜 ---
  [["きゅうり"], "cucumber.jpg"],
  [["ピーマン"], "piman.jpg"],
  // --- 薬味 ---
  [["生姜", "しょうが", "ショウガ"], "ginger.jpg"],
  [["ニンニク", "にんにく"], "garlic.jpg"],
  [["ゆず", "柚子"], "yuzu.jpg"],
  [["レモン"], "yuzu.jpg"],
  // --- きのこ ---
  [["しいたけ"], "shiitake.jpg"],
  [["なめこ"], "nameko.jpg"],
  [["えのき"], "enoki.jpg"],
  [["しめじ"], "shimeji.jpg"],
  [["まいたけ"], "maitake.jpg"],
  // --- 根菜 ---
  [["大根"], "daikon.jpg"],
  [["ごぼう"], "gobo.jpg"],
  [["人参", "にんじん"], "carrot.jpg"],
  // --- 土もの ---
  [["白菜"], "hakusai.jpg"],
  // --- 果物 ---
  [["キウイ"], "kiwi.jpg"],
  [["パイナップル", "パイン"], "pineapple.jpg"],
  [["デコポン"], "dekopon.jpg"],
  [["不知火", "しらぬい"], "shiranui.jpg"],
  [["伊予柑", "いよかん"], "iyokan.jpg"],
  [["八朔", "はっさく"], "hassaku.jpg"],
  [["甘夏", "あまなつ"], "amanatsu.jpg"],
  [["日向夏", "こなつ", "小夏"], "hyuganatsu.jpg"],
  [["サンフルーツ"], "sun-fruits.jpg"],
  [["みかん", "ミカン"], "mikan.jpg"],
  [["いちご箱売りS", "いちご小粒箱", "苺箱S"], "ichigo-box-s.jpg"],
  [["いちごM", "いちご小粒", "苺M"], "ichigo-pack.jpg"],
  [["いちご箱売り", "いちご箱", "苺箱"], "ichigo-box-l.jpg"],
  [["いちご大粒", "いちご大"], "ichigo.jpg"],
  [["いちご", "イチゴ", "苺"], "ichigo.jpg"],
  [["バナナ"], "banana.jpg"],
  [["りんご", "サンふじ", "サンフジ", "ふじ"], "apple.jpg"],
]

const IMG_VERSION = "v6"
function getProductImage(name) {
  for (const [keys, file] of IMAGE_MAP) {
    if (keys.some(k => name.includes(k))) return `/products/${file}?${IMG_VERSION}`
  }
  return null
}

const CAT_COLORS = {
  葉物: { bg: "#dcfce7", tx: "#166534", icon: "🥬" },
  果菜: { bg: "#fee2e2", tx: "#991b1b", icon: "🍅" },
  薬味: { bg: "#fef9c3", tx: "#854d0e", icon: "🧄" },
  カット: { bg: "#dbeafe", tx: "#1e40af", icon: "🔪" },
  きのこ: { bg: "#ede9fe", tx: "#5b21b6", icon: "🍄" },
  根菜: { bg: "#ffedd5", tx: "#9a3412", icon: "🥕" },
  土もの: { bg: "#f5f0e8", tx: "#78350f", icon: "🥔" },
  果物: { bg: "#fce7f3", tx: "#9d174d", icon: "🍎" },
}

const G = "#4a7c59"

// ブランドカラー（鮮やかな緑）
const BG = "#4d8c00"
const LOGO_URL = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0663-lCbdMnM7y4KISTs8XZ0nH6vY73RvmP.jpg"

// 緑バナースライド（FRESH SALE / おいしいランキング）
const GREEN_SLIDES = [
  {
    title: "FRESH\nSALE",
    sub: "お買い得が満載",
    products: ["ichigo-pack.jpg", "cucumber.jpg", "cabbage-half.jpg", "piman.jpg"],
    cta: "セールを見る →",
    tab: "sale",
  },
]

// 下段カード（3列）→ メインナビゲーション
const NAV_CARDS = [
  { img: "komatsuna.jpg", title: "定番野菜", sub: "レギュラー商品", tab: "regular" },
  { img: "tomato.jpg", title: "FRESH SALE", sub: "お買い得商品", tab: "sale" },
  { img: "ichigo.jpg", title: "近日販売予定", sub: "オトクな商品", tab: "event" },
]

export default function ProductsPage({ tokubaiItems, onBack, onNavigate, isHome, showNewsBanner }) {
  const [tab, setTab] = useState(null) // null=トップ | "regular" | "sale" | "event"
  const [products, setProducts] = useState([])
  const [eventProducts, setEventProducts] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [likes, setLikes] = useState({})
  const [likedItems, setLikedItems] = useState({})
  const [wants, setWants] = useState({})
  const [wantedItems, setWantedItems] = useState({})
  const [reviews, setReviews] = useState({})
  const [reviewText, setReviewText] = useState("")
  const [reviewName, setReviewName] = useState("")
  const [bannerIdx, setBannerIdx] = useState(0)
  const [filterCat, setFilterCat] = useState(null)
  const [rankingData, setRankingData] = useState([])

  useEffect(() => {
    const unsub = onValue(ref(db, "products"), (snap) => {
      const val = snap.val()
      if (!val) return
      const arr = Array.isArray(val) ? val : Object.values(val)
      setProducts(arr.filter(p => p && p.name))
    })
    return () => unsub()
  }, [])

  // 売れ筋ランキング読み込み
  useEffect(() => {
    const unsub = onValue(ref(db, "salesRanking/ranking"), (snap) => {
      const val = snap.val()
      if (val) setRankingData(Array.isArray(val) ? val : Object.values(val))
    })
    return () => unsub()
  }, [])

  // 催事データ読み込み
  useEffect(() => {
    const unsub = onValue(ref(db, "eventProducts"), (snap) => {
      const val = snap.val()
      if (!val) return
      const arr = Array.isArray(val) ? val : Object.values(val)
      setEventProducts(arr.filter(p => p && p.name))
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const unsub = onValue(ref(db, "productLikes"), (snap) => setLikes(snap.val() || {}))
    return () => unsub()
  }, [])

  useEffect(() => {
    const unsub = onValue(ref(db, "productWants"), (snap) => setWants(snap.val() || {}))
    return () => unsub()
  }, [])

  useEffect(() => {
    const unsub = onValue(ref(db, "productReviews"), (snap) => setReviews(snap.val() || {}))
    return () => unsub()
  }, [])

  // いちごバナー表示判定（FRESH SALEに「いちご」があれば追加）
  const hasIchigo = tokubaiItems.some(it => it.name && (it.name.includes("いちご") || it.name.includes("イチゴ")))

  // スライド構成
  const allSlides = [
    ...GREEN_SLIDES.map(s => ({ ...s, type: "green" })),
    { type: "shun", tab: "regular" },
    ...(hasIchigo ? [{ type: "ichigo", tab: "sale" }] : []),
  ]

  // バナー自動切替（ゆっくり）+ スワイプ
  useEffect(() => {
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % allSlides.length), 8000)
    return () => clearInterval(timer)
  }, [allSlides.length])

  const [touchStart, setTouchStart] = useState(null)
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      setBannerIdx(i => diff > 0 ? (i + 1) % allSlides.length : (i - 1 + allSlides.length) % allSlides.length)
    }
    setTouchStart(null)
  }

  const handleLike = async (itemKey) => {
    if (likedItems[itemKey]) return
    const current = likes[itemKey] || 0
    await set(ref(db, `productLikes/${itemKey}`), current + 1)
    setLikedItems(prev => ({ ...prev, [itemKey]: true }))
  }

  const handleWant = async (itemKey) => {
    if (wantedItems[itemKey]) return
    const current = wants[itemKey] || 0
    await set(ref(db, `productWants/${itemKey}`), current + 1)
    setWantedItems(prev => ({ ...prev, [itemKey]: true }))
  }

  const handleReview = async (itemKey) => {
    if (!reviewText.trim()) return
    const existing = reviews[itemKey] || []
    const arr = Array.isArray(existing) ? existing : Object.values(existing)
    await set(ref(db, `productReviews/${itemKey}/${arr.length}`), {
      name: reviewName.trim() || "匿名",
      text: reviewText.trim(),
      at: Date.now(),
    })
    setReviewText("")
    setReviewName("")
  }

  const isRegular = tab === "regular"
  const isEvent = tab === "event"
  let items = isRegular ? products : isEvent ? eventProducts : tokubaiItems
  if (isRegular && filterCat) items = items.filter(p => p.cat === filterCat)

  const categories = [...new Set(products.map(p => p.cat).filter(Boolean))]

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bannerFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* ヘッダー */}
      <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
        {!isHome && <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#333", padding: "4px 8px" }}>←</button>}
        {isHome ? (
          <>
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0663-lCbdMnM7y4KISTs8XZ0nH6vY73RvmP.jpg" alt="OTOKAWA" style={{ height: 32, borderRadius: 6 }} />
            <span style={{ fontSize: 15, fontWeight: 900, color: G, letterSpacing: 2 }}>OTOKAWA SEIKA</span>
          </>
        ) : (
          <span style={{ fontSize: 18, fontWeight: 900, color: G }}>商品</span>
        )}
      </header>

      {/* ヒーローバナー */}
      <div style={{ position: "relative", overflow: "hidden", cursor: "pointer", margin: "10px 10px 0", borderRadius: 16 }}
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
        onClick={() => { const s = allSlides[bannerIdx]; setTab(s.tab); setFilterCat(null); window.scrollTo(0, 0) }}>
        {allSlides.map((slide, i) => {
          if (slide.type === "shun") {
            // 旬を食べようバナー（Amazon風・テキスト上＋イラスト下ドーン）
            return (
              <div key={i} style={{
                position: i === 0 ? "relative" : "absolute", inset: 0,
                opacity: i === bannerIdx ? 1 : 0, transition: "opacity 0.8s ease",
                background: BG, minHeight: 360, overflow: "hidden",
              }}>
                {/* テキスト（上部・左寄せ・大きく） */}
                <div style={{ position: "relative", zIndex: 2, padding: "32px 24px 0" }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>旬を<br />食べよう。</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.8)", marginTop: 10 }}>今が一番おいしい野菜と果物</div>
                </div>
                {/* イラスト（下部にドーンと表示） */}
                <div style={{ position: "absolute", bottom: -10, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 1 }}>
                  <img src={`/products/shun-people.png?${IMG_VERSION}`} alt="旬を食べよう"
                    style={{ width: "110%", maxWidth: 480, objectFit: "contain", filter: "brightness(1.05)" }} />
                </div>
              </div>
            )
          }

          if (slide.type === "ichigo") {
            // いちご特集バナー（Amazon風・テキスト上+実写下ドーン）
            return (
              <div key={i} style={{
                position: i === 0 ? "relative" : "absolute", inset: 0,
                opacity: i === bannerIdx ? 1 : 0, transition: "opacity 0.8s ease",
                background: "#dc2626", minHeight: 360, overflow: "hidden",
              }}>
                {/* テキスト（左側） */}
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "42%", padding: "36px 0 36px 24px", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 2 }}>
                  <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>旬の<br />いちご特集</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.85)", marginTop: 12 }}>福島県産 甘くてジューシー</div>
                  <div style={{ display: "inline-block", marginTop: 22, padding: "9px 22px", borderRadius: 22, background: "#fff", color: "#dc2626", fontSize: 13, fontWeight: 800, alignSelf: "flex-start" }}>商品を見る →</div>
                </div>
                {/* いちご写真4枚（右側 2x2グリッド） */}
                <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: "50%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "16px 0", zIndex: 1 }}>
                  {["ichigo-pack.jpg", "ichigo-box-l.jpg", "ichigo-box-s.jpg", "ichigo-pack.jpg"].map((img, j) => (
                    <div key={j} style={{ aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,.2)" }}>
                      <img src={`/products/${img}?${IMG_VERSION}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // 緑バナー
          return (
            <div key={i} style={{
              position: i === 0 ? "relative" : "absolute", inset: 0,
              opacity: i === bannerIdx ? 1 : 0, transition: "opacity 0.8s ease",
              background: BG, minHeight: 360,
            }}>
              {/* テキスト（左側） */}
              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "42%", padding: "36px 0 36px 24px", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 2 }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", lineHeight: 1.1, whiteSpace: "pre-line" }}>{slide.title}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.85)", marginTop: 12 }}>{slide.sub}</div>
                <div style={{
                  display: "inline-block", marginTop: 22, padding: "9px 22px", borderRadius: 22,
                  background: "#fff", color: BG, fontSize: 13, fontWeight: 800, alignSelf: "flex-start",
                }}>{slide.cta}</div>
              </div>

              {/* 商品画像4枚（右側 2x2グリッド） */}
              <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: "50%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "16px 0", zIndex: 1 }}>
                {slide.products.map((img, j) => (
                  <div key={j} style={{
                    aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "#fff",
                    boxShadow: "0 6px 20px rgba(0,0,0,.2)",
                  }}>
                    <img src={`/products/${img}?${IMG_VERSION}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* ドットインジケーター */}
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 3 }}>
          {allSlides.map((_, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); setBannerIdx(i) }}
              style={{ width: i === bannerIdx ? 22 : 8, height: 8, borderRadius: 4, background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.4)", transition: "all 0.3s", cursor: "pointer" }} />
          ))}
        </div>
      </div>

      {/* ナビカード3列 */}
      {!tab && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: isHome ? "10px 10px 80px" : "10px 10px 40px" }}>
          {NAV_CARDS.map((c, i) => (
            <div key={i} onClick={() => { setTab(c.tab); setFilterCat(null); window.scrollTo(0, 0) }}
              style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
              <div style={{ height: 85, overflow: "hidden" }}>
                <img src={`/products/${c.img}?${IMG_VERSION}`} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "8px 8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a" }}>{c.title}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 商品リストページ（tabが選択された時のみ表示） */}
      {tab && <>

      {/* ページヘッダー */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => { setTab(null); setFilterCat(null) }} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#333", padding: "4px 8px" }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 800, color: tab === "sale" ? "#dc2626" : tab === "event" ? "#d97706" : G }}>
          {tab === "regular" ? "定番野菜" : tab === "sale" ? "FRESH SALE" : "近日販売予定"}
        </span>
      </div>

      {/* カテゴリフィルター（定番野菜のみ） */}
      {isRegular && (
        <div style={{ background: "#fff", borderBottom: "2px solid #eee", display: "flex", gap: 6, padding: "10px 12px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <button onClick={() => setFilterCat(null)}
            style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "1px solid #e5e7eb", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: !filterCat ? G : "#fff", color: !filterCat ? "#fff" : "#666" }}>
            すべて
          </button>
          {categories.map(cat => {
            const c = CAT_COLORS[cat] || {}
            return (
              <button key={cat} onClick={() => setFilterCat(filterCat === cat ? null : cat)}
                style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: `1px solid ${filterCat === cat ? c.tx || G : "#e5e7eb"}`, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", background: filterCat === cat ? (c.bg || "#f1f5f9") : "#fff", color: filterCat === cat ? (c.tx || G) : "#666" }}>
                {c.icon || ""} {cat}
              </button>
            )
          })}
        </div>
      )}

      {/* 商品グリッド */}
      <div style={{ padding: "16px 12px 40px", maxWidth: 640, margin: "0 auto" }}>
        {isRegular && (
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12, fontWeight: 600 }}>
            {filterCat ? `${filterCat} ${items.length}品目` : `${products.length}品目の定番商品`}
          </div>
        )}
        {tab === "sale" && (
          <div style={{ fontSize: 13, color: "#dc2626", marginBottom: 12, fontWeight: 600 }}>
            お買い得商品 {items.length}品目
          </div>
        )}
        {isEvent && (
          <div style={{ fontSize: 13, color: "#d97706", marginBottom: 12, fontWeight: 600 }}>
            近日販売予定のオトクな商品 {items.length}品目
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {items.map((item, i) => {
            const itemKey = (item.id || item.name || i).toString().replace(/[.#$/[\]]/g, "_")
            const likeCount = likes[itemKey] || 0
            const wantCount = wants[itemKey] || 0
            const imgSrc = getProductImage(item.name)
            const catStyle = isRegular && item.cat ? CAT_COLORS[item.cat] : null
            const isBestseller = rankingData.slice(0, 5).some(r => item.name.includes(r.name) || r.name.includes(item.name))

            return (
              <div key={i} onClick={() => setSelectedItem({ ...item, _key: itemKey, _img: imgSrc, _isRegular: isRegular })}
                style={{
                  background: "#fff", borderRadius: 12, overflow: "hidden",
                  border: "1px solid #e5e7eb", cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                }}>
                {/* 画像エリア（両方表示） */}
                <div style={{
                  height: 140, background: "#f8faf8", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden",
                }}>
                  {imgSrc
                    ? <img src={imgSrc} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: 48, opacity: 0.5 }}>{isRegular ? "🥗" : "🏷️"}</span>
                  }
                  {/* カテゴリバッジ（定番） */}
                  {catStyle && (
                    <span style={{
                      position: "absolute", top: 8, left: 8, fontSize: 10, fontWeight: 800,
                      background: catStyle.bg, color: catStyle.tx, padding: "2px 8px", borderRadius: 4,
                    }}>{item.cat}</span>
                  )}
                  {/* セール/オトクタグ */}
                  {!isRegular && item.tag && (
                    <span style={{
                      position: "absolute", top: 8, left: 8, fontSize: 10, fontWeight: 800,
                      background: item.tag === "特価" ? "#fef2f2" : item.tag === "旬" ? "#fffbeb" : "#f0fdf4",
                      color: item.tag === "特価" ? "#dc2626" : item.tag === "旬" ? "#d97706" : G,
                      padding: "2px 8px", borderRadius: 4,
                    }}>{item.tag}</span>
                  )}
                  {/* 売れてますバッジ */}
                  {isBestseller && (
                    <span style={{
                      position: "absolute", bottom: 8, left: 8, fontSize: 10, fontWeight: 800,
                      background: "#dc2626", color: "#fff", padding: "3px 8px", borderRadius: 4,
                    }}>🔥 売れてます</span>
                  )}
                  {/* おいしいカウント */}
                  {isRegular && likeCount > 0 && (
                    <span style={{
                      position: "absolute", top: 8, right: 8, fontSize: 11, fontWeight: 800,
                      background: "#fff3e0", color: "#e65100", padding: "2px 8px", borderRadius: 10,
                    }}>😋 {likeCount}</span>
                  )}
                  {/* 欲しいカウント */}
                  {!isRegular && wantCount > 0 && (
                    <span style={{
                      position: "absolute", top: 8, right: 8, fontSize: 11, fontWeight: 800,
                      background: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: 10,
                    }}>🙋 {wantCount}</span>
                  )}
                </div>

                {/* 情報 */}
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", marginBottom: 4, lineHeight: 1.3 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
                    {isRegular ? (item.origin ? `産地: ${item.origin}` : "") : (item.origin || "")}
                    {!isRegular && item.unit && ` ${item.unit}`}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                    <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>¥</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#dc2626", lineHeight: 1 }}>
                      {(item.price || 0).toLocaleString()}
                    </span>
                    <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>税別</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      </>}

      {/* 商品詳細モーダル */}
      {selectedItem && (
        <div onClick={() => setSelectedItem(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 640, maxHeight: "85vh", overflow: "auto", animation: "slideUp 0.25s ease" }}>

            <div style={{ textAlign: "center", padding: "10px 0 0" }}>
              <div style={{ width: 40, height: 4, background: "#d1d5db", borderRadius: 2, margin: "0 auto" }} />
            </div>

            <div style={{ height: 220, background: "#f8faf8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {selectedItem._img
                ? <img src={selectedItem._img} alt={selectedItem.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 80, opacity: 0.5 }}>🥗</span>
              }
            </div>

            <div style={{ padding: "20px 24px 32px" }}>
              {selectedItem._isRegular && selectedItem.cat && (
                <span style={{
                  fontSize: 11, fontWeight: 800, display: "inline-block", marginBottom: 8,
                  background: (CAT_COLORS[selectedItem.cat] || {}).bg || "#f1f5f9",
                  color: (CAT_COLORS[selectedItem.cat] || {}).tx || "#334155",
                  padding: "3px 10px", borderRadius: 4,
                }}>{selectedItem.cat}</span>
              )}
              {!selectedItem._isRegular && selectedItem.tag && (
                <span style={{
                  fontSize: 11, fontWeight: 800, display: "inline-block", marginBottom: 8,
                  background: selectedItem.tag === "特価" ? "#fef2f2" : "#fffbeb",
                  color: selectedItem.tag === "特価" ? "#dc2626" : "#d97706",
                  padding: "3px 10px", borderRadius: 4,
                }}>{selectedItem.tag}</span>
              )}

              <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px", color: "#1a1a1a" }}>{selectedItem.name}</h2>

              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                {selectedItem._isRegular
                  ? (selectedItem.origin ? `産地: ${selectedItem.origin}` : "")
                  : (selectedItem.origin || "")}
                {!selectedItem._isRegular && selectedItem.unit && ` / ${selectedItem.unit}`}
              </div>

              <div style={{
                background: "#fef2f2", borderRadius: 12, padding: "16px 20px", marginBottom: 20,
                display: "flex", alignItems: "baseline", gap: 4,
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#64748b" }}>税別</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#dc2626" }}>¥</span>
                <span style={{ fontSize: 40, fontWeight: 900, color: "#dc2626", lineHeight: 1 }}>
                  {(selectedItem.price || 0).toLocaleString()}
                </span>
                <span style={{ fontSize: 14, color: "#94a3b8", marginLeft: 12 }}>
                  税込 ¥{Math.ceil((selectedItem.price || 0) * 1.08).toLocaleString()}
                </span>
              </div>

              {/* おいしい / 欲しいボタン */}
              {(() => {
                const key = selectedItem._key
                if (selectedItem._isRegular) {
                  const count = likes[key] || 0
                  const liked = likedItems[key]
                  return (
                    <button onClick={() => handleLike(key)} disabled={liked}
                      style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", fontSize: 18, fontWeight: 900, cursor: liked ? "default" : "pointer", fontFamily: "inherit", background: liked ? "#f0fdf4" : "linear-gradient(135deg, #ff9800, #ff5722)", color: liked ? "#16a34a" : "#fff", boxShadow: liked ? "none" : "0 4px 16px rgba(255,87,34,.25)", marginBottom: 12 }}>
                      {liked ? `😋 おいしい！（${count}件）` : `😋 おいしい！${count > 0 ? `（${count}）` : ""}`}
                    </button>
                  )
                } else {
                  const wc = wants[key] || 0
                  const wanted = wantedItems[key]
                  return (
                    <button onClick={() => handleWant(key)} disabled={wanted}
                      style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", fontSize: 18, fontWeight: 900, cursor: wanted ? "default" : "pointer", fontFamily: "inherit", background: wanted ? "#eff6ff" : "linear-gradient(135deg, #2563eb, #7c3aed)", color: wanted ? "#2563eb" : "#fff", boxShadow: wanted ? "none" : "0 4px 16px rgba(37,99,235,.25)", marginBottom: 12 }}>
                      {wanted ? `🙋 欲しい！（${wc}人）` : `🙋 欲しい！${wc > 0 ? `（${wc}人）` : ""}`}
                    </button>
                  )
                }
              })()}

              {/* 口コミ */}
              <div style={{ marginTop: 8, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>口コミ</div>
                {(() => {
                  const key = selectedItem._key
                  const itemReviews = reviews[key] ? (Array.isArray(reviews[key]) ? reviews[key] : Object.values(reviews[key])) : []
                  return (
                    <>
                      {itemReviews.length > 0 ? itemReviews.map((r, i) => (
                        <div key={i} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: G, marginBottom: 4 }}>{r.name}</div>
                          <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{r.text}</div>
                        </div>
                      )) : (
                        <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>まだ口コミはありません</div>
                      )}
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <input value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="名前（任意）"
                          style={{ width: 80, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, fontFamily: "inherit" }} />
                        <input value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="口コミを書く..."
                          style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, fontFamily: "inherit" }} />
                        <button onClick={() => handleReview(selectedItem._key)}
                          style={{ padding: "8px 14px", borderRadius: 8, background: G, color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>送信</button>
                      </div>
                    </>
                  )
                })()}
              </div>

              {selectedItem._isRegular && (
                <div style={{ marginTop: 16, fontSize: 13, color: "#94a3b8", textAlign: "center" }}>
                  ツルハドラッグ各店舗でお買い求めいただけます
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
