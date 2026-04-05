import { useState, useEffect } from "react";
import CustomerView from "./components/CustomerView";
import ProductsPage from "./components/ProductsPage";
import IchigoFeature from "./components/IchigoFeature";
import ShunFeature from "./components/ShunFeature";
import { onTokubaiChange, onStaffArticlesChange } from "./firebase";

const LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0663-lCbdMnM7y4KISTs8XZ0nH6vY73RvmP.jpg";
const HERO = "/hero-team.png";
const FAMILY = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/v0_image-2-8kVfF4q1UlUB2IzKIyXdOncfjEPM1l.png";
const INSTAGRAM = "/otokawa-instagram.jpg";
const TOMATO = "/tomato-kun.png";

/* ── お買い得商品データ（Firebaseから取得、フォールバック用） */
const TOKUBAI_FALLBACK = [
  { name: "キャベツ", price: 98, unit: "1玉", tag: "特価", origin: "群馬県産" },
  { name: "いちご（とちおとめ）", price: 498, unit: "1パック", tag: "旬", origin: "栃木県産" },
  { name: "トマト", price: 128, unit: "1個", tag: "特価", origin: "福島県産" },
  { name: "バナナ", price: 108, unit: "1房", tag: "", origin: "フィリピン産" },
  { name: "ほうれん草", price: 128, unit: "1束", tag: "産直", origin: "福島県産" },
  { name: "りんご（サンふじ）", price: 158, unit: "1個", tag: "おすすめ", origin: "福島県産" },
];


