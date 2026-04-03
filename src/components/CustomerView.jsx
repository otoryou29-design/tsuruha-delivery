import { useState, useEffect, useMemo } from "react";
import { STORES, getTodayStores } from "../stores";
import { onDeliveryStatusChange } from "../firebase";

const TODAY = new Date().toISOString().slice(0, 10);
const G = "#4a7c59";
const BG = "#f7f7f5";

export default function CustomerView() {
  const [statuses, setStatuses] = useState({});
  const [selectedArea, setSelectedArea] = useState("全エリア");
  const [expandedStore, setExpandedStore] = useState(null);

  const scheduledStores = useMemo(() => getTodayStores(), []);

  // 今日の配送予定店舗 + Firebaseにステータスがある店舗（青果AD巡回含む）を統合
  const allTodayStores = useMemo(() => {
    const ids = new Set(scheduledStores.map(s => s.id));
    const extra = Object.keys(statuses)
      .map(id => Number(id))
      .filter(id => !ids.has(id))
      .map(id => STORES.find(s => s.id === id))
      .filter(Boolean);
    return [...scheduledStores, ...extra];
  }, [scheduledStores, statuses]);

  const areas = useMemo(() => {
    const a = [...new Set(allTodayStores.map((s) => s.area))];
    return ["全エリア", ...a];
  }, [allTodayStores]);

  const sortedStores = useMemo(() => {
    const list = selectedArea === "全エリア" ? allTodayStores : allTodayStores.filter((s) => s.area === selectedArea);
    const merged = list.map((s) => ({ ...s, ...(statuses[s.id] || {}) }));
    return merged.sort((a, b) => {
      const order = { completed: 0, enroute: 1, arrived: 2, skipped: 3, pending: 4, scheduled: 5 };
      const aO = order[a.status] ?? 5, bO = order[b.status] ?? 5;
      if (aO !== bO) return aO - bO;
      if (a.status === "completed" && b.status === "completed") return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
      return 0;
    });
  }, [selectedArea, statuses, allTodayStores]);

  useEffect(() => {
    const unsub = onDeliveryStatusChange(TODAY, setStatuses);
    return () => unsub();
  }, []);

  const completedCount = Object.values(statuses).filter(s => s.status === "completed").length;
  const totalRoute = allTodayStores.length;
  const enrouteStore = Object.values(statuses).find(s => s.status === "enroute");
  const activeCount = Object.keys(statuses).length;
  const pct = activeCount > 0 ? Math.round(completedCount / activeCount * 100) : 0;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 600, margin: "0 auto" }}>

      {/* 配送中バナー */}
      {enrouteStore && (
        <div style={{
          background: G, borderRadius: 12, padding: "16px 20px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 14, color: "#fff",
          boxShadow: "0 2px 12px rgba(74,124,89,.3)",
          animation: "enroutePulse 2.5s infinite",
        }}>
          <span style={{ fontSize: 28, animation: "blink 1.2s infinite" }}>🚚</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1 }}>
              {enrouteStore.storeName}に向かっています
            </div>
            <div style={{ fontSize: 12, opacity: .8, marginTop: 3 }}>スタッフが配送中です</div>
          </div>
        </div>
      )}

      {/* 進捗バー */}
      {activeCount > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", marginBottom: 16, border: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#1a1a1a" }}>巡回進捗</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: G }}>{pct}<span style={{ fontSize: 12, fontWeight: 700 }}>%</span></span>
          </div>
          <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${G}, #6aad7b)`, borderRadius: 4, transition: "width .6s ease" }} />
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8, textAlign: "right" }}>
            {completedCount} / {activeCount} 店舗完了
          </div>
        </div>
      )}

      {/* 本日の配送予定 */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          本日の配送予定: <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{allTodayStores.length}店舗</span>
          （アサヒロジスティクス {allTodayStores.filter(s => s.logistics === "アサヒ").length}店 / 自社便 {allTodayStores.filter(s => s.logistics === "自社").length}店）
        </div>
      </div>

      {/* ルート表示 */}
      {activeCount > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", marginBottom: 16, border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, marginBottom: 8 }}>ROUTE</div>
          <div style={{ fontSize: 12, color: "#475569", lineHeight: 2 }}>
            {Object.entries(statuses)
              .filter(([, v]) => v.storeName)
              .map(([sid, v], i) => (
                <span key={sid}>
                  {i > 0 && <span style={{ color: "#cbd5e1", margin: "0 4px" }}>→</span>}
                  <span style={{
                    fontWeight: v.status === "completed" ? 700 : v.status === "enroute" ? 800 : 400,
                    color: v.status === "completed" ? G : v.status === "enroute" ? "#d97706" : "#94a3b8",
                  }}>
                    {v.status === "completed" && "✓ "}{v.status === "enroute" && "● "}{v.storeName}
                  </span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* エリアフィルター */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {areas.map((a) => (
          <button key={a} onClick={() => setSelectedArea(a)}
            style={{
              padding: "6px 16px", borderRadius: 6, border: selectedArea === a ? "none" : "1px solid #d1d5db",
              background: selectedArea === a ? G : "#fff", color: selectedArea === a ? "#fff" : "#64748b",
              fontWeight: 700, cursor: "pointer", fontSize: 12, letterSpacing: 0.5,
              transition: "all .2s",
            }}>
            {a}
          </button>
        ))}
      </div>

      {/* 店舗カード */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sortedStores.map((store) => (
          <StoreCard key={store.id} store={store} expanded={expandedStore === store.id} onToggle={() => setExpandedStore(expandedStore === store.id ? null : store.id)} />
        ))}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;max-height:0} to{opacity:1;max-height:300px} }
        @keyframes enroutePulse { 0%,100%{box-shadow:0 2px 12px rgba(74,124,89,.3)} 50%{box-shadow:0 2px 24px rgba(74,124,89,.5)} }
      `}</style>
    </div>
  );
}

function StoreCard({ store, expanded, onToggle }) {
  const isJisha = store.logistics === "自社";
  const hasFirebaseStatus = !!store.status;
  const status = store.status || (isJisha ? "pending" : "scheduled");

  const config = {
    scheduled: { icon: "🚛", label: "通常便配送",   bg: "#fff",     border: "#e5e7eb", color: "#94a3b8", accent: "#f9fafb" },
    pending:   { icon: "−",  label: "配送予定",     bg: "#fff",     border: G,         color: G,         accent: "#f0fdf4" },
    enroute:   { icon: "🚚", label: "移動中",       bg: "#fff",     border: G,         color: G,         accent: "#f0fdf4", pulse: true },
    arrived:   { icon: "📦", label: "納品作業中",   bg: "#fff",     border: "#3b82f6", color: "#2563eb", accent: "#eff6ff" },
    completed: { icon: "✓",  label: "完了",         bg: "#fff",     border: "#22c55e", color: "#16a34a", accent: "#f0fdf4" },
    skipped:   { icon: "−",  label: "本日訪問不可", bg: "#fff",     border: "#f59e0b", color: "#d97706", accent: "#fffbeb" },
    delayed:   { icon: "!",  label: "遅延",         bg: "#fff",     border: "#ef4444", color: "#dc2626", accent: "#fef2f2", pulse: true },
  };
  const c = config[status] || config.scheduled;
  const hasItems = store.items && store.items.length > 0;
  const trackable = isJisha || hasFirebaseStatus;

  return (
    <div onClick={onToggle} style={{
      background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "14px 18px",
      cursor: hasItems ? "pointer" : "default",
      animation: c.pulse ? "enroutePulse 2.5s infinite" : status === "completed" ? "fadeIn .4s" : "none",
      transition: "all .2s",
      opacity: status === "scheduled" ? 0.7 : 1,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: c.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: status === "enroute" ? 16 : 14, fontWeight: 900, color: c.color,
            border: `1.5px solid ${c.border}`,
          }}>
            {c.icon}
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a" }}>{store.name}</span>
            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              {isJisha ? (
                <><span style={{ color: G, fontWeight: 700 }}>自社便</span>{trackable && <span style={{ background: G, color: "#fff", padding: "0 4px", borderRadius: 2, fontSize: 9 }}>LIVE</span>}</>
              ) : (
                <span>アサヒロジスティクス（通常便）</span>
              )}
              {store.time && store.time !== "―" && store.time !== "自社(午前)" && <span> {store.time}</span>}
            </div>
          </div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: c.color, padding: "3px 10px",
          background: c.accent, borderRadius: 4, letterSpacing: 0.5,
          animation: c.pulse ? "blink 1.2s infinite" : "none",
        }}>
          {c.label}
        </span>
      </div>

      {status === "enroute" && (
        <div style={{ marginTop: 8, fontSize: 12, color: G, fontWeight: 700, paddingLeft: 42 }}>
          スタッフが向かっています
        </div>
      )}

      {status === "scheduled" && (
        <div style={{ marginTop: 6, fontSize: 11, color: "#94a3b8", paddingLeft: 42 }}>
          アサヒロジスティクスによる配送のためリアルタイム追跡はできません
        </div>
      )}

      {status === "completed" && store.completedAt && (
        <div style={{ marginTop: 8, paddingLeft: 42 }}>
          <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>
            {new Date(store.completedAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} 完了
          </span>
          {hasItems && (
            <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>
              {expanded ? "▲" : "▼ 詳細"}
            </span>
          )}
        </div>
      )}

      {status === "skipped" && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#d97706", paddingLeft: 42 }}>
          {store.skipReason || "都合により本日の訪問ができません"}
        </div>
      )}

      {status === "delayed" && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#dc2626", paddingLeft: 42 }}>
          {store.delayReason}により約{store.delayMinutes}分遅延
        </div>
      )}

      {expanded && hasItems && (
        <div style={{ marginTop: 12, padding: 14, background: "#f7f7f5", borderRadius: 8, animation: "slideDown .3s ease-out" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: G, letterSpacing: 2, marginBottom: 10 }}>ITEMS</div>
          {store.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < store.items.length - 1 ? "1px solid #e5e7eb" : "none" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{item.name}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: G }}>¥{Number(item.price).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
