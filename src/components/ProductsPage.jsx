import { useState, useEffect } from "react"
import { onValue, ref, db, set, get } from "../firebase"

// 商品名→画像ファイルマップ
const IMAGE_MAP = [
  // 具体的な名前を先に（部分一致の誤マッチ防止）
  [["フリルレタス", "サニーレタス"], "frill-lettuce2.jpg"],
  [["ミニトマト", "アイコ"], "mini-tomato.jpg"],
  [["長ねぎ", "土ネギ"], "negi.jpg"],
  [["玉ねぎ", "たまねぎ"], "onion2.jpg"],
  [["長いも", "長芋"], "nagaimo.jpg"],
  // 一般的な名前は後に
  [["レタス"], "lettuce.jpg"],
  [["水菜"], "mizuna.jpg"],
  [["小松菜"], "komatsuna.jpg"],
  [["ほうれん草"], "spinach.jpg"],
  [["青梗菜", "チンゲン"], "chingensai.jpg"],
  [["ブロッコリー"], "broccoli.jpg"],
  [["ねぎ", "ネギ"], "negi.jpg"],
  [["にら"], "nira.jpg"],
  [["トマト", "房取りトマト"], "tomato.jpg"],
  [["きゅうり"], "cucumber.jpg"],
  [["ピーマン"], "piman.jpg"],
  [["なす", "ナス"], "nasu.jpg"],
  [["生姜", "しょうが"], "ginger.jpg"],
  [["春菊"], "shungiku.jpg"],
  [["ニンニク", "にんにく"], "garlic.jpg"],
  [["ゆず", "柚子", "レモン"], "yuzu.jpg"],
  [["キャベツ"], "cabbage-half.jpg"],
  [["白菜"], "hakusai.jpg"],
  [["しいたけ"], "shiitake.jpg"],
  [["なめこ"], "nameko.jpg"],
  [["えのき"], "enoki.jpg"],
  [["しめじ"], "shimeji.jpg"],
  [["まいたけ"], "maitake.jpg"],
  [["大根"], "daikon.jpg"],
  [["ごぼう"], "gobo.jpg"],
  [["人参", "にんじん"], "carrot.jpg"],
  [["じゃがいも", "ジャガイモ"], "potato.jpg"],
  [["キウイ"], "kiwi.jpg"],
  [["みかん", "ミカン", "伊予柑", "デコポン", "八朔"], "mikan.jpg"],
  [["いちご", "イチゴ"], "ichigo.jpg"],
  [["バナナ"], "banana.jpg"],
  [["りんご", "サンふじ", "サンフジ"], "apple.jpg"],
]

const IMG_VERSION = "1775300602"
function getProductImage(name) {
  for (const [keys, file] of IMAGE_MAP) {
    if (keys.some(k => name.includes(k))) return `/products/${file}?${IMG_VERSION}`
  }
  return null
}

// カテゴリ表示スタイル
const CAT_COLORS = {
  葉物: { bg: "#dcfce7", tx: "#166534" },
  果菜: { bg: "#fee2e2", tx: "#991b1b" },
  薬味: { bg: "#fef9c3", tx: "#854d0e" },
  カット: { bg: "#dbeafe", tx: "#1e40af" },
  きのこ: { bg: "#ede9fe", tx: "#5b21b6" },
  根菜: { bg: "#ffedd5", tx: "#9a3412" },
  土もの: { bg: "#f5f0e8", tx: "#78350f" },
  果物: { bg: "#fce7f3", tx: "#9d174d" },
}

const G = "#4a7c59"

