import { useState, useEffect } from "react";
import CustomerView from "./components/CustomerView";
import ProductsPage from "./components/ProductsPage";
import { onTokubaiChange } from "./firebase";

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

  useEffect(() => {
    const unsub = onTokubaiChange((items) => {
      const arr = Array.isArray(items) ? items : Object.values(items || {});
      if (arr.length > 0) setTokubaiItems(arr);
    });
    return () => unsub();
  }, []);

  const G = "#4a7c59";
  const BG2 = "#f7f7f5";

  // 共通タブバー
  const TabBar = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-around", alignItems: "center", paddingTop: 8, paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))", zIndex: 150 }}>
      <style>{`@keyframes tabBlink { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      {[
        { label: "ホーム", page: "home", svg: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-4 0h4" },
        { label: "商品", page: "products", svg: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
        { label: "納品状況", page: "delivery", svg: "M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4m-5 0v4m0-4h4m-4 0H5", blink: true },
        { label: "事業紹介", page: "business", svg: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" },
        { label: "その他", page: "more", svg: "M4 6h16M4 12h16M4 18h16" },
      ].map(t => (
        <button key={t.label} onClick={() => setPage(t.page)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0", fontFamily: "inherit", animation: t.blink && page !== t.page ? "tabBlink 2s ease-in-out infinite" : "none" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.blink ? G : (page === t.page ? G : "#999")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t.svg}/></svg>
          <span style={{ fontSize: 9, fontWeight: 700, color: t.blink ? G : (page === t.page ? G : "#999") }}>{t.label}</span>
        </button>
      ))}
    </div>
  )

  if (page === "products") {
    return <ProductsPage tokubaiItems={tokubaiItems} onBack={() => setPage("home")} onNavigate={(target) => { setPage("home"); setTimeout(() => { const el = document.getElementById(target); if (el) el.scrollIntoView({ behavior: "smooth" }) }, 100) }} />
  }

  if (page === "delivery") {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Yu Gothic', 'YuGothic', 'Noto Sans JP', sans-serif" }}>
        <header style={{ background: "#4a7c59", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 700, letterSpacing: 1 }}>← トップへ</button>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontWeight: 900, fontSize: 16, color: "#fff", letterSpacing: 2 }}>本日の納品状況</span>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", marginTop: 2 }}>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</div>
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
        <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 100 }}>
          <img src={LOGO} alt="" style={{ height: 32, borderRadius: 6 }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: G, letterSpacing: 2 }}>OTOKAWA SEIKA</span>
        </header>

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

  // ── その他ページ（お問合せ・求人）
  if (page === "more") {
    return (
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", paddingBottom: 70 }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 100 }}>
          <img src={LOGO} alt="" style={{ height: 32, borderRadius: 6 }} />
          <span style={{ fontSize: 15, fontWeight: 900, color: G, letterSpacing: 2 }}>OTOKAWA SEIKA</span>
        </header>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>メニュー</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { label: "お問い合わせ", sub: "取引・一般のお問い合わせ", action: () => { setPage("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100) } },
              { label: "採用情報", sub: "正社員・パートの募集", action: () => { setPage("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100); setContactType("recruit") } },
              { label: "Instagram", sub: "@otokawa_official", action: () => window.open("https://instagram.com/otokawa_official", "_blank") },
              { label: "よくある質問", sub: "FAQ", action: () => { setPage("home"); setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100) } },
            ].map(item => (
              <button key={item.label} onClick={item.action} style={{
                width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
                padding: "16px 20px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{item.sub}</div>
                </div>
                <span style={{ color: "#cbd5e1", fontSize: 20 }}>→</span>
              </button>
            ))}
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  const pulseKeyframes = `@keyframes pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,255,255,.7); } 50% { opacity: .85; box-shadow: 0 0 16px 4px rgba(255,255,255,.5); } }`;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetch("https://formspree.io/f/xpwzgkvl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: contactForm.company, category: contactForm.category, message: contactForm.message, _replyto: "info@otokawa.com" }),
    }).then(() => setContactSent(true));
  };

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", overflowX: "hidden" }}>

      {/* ── ヘッダー */}
      <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "10px 24px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 100 }}>
        <img src={LOGO} alt="音川青果" style={{ height: 32, borderRadius: 6, objectFit: "cover" }} />
        <span style={{ fontSize: 15, fontWeight: 900, color: G, letterSpacing: 2 }}>OTOKAWA SEIKA</span>
      </header>

      {/* ── ニュースバナー */}
      <div style={{ background: G, color: "#fff", overflow: "hidden", padding: "10px 24px", fontSize: 13, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap" }}>
        <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } @keyframes tokubaiSlide { 0%,20% { transform: translateX(0); } 80%,100% { transform: translateX(-50%); } }`}</style>
        <div style={{ display: "inline-block", animation: "marquee 20s linear infinite" }}>
          <span style={{ marginRight: 8, background: "#fff", color: G, padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>NEW</span>
          納品状況がリアルタイムで確認できるようになりました！
          <span style={{ margin: "0 32px", opacity: 0.5 }}>|</span>
          <span style={{ marginRight: 8, background: "#fff", color: G, padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>NEW</span>
          ドン・キホーテ米沢店で青果納品 4月20日からスタート！
        </div>
      </div>

      {/* ── ヒーロー */}
      <section style={{ position: "relative", height: "100vh", maxHeight: 700, overflow: "hidden" }}>
        <img src={HERO} alt="音川青果チーム" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
        <style>{`@media(max-width:768px){.hero-text-overlay{padding-bottom:25%!important;}}`}</style>
        <div className="hero-text-overlay" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "rgba(0,0,0,.35)", paddingBottom: "10%" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.8)", letterSpacing: 4, marginBottom: 16 }}>OTOKAWA SEIKA</p>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 900, color: "#fff", lineHeight: 1.5, fontFamily: "'Yu Gothic', 'YuGothic', sans-serif", margin: 0 }}>
            私たちは、挑戦する。<br />お客様に感動と豊かさを<br />届けるために。
          </h1>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent 0%, rgba(0,0,0,.5) 100%)", padding: "60px 24px 36px", textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "#fff", marginBottom: 24, fontFamily: "'Yu Gothic', 'YuGothic', sans-serif", fontWeight: 700, marginTop: 32 }}>
            福島県内ツルハドラッグ様への販売を行っております。
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#tokubai" style={{ padding: "12px 28px", borderRadius: 8, background: "#fff", color: G, fontSize: 14, fontFamily: "'Yu Gothic', 'YuGothic', sans-serif", fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }}>
              お買い得情報を確認する
            </a>
            <style>{pulseKeyframes}</style>
            <button onClick={() => setPage("delivery")} style={{ padding: "12px 28px", borderRadius: 8, background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,.8)", fontSize: 14, fontWeight: 700, cursor: "pointer", animation: "pulse 2s ease-in-out infinite" }}>
              本日の納品状況
            </button>
          </div>
        </div>
      </section>

      {/* ── OTOKAWAブランド + Instagram */}
      <section style={{ padding: "72px 24px", background: BG2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>OTOKAWA BRAND</p>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.4 }}>毎日がお買い得の<br />ヒミツ</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2, marginBottom: 20 }}>
              独自の仕入れネットワークと効率的な物流システムにより、高品質な青果をお手頃価格で提供。市場価格の変動にも柔軟に対応し、安定した価格と品質を実現しています。
            </p>
            <a href="https://instagram.com/otokawa_official" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px", borderRadius: 8, background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              フォローして最新のお買い得情報をチェック
            </a>
          </div>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.08)" }}>
            <img src={INSTAGRAM} alt="Instagram" style={{ width: "100%", display: "block" }} />
          </div>
        </div>
      </section>

      <div style={{ height: 60 }} />

      {/* ── 中卸事業モーダル */}
      {showNakaoroshi && (
        <div onClick={() => setShowNakaoroshi(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}>
            <button onClick={() => setShowNakaoroshi(false)} style={{ position: "sticky", top: 12, float: "right", marginRight: 12, background: "rgba(0,0,0,.5)", color: "#fff", border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer", zIndex: 10 }}>✕</button>
            <img src="/nakaoroshi-1.jpg" alt="株式会社音川青果の紹介" style={{ width: "100%", display: "block", borderRadius: "16px 16px 0 0" }} />
            <img src="/nakaoroshi-2.jpg" alt="強力な加工能力・鮮度コントロール・安定した物流輸送" style={{ width: "100%", display: "block", borderRadius: "0 0 16px 16px" }} />
          </div>
        </div>
      )}

      {/* ── 農業事業モーダル */}
      {showNogyo && (
        <div onClick={() => setShowNogyo(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, maxWidth: 700, width: "100%", maxHeight: "90vh", overflow: "auto", position: "relative" }}>
            <button onClick={() => setShowNogyo(false)} style={{ position: "sticky", top: 12, float: "right", marginRight: 12, background: "rgba(0,0,0,.5)", color: "#fff", border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer", zIndex: 10 }}>✕</button>
            <img src="/nogyo-1.jpg" alt="自社栽培の濃厚トマト＆ミニトマト" style={{ width: "100%", display: "block", borderRadius: "16px 16px 0 0" }} />
            <img src="/nogyo-2.jpg" alt="農場長・代表取締役の紹介" style={{ width: "100%", display: "block", borderRadius: "0 0 16px 16px" }} />
          </div>
        </div>
      )}

      <TabBar />

      {/* ── フッター */}
      <footer style={{ background: "#1a1a1a", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <img src={LOGO} alt="音川青果" style={{ height: 28, borderRadius: 4 }} />
              <span style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>音川青果</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.8 }}>美味しいは、いい食材から。産地・鮮度・流通・安全管理にこだわり、信頼される食材をお届けします。</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#fff" }}>事業紹介</div>
            <div style={{ display: "grid", gap: 6, fontSize: 12, color: "rgba(255,255,255,.5)" }}>
              <a href="#business" style={{ color: "inherit", textDecoration: "none" }}>農業事業</a>
              <a href="#business" style={{ color: "inherit", textDecoration: "none" }}>中卸事業</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#fff" }}>情報</div>
            <div style={{ display: "grid", gap: 6, fontSize: 12, color: "rgba(255,255,255,.5)" }}>
              <a href="#safety" style={{ color: "inherit", textDecoration: "none" }}>安全・安心</a>
              <a href="#tokubai" style={{ color: "inherit", textDecoration: "none" }}>お買い得情報</a>
              <a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>お問い合わせ</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#fff" }}>SNS</div>
            <div style={{ display: "grid", gap: 6, fontSize: 12 }}>
              <a href="https://instagram.com/otokawa_official" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>Instagram</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.3)" }}>
          &copy; {new Date().getFullYear()} 株式会社音川青果. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
