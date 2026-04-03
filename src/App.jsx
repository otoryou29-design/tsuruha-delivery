import { useState, useEffect } from "react";
import CustomerView from "./components/CustomerView";
import { onTokubaiChange } from "./firebase";

const LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0663-lCbdMnM7y4KISTs8XZ0nH6vY73RvmP.jpg";
const HERO = "/hero-team.png";
const FAMILY = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/v0_image-2-8kVfF4q1UlUB2IzKIyXdOncfjEPM1l.png";
const INSTAGRAM = "/otokawa-instagram.jpg";
const TOMATO = "/tomato-kun.png";

/* ── お買い得商品データ（Firebaseから取得、フォールバック用） */
const TOKUBAI_FALLBACK = [
  { name: "キャベツ", price: 98, unit: "1玉", tag: "特価" },
  { name: "いちご（とちおとめ）", price: 498, unit: "1パック", tag: "旬" },
  { name: "トマト", price: 128, unit: "1個", tag: "特価" },
  { name: "バナナ", price: 108, unit: "1房", tag: "" },
  { name: "ほうれん草", price: 128, unit: "1束", tag: "産直" },
  { name: "りんご（サンふじ）", price: 158, unit: "1個", tag: "おすすめ" },
];

/* ── ライブバナー（手動で書き換え） */
const LIVE_BANNER = "郡山エリア 配送中 — まもなく納品開始です";