export default function ProductsPage({ tokubaiItems, onBack, onNavigate }) {
  const [tab, setTab] = useState("regular") // "regular" | "sale"
  const [products, setProducts] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [likes, setLikes] = useState({})
  const [likedItems, setLikedItems] = useState({})
  const [wants, setWants] = useState({}) // FRESH SALEの欲しい
  const [wantedItems, setWantedItems] = useState({})
  const [reviews, setReviews] = useState({}) // 口コミ
  const [reviewText, setReviewText] = useState("")
  const [reviewName, setReviewName] = useState("")

  // レギュラー商品をFirebaseから読み込み
  useEffect(() => {
    const unsub = onValue(ref(db, "products"), (snap) => {
      const val = snap.val()
      if (!val) return
      const arr = Array.isArray(val) ? val : Object.values(val)
      setProducts(arr.filter(p => p && p.name))
    })
    return () => unsub()
  }, [])

  // おいしい評価を読み込み
  useEffect(() => {
    const unsub = onValue(ref(db, "productLikes"), (snap) => {
      setLikes(snap.val() || {})
    })
    return () => unsub()
  }, [])

  // 欲しいボタン（FRESH SALE）
  useEffect(() => {
    const unsub = onValue(ref(db, "productWants"), (snap) => setWants(snap.val() || {}))
    return () => unsub()
  }, [])

  // 口コミ読み込み
  useEffect(() => {
    const unsub = onValue(ref(db, "productReviews"), (snap) => setReviews(snap.val() || {}))
    return () => unsub()
  }, [])

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
    const ts = Date.now()
    const existing = reviews[itemKey] || []
    const arr = Array.isArray(existing) ? existing : Object.values(existing)
    await set(ref(db, `productReviews/${itemKey}/${arr.length}`), {
      name: reviewName.trim() || "匿名",
      text: reviewText.trim(),
      at: ts,
    })
    setReviewText("")
    setReviewName("")
  }

  const items = tab === "regular" ? products : tokubaiItems

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* ヘッダー */}
      <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#333", padding: "4px 8px" }}>←</button>
        <span style={{ fontSize: 18, fontWeight: 900, color: G }}>商品</span>
      </header>

      {/* タブ */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "2px solid #eee" }}>
        <button onClick={() => setTab("regular")} style={{
          flex: 1, padding: "14px", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer",
          background: "#fff", color: tab === "regular" ? G : "#999",
          borderBottom: tab === "regular" ? `3px solid ${G}` : "3px solid transparent",
        }}>定番野菜</button>
        <button onClick={() => setTab("sale")} style={{
          flex: 1, padding: "14px", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer",
          background: "#fff", color: tab === "sale" ? "#dc2626" : "#999",
          borderBottom: tab === "sale" ? "3px solid #dc2626" : "3px solid transparent",
        }}>FRESH SALE</button>
      </div>

      {/* 商品グリッド */}
      <div style={{ padding: "16px 12px 80px", maxWidth: 640, margin: "0 auto" }}>
        {tab === "regular" && (
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12, fontWeight: 600 }}>
            {products.length}品目の定番商品
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {items.map((item, i) => {
            const itemKey = (item.id || item.name || i).toString().replace(/[.#$/[\]]/g, "_")
            const likeCount = likes[itemKey] || 0
            const isRegular = tab === "regular"
            const imgSrc = getProductImage(item.name)
            const catStyle = isRegular && item.cat ? CAT_COLORS[item.cat] : null

            return (
              <div key={i} onClick={() => setSelectedItem({ ...item, _key: itemKey, _img: imgSrc, _isRegular: isRegular })}
                style={{
                  background: "#fff", borderRadius: 12, overflow: "hidden",
                  border: "1px solid #e5e7eb", cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                  transition: "transform 0.15s",
                }}>
                {/* 画像エリア（定番野菜のみ） */}
                {isRegular && (
                  <div style={{
                    height: 140, background: "#f8faf8", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    {imgSrc
                      ? <img src={imgSrc} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: 48, opacity: 0.5 }}>🥗</span>
                    }
                    {catStyle && (
                      <span style={{
                        position: "absolute", top: 8, left: 8, fontSize: 10, fontWeight: 800,
                        background: catStyle.bg, color: catStyle.tx, padding: "2px 8px", borderRadius: 4,
                      }}>{item.cat}</span>
                    )}
                    {likeCount > 0 && (
                      <span style={{
                        position: "absolute", top: 8, right: 8, fontSize: 11, fontWeight: 800,
                        background: "#fff3e0", color: "#e65100", padding: "2px 8px", borderRadius: 10,
                      }}>😋 {likeCount}</span>
                    )}
                  </div>
                )}
                {/* セールタグ（FRESH SALEのみ） */}
                {!isRegular && item.tag && (
                  <div style={{ padding: "8px 12px 0" }}>
                    <span style={{ fontSize: 10, fontWeight: 800,
                      background: item.tag === "特価" ? "#fef2f2" : item.tag === "旬" ? "#fffbeb" : "#f0fdf4",
                      color: item.tag === "特価" ? "#dc2626" : item.tag === "旬" ? "#d97706" : G,
                      padding: "2px 8px", borderRadius: 4,
                    }}>{item.tag}</span>
                  </div>
                )}

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

      {/* 商品詳細モーダル */}
      {selectedItem && (
        <div onClick={() => setSelectedItem(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 640, maxHeight: "85vh", overflow: "auto", animation: "slideUp 0.25s ease" }}>
            <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

            {/* 閉じるバー */}
            <div style={{ textAlign: "center", padding: "10px 0 0" }}>
              <div style={{ width: 40, height: 4, background: "#d1d5db", borderRadius: 2, margin: "0 auto" }} />
            </div>

            {/* 商品画像 */}
            <div style={{ height: 220, background: "#f8faf8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {selectedItem._img
                ? <img src={selectedItem._img} alt={selectedItem.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 80, opacity: 0.5 }}>🥗</span>
              }
            </div>

            <div style={{ padding: "20px 24px 32px" }}>
              {/* カテゴリ */}
              {selectedItem._isRegular && selectedItem.cat && (
                <span style={{
                  fontSize: 11, fontWeight: 800, display: "inline-block", marginBottom: 8,
                  background: (CAT_COLORS[selectedItem.cat] || {}).bg || "#f1f5f9",
                  color: (CAT_COLORS[selectedItem.cat] || {}).tx || "#334155",
                  padding: "3px 10px", borderRadius: 4,
                }}>{selectedItem.cat}</span>
              )}

              {/* 商品名 */}
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px", color: "#1a1a1a" }}>{selectedItem.name}</h2>

              {/* 産地 */}
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                {selectedItem._isRegular
                  ? (selectedItem.origin ? `産地: ${selectedItem.origin}` : "")
                  : (selectedItem.origin || "")}
                {!selectedItem._isRegular && selectedItem.unit && ` / ${selectedItem.unit}`}
              </div>

              {/* 価格 */}
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

              {/* おいしいボタン（定番） / 欲しいボタン（セール） */}
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

      {/* 下部タブバー */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #e5e7eb",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        padding: "8px 0 env(safe-area-inset-bottom, 8px)",
        zIndex: 150,
      }}>
        <button onClick={onBack} style={tabBarBtn}>
          <span style={tabBarIcon}>🏠</span>
          <span style={tabBarLabel}>トップ</span>
        </button>
        <button onClick={() => setTab("regular")} style={tabBarBtn}>
          <span style={{ ...tabBarIcon, color: tab === "regular" ? G : "#999" }}>🥬</span>
          <span style={{ ...tabBarLabel, color: tab === "regular" ? G : "#999" }}>定番野菜</span>
        </button>
        <button onClick={() => setTab("sale")} style={tabBarBtn}>
          <span style={{ ...tabBarIcon, color: tab === "sale" ? "#dc2626" : "#999" }}>🏷️</span>
          <span style={{ ...tabBarLabel, color: tab === "sale" ? "#dc2626" : "#999" }}>セール</span>
        </button>
        <button onClick={() => { if (onNavigate) onNavigate("contact") }} style={tabBarBtn}>
          <span style={tabBarIcon}>✉️</span>
          <span style={tabBarLabel}>お問合せ</span>
        </button>
      </div>
    </div>
  )
}

const tabBarBtn = {
  flex: 1, background: "none", border: "none", cursor: "pointer",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
  padding: "4px 0", fontFamily: "inherit",
}
const tabBarIcon = { fontSize: 20, color: "#999" }
const tabBarLabel = { fontSize: 10, fontWeight: 700, color: "#999" }