export default function App() {
  const [page, setPage] = useState("home");
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const [contactType, setContactType] = useState("business"); // "business" | "recruit"
  const [contactForm, setContactForm] = useState({ company: "", category: "生産者", message: "", name: "", age: "", gender: "女性", email: "", interviewDate: "" });
  const [contactSent, setContactSent] = useState(false);
  const [showNakaoroshi, setShowNakaoroshi] = useState(false);
  const [showNogyo, setShowNogyo] = useState(false);
  const [tokubaiItems, setTokubaiItems] = useState(TOKUBAI_FALLBACK);
  const [productTab, setProductTab] = useState("regular");
  const [allArticles, setAllArticles] = useState([]);
  const [viewArticle, setViewArticle] = useState(null);

  useEffect(() => {
    const unsub = onTokubaiChange((items) => {
      const arr = Array.isArray(items) ? items : Object.values(items || {});
      if (arr.length > 0) setTokubaiItems(arr);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onStaffArticlesChange((data) => {
      const arr = Object.entries(data || {}).map(([id, v]) => ({ id, ...v }));
      setAllArticles(arr.filter(a => a && a.title).sort((a, b) => (b.at || 0) - (a.at || 0)));
    });
    return () => unsub();
  }, []);

  const G = "#4a7c59";
  const BG2 = "#f7f7f5";

  // 共通タブバー
  const TabBar = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-around", alignItems: "center", paddingTop: 8, paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))", zIndex: 150 }}>
      {[
        { label: "ホーム", page: "home", svg: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-4 0h4" },
        { label: "店舗", page: "stores", svg: "M3 21h18M3 7v1a3 3 0 006 0V7m0 0V7a3 3 0 006 0V7m0 0V7a3 3 0 006 0V7M5 21V10.7M19 21V10.7" },
        { label: "納品状況", page: "delivery", svg: "M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4m-5 0v4m0-4h4m-4 0H5" },
        { label: "事業紹介", page: "business", svg: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" },
        { label: "その他", page: "more", svg: "M4 6h16M4 12h16M4 18h16" },
      ].map(t => (
        <button key={t.label} onClick={() => setPage(t.page)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0", fontFamily: "inherit" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={page === t.page ? G : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t.svg}/></svg>
          <span style={{ fontSize: 9, fontWeight: 700, color: page === t.page ? G : "#999" }}>{t.label}</span>
        </button>
      ))}
    </div>
  )

  // 記事一覧ページ
  if (page === "articles") {
    // getProductImage相当の簡易版
    const getImg = (name) => name ? `/products/${name}` : null
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", minHeight: "100vh", background: "#f7f7f5" }}>
        <header style={{ background: "#fff", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#1a1a1a", padding: "4px 8px" }}>←</button>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a" }}>旬便り</span>
        </header>
        <div style={{ padding: "16px 16px 80px", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16, fontWeight: 600 }}>最新のおすすめ情報をチェック!</div>
          {allArticles.map((article, i) => (
            <div key={i} onClick={() => { setViewArticle(article); setPage("article-detail") }} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", cursor: "pointer", marginBottom: 12, position: "relative" }}>
              {i === 0 && <div style={{ position: "absolute", top: 10, left: 10, background: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6, zIndex: 1 }}>最新</div>}
              {article.coverImg && (
                <div style={{ height: 160, overflow: "hidden" }}>
                  <img src={getImg(article.coverImg)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.4 }}>{article.title}</div>
                {article.subtitle && <div style={{ fontSize: 13, color: "#64748b", marginTop: 6, lineHeight: 1.5 }}>{article.subtitle}</div>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#4d8c00" }}>{article.author || "OTOKAWA"}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{article.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <TabBar />
      </div>
    )
  }

  // 記事詳細ページ
  if (page === "article-detail" && viewArticle) {
    const IMG_MAP_SIMPLE = [
      [["アスパラ"], "asparagus.jpg"], [["ブロッコリー"], "broccoli.jpg"], [["新玉ねぎ","新たまねぎ"], "shin-tamanegi.jpg"],
      [["小松菜"], "komatsuna.jpg"], [["いちご大粒","いちご大"], "ichigo.jpg"], [["いちご"], "ichigo.jpg"],
      [["不知火","しらぬい"], "shiranui.jpg"], [["甘夏"], "amanatsu.jpg"], [["デコポン"], "dekopon.jpg"],
    ]
    const getArticleImg = (name) => {
      for (const [keys, file] of IMG_MAP_SIMPLE) { if (keys.some(k => name.includes(k))) return `/products/${file}` }
      return null
    }
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", minHeight: "100vh", background: "#f7f7f5" }}>
        <header style={{ background: "#fff", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPage("articles")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#1a1a1a", padding: "4px 8px" }}>←</button>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>旬便り</span>
        </header>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {viewArticle.coverImg && (
            <div style={{ height: 220, overflow: "hidden" }}>
              <img src={`/products/${viewArticle.coverImg}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ padding: "20px 16px 80px" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.4 }}>{viewArticle.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4d8c00", background: "#f0fdf4", padding: "2px 8px", borderRadius: 4 }}>{viewArticle.author || "OTOKAWA"}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{viewArticle.date}</span>
            </div>
            {viewArticle.sections && viewArticle.sections.map((sec, i) => {
              if (sec.type === "text") return <p key={i} style={{ fontSize: 14, color: "#333", lineHeight: 1.8, margin: "16px 0" }}>{sec.text}</p>
              if (sec.type === "heading") return <h3 key={i} style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", margin: "24px 0 8px", borderLeft: "3px solid #4d8c00", paddingLeft: 10 }}>{sec.text}</h3>
              if (sec.type === "product") {
                const pImg = getArticleImg(sec.name)
                return (
                  <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "12px", margin: "12px 0", display: "flex", gap: 12, alignItems: "center" }}>
                    {pImg && <div style={{ width: 64, height: 64, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}><img src={pImg} alt={sec.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a" }}>{sec.name}</div>
                      {sec.comment && <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 1.5 }}>{sec.comment}</div>}
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
        <TabBar />
      </div>
    )
  }

  if (page === "stores") {
    const storesByArea = {}
    const { STORES } = require("./stores")
    STORES.forEach(s => { if (!storesByArea[s.area]) storesByArea[s.area] = []; storesByArea[s.area].push(s) })
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", minHeight: "100vh", background: "#f7f7f5" }}>
        <header style={{ background: "#4d8c00", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#fff", padding: "4px 8px" }}>←</button>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>導入店舗一覧</span>
        </header>
        <div style={{ padding: "20px 16px 80px", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16, fontWeight: 600 }}>ツルハドラッグ OTOKAWA導入店舗 {STORES.length}店舗</div>
          {Object.entries(storesByArea).map(([area, stores]) => (
            <div key={area} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#4d8c00", marginBottom: 8, paddingLeft: 4, borderLeft: "4px solid #4d8c00", paddingLeft: 10 }}>{area}エリア（{stores.length}店舗）</div>
              <div style={{ display: "grid", gap: 6 }}>
                {stores.map(s => (
                  <div key={s.id} style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>納品: {s.deliveryDays}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <TabBar />
      </div>
    )
  }

  if (page === "shun") {
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a" }}>
        <ShunFeature onBack={() => setPage("home")} />
        <TabBar />
      </div>
    )
  }

  if (page === "ichigo") {
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a" }}>
        <IchigoFeature onBack={() => setPage("home")} />
        <TabBar />
      </div>
    )
  }

  if (page === "products") {
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a" }}>
        <ProductsPage tokubaiItems={tokubaiItems} onBack={() => setPage("home")} onNavigate={() => {}} initialTab={productTab} />
        <TabBar />
      </div>
    )
  }

  if (page === "delivery") {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Yu Gothic', 'YuGothic', 'Noto Sans JP', sans-serif" }}>
        <header style={{ background: "#fff", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #e5e7eb" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#4d8c00", fontSize: 13, cursor: "pointer", fontWeight: 700, letterSpacing: 1 }}>← トップへ</button>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontWeight: 900, fontSize: 16, color: "#4d8c00", letterSpacing: 2 }}>本日の納品状況</span>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</div>
          </div>
          <img src={LOGO} alt="音川青果" style={{ height: 32, borderRadius: 4 }} />
        </header>
        <CustomerView />
        <div style={{ height: 60 }} />
        <TabBar />
      </div>
    );
  }

  // ── 事業紹介ページ
  if (page === "business") {
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", paddingBottom: 70 }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 100 }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#1a1a1a", padding: "4px 8px" }}>←</button>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#1a1a1a" }}>事業紹介</span>
        </header>

        {/* ヒーロー */}
        <section style={{ position: "relative", height: 400, overflow: "hidden" }}>
          <img src={HERO} alt="音川青果チーム" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "rgba(0,0,0,.35)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.8)", letterSpacing: 4, marginBottom: 12 }}>OTOKAWA SEIKA</p>
            <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 900, color: "#fff", lineHeight: 1.5, margin: 0 }}>
              私たちは、挑戦する。<br />お客様に感動と豊かさを<br />届けるために。
            </h1>
          </div>
        </section>

        {/* Instagram + ブランド */}
        <section style={{ padding: "48px 24px", background: BG2 }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.08)", marginBottom: 24 }}>
              <img src={INSTAGRAM} alt="Instagram" style={{ width: "100%", display: "block" }} />
            </div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <a href="https://instagram.com/otokawa_official" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 8, background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                フォローして最新情報をチェック
              </a>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>OTOKAWA BRAND</p>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.4 }}>毎日がお買い得の<br />ヒミツ</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2 }}>
              独自の仕入れネットワークと効率的な物流システムにより、高品質な青果をお手頃価格で提供。市場価格の変動にも柔軟に対応し、安定した価格と品質を実現しています。
            </p>
          </div>
        </section>

        {/* コンセプト */}
        <section style={{ padding: "60px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>CONCEPT</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.4 }}>青果をもっと身近に</h2>
            <img src={FAMILY} alt="家族の食卓" style={{ width: "100%", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.1)", objectFit: "cover", maxHeight: 300, marginBottom: 20 }} />
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2 }}>
              音川青果は「美味しいは、いい食材から」をモットーに、産地から店舗まで一貫した品質管理で新鮮な野菜・果物をお届けしています。各取引先様の青果売場を通じて、地域のお客様の食卓を豊かにすることが私たちの使命です。
            </p>
          </div>
        </section>

        {/* 仲卸事業 */}
        <section style={{ padding: "60px 24px", background: BG2 }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>BUSINESS</p>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 24 }}>事業紹介</h2>
            <div style={{ display: "grid", gap: 16 }}>
              <div onClick={() => setShowNakaoroshi(true)} style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: `2px solid ${G}`, cursor: "pointer" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: G, marginBottom: 4 }}>中卸事業</div>
                <div style={{ fontSize: 12, color: G, opacity: .7, marginBottom: 12 }}>目利き・仕入・物流</div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.9 }}>確かな目利きによる厳選仕入れと効率的な物流システムで、業務用のニーズにも対応します。</div>
              </div>
              <div onClick={() => setShowNogyo(true)} style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "2px solid #dc2626", cursor: "pointer" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#dc2626", marginBottom: 4 }}>農業事業</div>
                <div style={{ fontSize: 12, color: "#dc2626", opacity: .7, marginBottom: 12 }}>COCOFARM | ココファーム</div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.9 }}>施設園芸による品質管理と安定供給を実現。産地との連携により、新鮮な食材をお届けします。</div>
              </div>
            </div>
          </div>
        </section>

        {/* 企業概要 */}
        <section style={{ padding: "60px 24px", background: "#fff" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>COMPANY</p>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 20 }}>企業概要</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2, marginBottom: 24 }}>
              創業40年を誇る弊社は、青果業界において大きな信頼を築き上げてまいりました。長年培ってきた青果ノウハウと豊富な経験を基盤に、お客様に最高品質の商品とサービスを提供してまいりました。
            </p>
            <div style={{ display: "grid", gap: 0, fontSize: 14, border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              {[
                ["会社名", "株式会社音川青果"],
                ["代表取締役", "音川充輝（おとかわみつてる）"],
                ["設立日", "平成6年5月30日"],
                ["所在地", "福島県郡山市富久山町久保田字太郎殿前2"],
                ["電話番号", "024-956-6606"],
                ["メール", "info@otokawa.com"],
                ["事業内容", "青果卸・小売業・物流加工・農作物生産・販売"],
                ["資本金", "1,000万円"],
                ["従業員数", "32名（正社員3名・準社員・パート27名）"],
              ].map(([k, v], i) => (
                <div key={k} style={{ display: "flex", borderBottom: i < 8 ? "1px solid #f1f5f9" : "none" }}>
                  <div style={{ width: 120, flexShrink: 0, padding: "12px 16px", background: "#f8fafc", fontWeight: 700, fontSize: 13, color: "#334155" }}>{k}</div>
                  <div style={{ flex: 1, padding: "12px 16px", color: "#475569" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAFETY */}
        <section style={{ padding: "60px 24px", background: BG2 }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>SAFETY</p>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 20 }}>安心を「仕組み」で支える</h2>
            <div style={{ display: "grid", gap: 14 }}>
              {["トレーサビリティによる産地・流通の完全管理", "温度管理システムで鮮度を維持", "徹底した衛生管理と定期検査の実施", "独自の検品基準による品質保証", "迅速なクレーム対応フロー"].map(t => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: G, fontSize: 18, flexShrink: 0, fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {showNakaoroshi && (
          <div onClick={() => setShowNakaoroshi(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}>
              <button onClick={() => setShowNakaoroshi(false)} style={{ position: "sticky", top: 12, float: "right", marginRight: 12, background: "rgba(0,0,0,.5)", color: "#fff", border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer", zIndex: 10 }}>✕</button>
              <img src="/nakaoroshi-1.jpg" alt="" style={{ width: "100%", display: "block", borderRadius: "16px 16px 0 0" }} />
              <img src="/nakaoroshi-2.jpg" alt="" style={{ width: "100%", display: "block", borderRadius: "0 0 16px 16px" }} />
            </div>
          </div>
        )}
        {showNogyo && (
          <div onClick={() => setShowNogyo(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}>
              <button onClick={() => setShowNogyo(false)} style={{ position: "sticky", top: 12, float: "right", marginRight: 12, background: "rgba(0,0,0,.5)", color: "#fff", border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer", zIndex: 10 }}>✕</button>
              <img src="/nogyo-1.jpg" alt="" style={{ width: "100%", display: "block", borderRadius: "16px 16px 0 0" }} />
              <img src="/nogyo-2.jpg" alt="" style={{ width: "100%", display: "block", borderRadius: "0 0 16px 16px" }} />
            </div>
          </div>
        )}
        <TabBar />
      </div>
    );
  }

  // ── お問い合わせページ
  if (page === "contact") {
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", minHeight: "100vh", background: "#f7f7f5" }}>
        <header style={{ background: "#fff", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPage("more")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#1a1a1a", padding: "4px 8px" }}>←</button>
          <span style={{ fontSize: 16, fontWeight: 900 }}>お問い合わせ</span>
        </header>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 80px" }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "24px 20px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>お気軽にお問い合わせください</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>お電話</div>
                <a href="tel:024-956-6606" style={{ fontSize: 20, fontWeight: 900, color: G, textDecoration: "none" }}>024-956-6606</a>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>受付時間: 平日 8:00〜17:00</div>
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>メール</div>
                <a href="mailto:info@otokawa.com" style={{ fontSize: 15, fontWeight: 700, color: G, textDecoration: "none" }}>info@otokawa.com</a>
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>所在地</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>〒963-8071<br />福島県郡山市富久山町久保田字太郎殿前2</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "20px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>取引をご検討の方へ</div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>青果の仕入れ・納品についてのご相談は、お電話またはメールにてお気軽にお問い合わせください。担当者より折り返しご連絡いたします。</div>
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  // ── 採用情報ページ
  if (page === "recruit") {
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", minHeight: "100vh", background: "#f7f7f5" }}>
        <header style={{ background: "#fff", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPage("more")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#1a1a1a", padding: "4px 8px" }}>←</button>
          <span style={{ fontSize: 16, fontWeight: 900 }}>採用情報</span>
        </header>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 80px" }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "24px 20px", marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: G, marginBottom: 12 }}>一緒に働く仲間を募集中!</div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8, marginBottom: 16 }}>音川青果では、青果の仕分け・配送・営業スタッフを募集しています。未経験の方も歓迎です。</div>
          </div>
          {[
            { title: "配送スタッフ", type: "正社員 / パート", desc: "青果の店舗配送業務。普通免許(AT可)をお持ちの方。" },
            { title: "仕分け・加工スタッフ", type: "パート", desc: "倉庫内での青果の仕分け・袋詰め作業。早朝勤務あり。" },
            { title: "営業スタッフ", type: "正社員", desc: "取引先への提案営業・新規開拓。青果業界の経験者優遇。" },
          ].map((job, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "20px", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{job.title}</div>
                <span style={{ fontSize: 10, fontWeight: 700, color: G, background: "#f0fdf4", padding: "2px 8px", borderRadius: 4 }}>{job.type}</span>
              </div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{job.desc}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "20px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>応募方法</div>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>お電話(<a href="tel:024-956-6606" style={{ color: G, fontWeight: 700 }}>024-956-6606</a>)またはメール(<a href="mailto:info@otokawa.com" style={{ color: G, fontWeight: 700 }}>info@otokawa.com</a>)にてご連絡ください。</div>
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  // ── よくある質問ページ
  if (page === "faq") {
    const faqs = [
      { q: "どこで商品を買えますか？", a: "ツルハドラッグの導入店舗にて、青果コーナーでお買い求めいただけます。店舗一覧はタブバーの「店舗」からご確認ください。" },
      { q: "配送エリアはどこですか？", a: "福島県内のツルハドラッグ各店舗に配送しています。詳しくは導入店舗一覧をご覧ください。" },
      { q: "取引を始めたいのですが", a: "お電話(024-956-6606)またはメール(info@otokawa.com)にてお気軽にお問い合わせください。" },
      { q: "商品の価格はどのくらいですか？", a: "市場価格に連動しますが、独自の仕入れネットワークにより県内平均より20〜30%お手頃な価格で提供しています。" },
      { q: "鮮度管理はどうしていますか？", a: "温度管理システムによる鮮度維持、トレーサビリティによる産地管理、独自の検品基準による品質保証を行っています。" },
      { q: "求人はしていますか？", a: "配送スタッフ・仕分けスタッフ・営業スタッフを募集しています。詳しくは採用情報ページをご覧ください。" },
    ];
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", minHeight: "100vh", background: "#f7f7f5" }}>
        <header style={{ background: "#fff", padding: "12px 16px", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPage("more")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#1a1a1a", padding: "4px 8px" }}>←</button>
          <span style={{ fontSize: 16, fontWeight: 900 }}>よくある質問</span>
        </header>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 80px" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "16px 18px", marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1a1a1a", marginBottom: 8, display: "flex", gap: 8 }}>
                <span style={{ color: G, fontWeight: 900, flexShrink: 0 }}>Q.</span>{faq.q}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, paddingLeft: 22 }}>{faq.a}</div>
            </div>
          ))}
        </div>
        <TabBar />
      </div>
    );
  }

  // ── その他ページ（メニュー）
  if (page === "more") {
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", minHeight: "100vh", background: "#f7f7f5" }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 100 }}>
          <img src={LOGO} alt="" style={{ height: 32, borderRadius: 6 }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: G, letterSpacing: 2 }}>OTOKAWA</span>
        </header>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 80px" }}>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { label: "お問い合わせ", sub: "取引・一般のお問い合わせ", page: "contact" },
              { label: "採用情報", sub: "正社員・パートの募集", page: "recruit" },
              { label: "よくある質問", sub: "FAQ", page: "faq" },
              { label: "旬便り", sub: "スタッフのおすすめ記事", page: "articles" },
              { label: "Instagram", sub: "@otokawa_official", external: "https://instagram.com/otokawa_official" },
            ].map(item => (
              <button key={item.label} onClick={() => item.external ? window.open(item.external, "_blank") : setPage(item.page)} style={{
                width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
                padding: "14px 18px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{item.sub}</div>
                </div>
                <span style={{ color: "#cbd5e1", fontSize: 18 }}>→</span>
              </button>
            ))}
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  // ── ホーム = 商品トップ（バナー + ナビカード）
  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a" }}>
      <ProductsPage tokubaiItems={tokubaiItems} onBack={() => {}} onNavigate={(target) => { if (target === "delivery") setPage("delivery"); if (target === "ichigo") setPage("ichigo"); if (target === "stores") setPage("stores"); if (target === "shun") setPage("shun"); if (target === "articles") setPage("articles") }} isHome
        onCardTap={(tab) => { setProductTab(tab); setPage("products") }} />
      <TabBar />
    </div>
  );
}