export default function App() {
  const [page, setPage] = useState("home");
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
      </div>
    );
  }

  const G = "#4a7c59";
  const BG2 = "#f7f7f5";
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
      <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={LOGO} alt="音川青果" style={{ height: 36, borderRadius: 6, objectFit: "cover" }} />
          <span style={{ fontSize: 17, fontWeight: 900, color: G, letterSpacing: 1 }}>音川青果</span>
        </div>
        <nav style={{ display: "flex", gap: 20, fontSize: 13, fontWeight: 600 }}>
          <a href="#business" style={{ color: "#666", textDecoration: "none" }}>事業紹介</a>
          <a href="#safety" style={{ color: "#666", textDecoration: "none" }}>安全・安心</a>
          <a href="#tokubai" style={{ color: "#666", textDecoration: "none" }}>お買い得</a>
          <a href="#contact" style={{ color: "#666", textDecoration: "none" }}>お問い合わせ</a>
        </nav>
      </header>

      {/* ── ニュースバナー */}
      <div style={{ background: G, color: "#fff", overflow: "hidden", padding: "10px 24px", fontSize: 13, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap" }}>
        <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
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

      {/* ── ライブバナー */}
      {LIVE_BANNER && (
        <div style={{ background: "#1a1a1a", color: "#fff", padding: "12px 24px", textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#ef4444", marginRight: 10, animation: "livePulse 1.5s infinite" }} />
          LIVE — {LIVE_BANNER}
          <style>{`@keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
        </div>
      )}

      {/* ── 青果をもっと身近に */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>CONCEPT</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.4 }}>青果をもっと身近に</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2 }}>
              音川青果は「美味しいは、いい食材から」をモットーに、産地から店舗まで一貫した品質管理で新鮮な野菜・果物をお届けしています。各取引先様の青果売場を通じて、地域のお客様の食卓を豊かにすることが私たちの使命です。
            </p>
          </div>
          <img src={FAMILY} alt="家族の食卓" style={{ width: "100%", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.1)", objectFit: "cover", maxHeight: 360 }} />
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
            <img src={INSTAGRAM} alt="Instagram — お得な青果情報をリアルタイムで配信" style={{ width: "100%", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── その他の事業 */}
      <section id="business" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>BUSINESS</p>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 12, color: "#1a1a1a" }}>その他の事業</h2>
          <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", marginBottom: 40 }}>音川青果は、農業から中卸まで、幅広い事業で食材の流通を支えています。</p>
          <style>{`@keyframes blink-green { 0%,100%{box-shadow:0 0 0 0 rgba(74,124,89,.4)} 50%{box-shadow:0 0 16px 4px rgba(74,124,89,.3)} } @keyframes blink-red { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,.4)} 50%{box-shadow:0 0 16px 4px rgba(220,38,38,.3)} }`}</style>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* 農業事業 */}
            <div onClick={() => setShowNogyo(true)} style={{ background: "#fff", borderRadius: 14, padding: "32px 24px", border: "2px solid #dc2626", cursor: "pointer", animation: "blink-red 2s infinite" }}>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: "#dc2626" }}>農業事業</div>
              <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, marginBottom: 12, opacity: .7 }}>COCOFARM | ココファーム</div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.9 }}>施設園芸による品質管理と安定供給を実現。産地との連携により、新鮮な食材をお届けします。</div>
              <div style={{ marginTop: 14, fontSize: 13, color: "#dc2626", fontWeight: 800 }}>農業事業を見る →</div>
            </div>
            {/* 中卸事業 */}
            <div onClick={() => setShowNakaoroshi(true)} style={{ background: "#fff", borderRadius: 14, padding: "32px 24px", border: `2px solid ${G}`, cursor: "pointer", animation: "blink-green 2s infinite" }}>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: G }}>中卸事業</div>
              <div style={{ fontSize: 12, color: G, fontWeight: 600, marginBottom: 12, opacity: .7 }}>目利き・仕入・物流</div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.9 }}>確かな目利きによる厳選仕入れと効率的な物流システムで、業務用のニーズにも対応します。</div>
              <div style={{ marginTop: 14, fontSize: 13, color: G, fontWeight: 800 }}>中卸事業を見る →</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 安心を「仕組み」で支える */}
      <section id="safety" style={{ padding: "72px 24px", background: BG2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>SAFETY</p>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.4 }}>安心を「仕組み」で<br />支える</h2>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                "トレーサビリティによる産地・流通の完全管理",
                "温度管理システムで鮮度を維持",
                "徹底した衛生管理と定期検査の実施",
                "独自の検品基準による品質保証",
                "迅速なクレーム対応フロー",
              ].map(t => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: G, fontSize: 18, flexShrink: 0, fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 20 }}>品質管理フロー</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, textAlign: "center" }}>
              {["仕入", "検品", "保管", "配送"].map((s, i) => (
                <div key={s}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: G, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 14, fontWeight: 800 }}>{i + 1}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── お買い得情報（スーパーチラシ風） */}
      <style>{`.chirashi-price { -webkit-text-stroke: 2px #990000; paint-order: stroke fill; }`}</style>
      <section id="tokubai" style={{ padding: 0, background: "#CC0000" }}>
        <div style={{ height: 6, background: "#fff200" }} />
        <div style={{ padding: "3px", background: "#fff200" }}>
          <div style={{ background: "#CC0000" }}>
            {/* ヘッダー */}
            <div style={{ padding: "12px 8px 10px", textAlign: "center", background: "linear-gradient(180deg,#880000,#CC0000)" }}>
              <div style={{ display: "inline-block", background: "#fff200", color: "#CC0000", padding: "2px 16px", fontSize: 10, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>音川青果</div>
              <h2 style={{ fontSize: "clamp(28px,6.5vw,42px)", fontWeight: 900, color: "#fff200", margin: 0, fontFamily: "'Noto Serif JP',serif", textShadow: "2px 2px 0 #660000", lineHeight: 1.1 }}>本日のお買い得</h2>
              <div style={{ fontSize: 11, color: "#fff", marginTop: 4, fontWeight: 700 }}>数量限定！お早めに！</div>
            </div>

            {/* 商品グリッド */}
            <div style={{ padding: "3px 3px 4px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
              {tokubaiItems.map((item, i) => {
                const tagCfg = { "特価": "#CC0000", "旬": "#e67e00", "産直": "#1a7a3a", "おすすめ": "#1d4ed8" };
                const tagBg = tagCfg[item.tag] || null;
                return (
                  <div key={i} style={{ background: "#fff200", border: "2px solid #CC0000", position: "relative", overflow: "hidden" }}>
                    {/* 斜め帯ラベル */}
                    {tagBg && (
                      <div style={{ position: "absolute", top: 10, left: -24, width: 90, textAlign: "center", background: tagBg, color: "#fff", fontSize: 10, fontWeight: 900, padding: "2px 0", transform: "rotate(-45deg)", zIndex: 3, boxShadow: "0 1px 3px rgba(0,0,0,.4)" }}>{item.tag}</div>
                    )}
                    {/* 商品名帯（上部・黒背景） */}
                    <div style={{ background: "#1a1a1a", padding: "5px 8px", display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ color: "#fff", fontSize: 14, fontWeight: 900 }}>{item.name}</span>
                      <span style={{ color: "rgba(255,255,255,.6)", fontSize: 10 }}>{item.unit}</span>
                    </div>
                    {/* 価格エリア（カードの主役） */}
                    <div style={{ padding: "6px 4px 8px", textAlign: "center", background: "#fff200", minHeight: 70, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                        <span style={{ fontSize: "clamp(16px,4vw,22px)", fontWeight: 900, color: "#CC0000", fontFamily: "'Zen Kurenaido',sans-serif", marginTop: 8 }}>¥</span>
                        <span className="chirashi-price" style={{ fontSize: "clamp(52px,14vw,80px)", fontWeight: 900, color: "#CC0000", lineHeight: .9, fontFamily: "'Zen Kurenaido',sans-serif" }}>{item.price.toLocaleString()}</span>
                      </div>
                      <span style={{ fontSize: 9, color: "#888", fontWeight: 600, marginTop: 2 }}>税込</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* フッター */}
            <div style={{ background: "#fff", margin: "0 3px", padding: "6px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "#999" }}>※ 価格は店舗・時期により異なる場合があります</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#CC0000", fontFamily: "'Noto Serif JP',serif" }}>音川青果</span>
            </div>
          </div>
        </div>
        <div style={{ height: 6, background: "#fff200" }} />
      </section>

      {/* ── 採用情報 */}
      <section style={{ padding: "72px 24px", background: BG2 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>RECRUIT</p>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 32 }}>一緒に働きませんか？</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {/* 正社員 */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", border: `2px solid ${G}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff", background: G, display: "inline-block", padding: "3px 12px", borderRadius: 4, marginBottom: 14 }}>正社員</div>
              <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>青果売場スタッフ</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>仕入れ・在庫管理・価格設定・SV業務</div>
              <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>月給</span><span style={{ fontWeight: 800 }}>20万円〜</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>時間</span><span style={{ fontWeight: 800 }}>6:00 - 15:00</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>休日</span><span style={{ fontWeight: 800 }}>週休2日（水・日）</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>待遇</span><span style={{ fontWeight: 800 }}>社保完備・通勤手当・残業なし</span></div>
              </div>
            </div>

            {/* 巡回パート */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "28px 24px", border: "1.5px solid #e5e7eb" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: G, background: `${G}15`, display: "inline-block", padding: "3px 12px", borderRadius: 4, marginBottom: 14 }}>パート</div>
              <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>巡回スタッフ</div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>品出し・陳列・補充・品質チェック・POP作成</div>
              <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>時給</span><span style={{ fontWeight: 800 }}>1,055円〜</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>時間</span><span style={{ fontWeight: 800 }}>9:00-13:00 / 10:00-15:00 等</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>日数</span><span style={{ fontWeight: 800 }}>週2〜3日OK・扶養内OK</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#94a3b8" }}>備考</span><span style={{ fontWeight: 800 }}>軽バン・ハイエース運転あり</span></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1.5px solid #e5e7eb", fontSize: 13, color: "#64748b", lineHeight: 1.9 }}>
            エリア：いわき・郡山・会津若松・福島｜女性活躍中・小さなお子さんいる方も歓迎
          </div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <a href="#contact" style={{ padding: "14px 32px", borderRadius: 8, background: G, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              応募・お問い合わせ →
            </a>
          </div>
        </div>
      </section>

      {/* ── 納品状況 */}
      <section id="delivery" style={{ padding: "72px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>DELIVERY STATUS</p>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 12 }}>本日の納品状況</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>リアルタイムで納品の進捗をご確認いただけます</p>
          <button onClick={() => setPage("delivery")} style={{ padding: "16px 44px", borderRadius: 10, background: G, color: "#fff", border: "none", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 16px rgba(74,124,89,.2)" }}>
            納品状況を確認する →
          </button>
        </div>
      </section>

      {/* ── お問い合わせフォーム */}
      <section id="contact" style={{ padding: "72px 24px", background: BG2 }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>CONTACT</p>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 20 }}>お問い合わせ</h2>

          {/* タブ切替 */}
          <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 8, overflow: "hidden", border: "1.5px solid #d1d5db" }}>
            <button onClick={() => setContactType("business")} style={{ flex: 1, padding: "12px", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", background: contactType === "business" ? G : "#fff", color: contactType === "business" ? "#fff" : "#64748b" }}>
              取引・一般のお問い合わせ
            </button>
            <button onClick={() => setContactType("recruit")} style={{ flex: 1, padding: "12px", border: "none", borderLeft: "1px solid #d1d5db", fontSize: 13, fontWeight: 700, cursor: "pointer", background: contactType === "recruit" ? G : "#fff", color: contactType === "recruit" ? "#fff" : "#64748b" }}>
              面接・採用応募
            </button>
          </div>

          {contactSent ? (
            <div style={{ textAlign: "center", padding: "40px 24px", background: "#fff", borderRadius: 12 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>送信完了</div>
              <div style={{ fontSize: 14, color: "#64748b" }}>
                {contactType === "recruit" ? "ご応募ありがとうございます。面接日程について折り返しご連絡いたします。" : "お問い合わせありがとうございます。担当者より折り返しご連絡いたします。"}
              </div>
            </div>
          ) : contactType === "business" ? (
            <form onSubmit={handleContactSubmit} style={{ background: "#fff", borderRadius: 12, padding: "32px 28px", border: "1px solid #e5e7eb" }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>会社名・屋号</label>
                <input type="text" required value={contactForm.company} onChange={e => setContactForm({ ...contactForm, company: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>区分</label>
                <select value={contactForm.category} onChange={e => setContactForm({ ...contactForm, category: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, background: "#fff", boxSizing: "border-box" }}>
                  {["生産者", "市場", "小売店", "飲食店", "その他業者"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>用件</label>
                <textarea required rows={5} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 8, background: G, color: "#fff", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                送信する
              </button>
            </form>
          ) : (
            <form onSubmit={handleContactSubmit} style={{ background: "#fff", borderRadius: 12, padding: "32px 28px", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>お名前</label>
                  <input type="text" required value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>メールアドレス</label>
                  <input type="email" required value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>年齢</label>
                  <input type="number" required min="15" max="80" value={contactForm.age} onChange={e => setContactForm({ ...contactForm, age: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>性別</label>
                  <select value={contactForm.gender} onChange={e => setContactForm({ ...contactForm, gender: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, background: "#fff", boxSizing: "border-box" }}>
                    {["女性", "男性", "その他"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>面接希望日（午前中）</label>
                <select required value={contactForm.interviewDate} onChange={e => setContactForm({ ...contactForm, interviewDate: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, background: "#fff", boxSizing: "border-box" }}>
                  <option value="">日程を選択してください</option>
                  {(() => {
                    const dates = [];
                    const now = new Date();
                    for (let i = 1; i <= 14; i++) {
                      const d = new Date(now);
                      d.setDate(d.getDate() + i);
                      const dow = d.getDay();
                      if (dow === 0 || dow === 3) continue;
                      const label = d.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
                      dates.push(<option key={i} value={d.toISOString().slice(0, 10)}>{label} 午前中</option>);
                    }
                    return dates;
                  })()}
                </select>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>備考（任意）</label>
                <textarea rows={3} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="希望職種やご質問など"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <button type="submit" style={{ width: "100%", padding: "14px", borderRadius: 8, background: G, color: "#fff", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                応募する
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── よくある質問（テキスト版） */}
      <section style={{ padding: "48px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { q: "ツルハドラッグはどの店舗に納品していますか？", a: "納品店舗一覧をご確認ください。" },
              { q: "お問い合わせはどこから？", a: "上記のお問い合わせフォームよりお送りください。" },
              { q: "商品についての問い合わせは？", a: "各店舗の店頭にお問い合わせください。直接のご連絡は受け付けておりません。" },
            ].map((f, i) => (
              <div key={i} style={{ padding: "16px 20px", background: BG2, borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a", marginBottom: 6 }}>Q. {f.q}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>A. {f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
