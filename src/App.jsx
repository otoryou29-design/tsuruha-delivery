import { useState } from "react";
import CustomerView from "./components/CustomerView";

const LOGO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0663-lCbdMnM7y4KISTs8XZ0nH6vY73RvmP.jpg";
const HERO = "/hero-team.png";
const STRAWBERRY = "/strawberry-greenhouse.jpg";
const FAMILY = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/v0_image-2-8kVfF4q1UlUB2IzKIyXdOncfjEPM1l.png";
const INSTAGRAM = "/otokawa-instagram.jpg";

export default function App() {
  const [page, setPage] = useState("home");
  const [faqOpen, setFaqOpen] = useState(null);

  if (page === "delivery") {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Noto Sans JP', sans-serif" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#4a7c59", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>← トップへ</button>
          <span style={{ fontWeight: 800, fontSize: 15 }}>本日の納品状況</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{new Date().toLocaleDateString("ja-JP")}</span>
        </div>
        <CustomerView />
      </div>
    );
  }

  const G = "#4a7c59";
  const BG2 = "#f7f7f5";

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", overflowX: "hidden" }}>

      {/* ── ヘッダー */}
      <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={LOGO} alt="音川青果" style={{ height: 36, borderRadius: 6, objectFit: "cover" }} />
          <span style={{ fontSize: 17, fontWeight: 900, color: G, letterSpacing: 1 }}>音川青果</span>
        </div>
        <nav style={{ display: "flex", gap: 20, fontSize: 13, fontWeight: 600 }}>
          <a href="#service" style={{ color: "#666", textDecoration: "none" }}>事業・サービス</a>
          <a href="#safety" style={{ color: "#666", textDecoration: "none" }}>安全・安心</a>
          <a href="#about" style={{ color: "#666", textDecoration: "none" }}>会社案内</a>
          <a href="#delivery" style={{ color: "#666", textDecoration: "none" }}>納品状況</a>
        </nav>
      </header>

      {/* ── ヒーロー（画像の文字を活かす・画面高さに合わせる） */}
      <section style={{ position: "relative", height: "100vh", maxHeight: 700, overflow: "hidden" }}>
        <img src={HERO} alt="音川青果チーム" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
        {/* ── 中央テキストオーバーレイ */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "rgba(0,0,0,.35)" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.8)", letterSpacing: 4, marginBottom: 16 }}>OTOKAWA SEIKA</p>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 44px)", fontWeight: 900, color: "#fff", lineHeight: 1.5, fontFamily: "'Yu Gothic', 'YuGothic', sans-serif", margin: "0 0 8px" }}>
            私たちは、挑戦する。<br />お客様に感動と豊かさを<br />届けるために。
          </h1>
        </div>
        {/* ── 下部ボタン群 */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent 0%, rgba(0,0,0,.5) 100%)", padding: "80px 24px 36px", textAlign: "center" }}>
          <p style={{ fontSize: 18, color: "#fff", marginBottom: 20, fontFamily: "'Yu Gothic', 'YuGothic', sans-serif", fontWeight: 700 }}>
            福島県内ツルハドラッグ様への販売を行っております。
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#service" style={{ padding: "12px 28px", borderRadius: 8, background: "#fff", color: G, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              事業内容を見る →
            </a>
            <a href="/tokubai" style={{ padding: "12px 28px", borderRadius: 8, background: "#fff", color: G, fontSize: 14, fontFamily: "'Yu Gothic', 'YuGothic', sans-serif", fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }}>
              お買い得情報を確認する
            </a>
            <button onClick={() => setPage("delivery")} style={{ padding: "12px 28px", borderRadius: 8, background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,.8)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              本日の納品状況
            </button>
          </div>
        </div>
      </section>

      {/* ── イチゴハウス画像 */}
      <section style={{ height: 300, overflow: "hidden" }}>
        <img src={STRAWBERRY} alt="イチゴ栽培のハウス内" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      </section>

      {/* ── 青果をもっと身近に（画像付き） */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>CONCEPT</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.4 }}>青果をもっと身近に</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2 }}>
              音川青果は「美味しいは、いい食材から」をモットーに、産地から店舗まで一貫した品質管理で新鮮な野菜・果物をお届けしています。ツルハドラッグ各店舗の青果売場を通じて、地域のお客様の食卓を豊かにすることが私たちの使命です。
            </p>
          </div>
          <img src={FAMILY} alt="家族の食卓" style={{ width: "100%", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,.1)", objectFit: "cover", maxHeight: 360 }} />
        </div>
      </section>

      {/* ── OTOKAWAブランド */}
      <section style={{ padding: "72px 24px", background: BG2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12 }}>OTOKAWA BRAND</p>
            <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.4 }}>毎日がお買い得の<br />ヒミツ</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 2 }}>
              独自の仕入れネットワークと効率的な物流システムにより、高品質な青果をお手頃価格で提供。市場価格の変動にも柔軟に対応し、安定した価格と品質を実現しています。
            </p>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.08)" }}>
            <img src={INSTAGRAM} alt="Instagram集客力 - お得な青果情報をリアルタイムで配信" style={{ width: "100%", height: 320, objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* ── 提供価値（3カード） */}
      <section id="service" style={{ padding: "72px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>SERVICE</p>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 36 }}>提供価値</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
            {[
              { icon: "🏪", title: "店舗納品", desc: "ツルハドラッグ各店舗へ毎日新鮮な青果を配送。自社便とアサヒ物流の2系統で確実にお届けします。" },
              { icon: "🧑‍🌾", title: "売場支援", desc: "専任の青果アドバイザーが店舗を巡回。売場づくりのご提案や売上分析で店舗の売上向上を支援します。" },
              { icon: "📊", title: "発注サポート", desc: "需要予測に基づく最適な発注提案。催事企画や季節商品の提案で売場の鮮度と魅力を維持します。" },
            ].map(s => (
              <div key={s.title} style={{ background: BG2, borderRadius: 14, padding: "32px 24px", border: "1px solid #eee", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: `${G}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>{s.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.9 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ご利用の流れ */}
      <section style={{ padding: "72px 24px", background: BG2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 40 }}>ご利用の流れ</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
            {[
              { step: 1, title: "お問い合わせ", desc: "まずはお気軽にご連絡ください" },
              { step: 2, title: "お打ち合わせ", desc: "ご要望をヒアリングし最適なプランをご提案" },
              { step: 3, title: "納品開始", desc: "配送スケジュールを決定し納品スタート" },
              { step: 4, title: "継続サポート", desc: "アドバイザーが定期的に巡回・改善提案" },
            ].map(s => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: G, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 18, fontWeight: 900 }}>{s.step}</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── その他の事業 */}
      <section style={{ padding: "72px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: G, letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>BUSINESS</p>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 12 }}>その他の事業</h2>
          <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", marginBottom: 36 }}>音川青果は、農業から中卸まで、幅広い事業で食材の流通を支えています。</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: "🌱", title: "農業事業", sub: "生産への取り組み", desc: "施設園芸による品質管理と安定供給を実現。産地との連携により、新鮮な食材をお届けします。" },
              { icon: "🏭", title: "中卸事業", sub: "目利き・仕入・物流", desc: "確かな目利きによる厳選仕入れと効率的な物流システムで、業務用のニーズにも対応します。" },
            ].map(s => (
              <div key={s.title} style={{ background: BG2, borderRadius: 14, padding: "28px 24px", border: "1px solid #eee" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: G, fontWeight: 600, marginBottom: 10 }}>{s.sub}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.9 }}>{s.desc}</div>
              </div>
            ))}
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

      {/* ── 数字で見る音川青果 */}
      <section id="about" style={{ padding: "72px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 36 }}>数字で見る音川青果</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, textAlign: "center" }}>
            {[
              { num: "40+", label: "取引店舗", icon: "🏪" },
              { num: "30+", label: "取扱品目", icon: "📦" },
              { num: "6", label: "対応エリア", icon: "📍" },
              { num: "15+", label: "品質チェック工程", icon: "🛡️" },
            ].map(d => (
              <div key={d.label} style={{ padding: 24, background: BG2, borderRadius: 14, border: "1px solid #eee" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{d.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: G }}>{d.num}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginTop: 4 }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── よくある質問 */}
      <section style={{ padding: "72px 24px", background: BG2 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, textAlign: "center", marginBottom: 36 }}>よくある質問</h2>
          {[
            { q: "サービスの料金はどのくらいですか？", a: "商品や配送条件により異なります。まずはお気軽にお問い合わせください。" },
            { q: "いつからサービスを開始できますか？", a: "お打ち合わせ後、最短1週間程度で納品を開始できます。" },
            { q: "どのようなサポートが提供されますか？", a: "青果アドバイザーによる店舗巡回、売場提案、需要予測に基づく発注サポートなどを行っています。" },
          ].map((f, i) => (
            <div key={i} style={{ borderBottom: "1px solid #ddd" }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", padding: "18px 0", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{f.q}</span>
                <span style={{ fontSize: 20, color: "#94a3b8", flexShrink: 0, marginLeft: 12 }}>{faqOpen === i ? "−" : "+"}</span>
              </button>
              {faqOpen === i && <div style={{ padding: "0 0 18px", fontSize: 14, color: "#64748b", lineHeight: 1.8 }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── 採用 */}
      <section style={{ padding: "72px 24px", background: "linear-gradient(135deg, rgba(74,124,89,.08), rgba(59,130,246,.06))" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, marginBottom: 12 }}>一緒に働きませんか？</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28, lineHeight: 1.8 }}>音川青果では、共に成長し、地域の食を支える仲間を募集しています。</p>
          <a href="#" style={{ padding: "14px 32px", borderRadius: 8, background: G, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            採用情報を見る →
          </a>
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

      {/* ── CTA */}
      <section style={{ padding: "64px 24px", background: G, textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(20px, 3.5vw, 32px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>お気軽にご相談ください</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.75)", marginBottom: 28 }}>商品のご相談、取引のお問い合わせなど、お気軽にご連絡ください。</p>
        <a href="mailto:contact@otokawa.com" style={{ padding: "14px 36px", borderRadius: 8, background: "#fff", color: G, fontSize: 15, fontWeight: 800, textDecoration: "none" }}>
          お問い合わせフォームへ →
        </a>
      </section>

      {/* ── フッター */}
      <footer style={{ background: BG2, borderTop: "1px solid #e5e7eb", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <img src={LOGO} alt="音川青果" style={{ height: 28, borderRadius: 4 }} />
              <span style={{ fontSize: 14, fontWeight: 900, color: G }}>音川青果</span>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>美味しいは、いい食材から。産地・鮮度・流通・安全管理にこだわり、信頼される食材をお届けします。</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>事業・サービス</div>
            <div style={{ display: "grid", gap: 6, fontSize: 12, color: "#94a3b8" }}>
              <span>otokawa</span><span>農業事業</span><span>中卸事業</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>会社情報</div>
            <div style={{ display: "grid", gap: 6, fontSize: 12, color: "#94a3b8" }}>
              <span>安全・安心の取り組み</span><span>会社案内</span><span>採用情報</span><span>お問い合わせ</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>その他</div>
            <div style={{ display: "grid", gap: 6, fontSize: 12, color: "#94a3b8" }}>
              <span>プライバシーポリシー</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 20, textAlign: "center", fontSize: 12, color: "#b0b0b0" }}>
          &copy; {new Date().getFullYear()} 株式会社音川青果. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
