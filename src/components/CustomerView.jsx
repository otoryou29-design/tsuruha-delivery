import { useState, useEffect, useMemo } from "react";
import { STORES } from "../stores";
import { onDeliveryStatusChange } from "../firebase";

const TODAY = new Date().toISOString().slice(0, 10);
const G = "#4a7c59";

export default function CustomerView() {
  const [statuses, setStatuses] = useState({});
  const [selectedArea, setSelectedArea] = useState("全エリア");
  const [expandedStore, setExpandedStore] = useState(null);

  const areas = useMemo(() => {
    const a = [...new Set(STORES.map((s) => s.area))];
    return ["全エリア", ...a];
  }, []);

  // 納品完了を上に、移動中を次に
  const sortedStores = useMemo(() => {
    const list = selectedArea === "全エリア" ? STORES : STORES.filter((s) => s.area === selectedArea);
    const merged = list.map((s) => ({ ...s, ...(statuses[s.id] || {}) }));
    return merged.sort((a, b) => {
      const order = { completed: 0, enroute: 1, arrived: 2, pending: 3 };
      const aO = order[a.status] ?? 4, bO = order[b.status] ?? 4;
      if (aO !== bO) return aO - bO;
      if (a.status === "completed" && b.status === "completed") return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
      return 0;
    });
  }, [selectedArea, statuses]);

  useEffect(() => {
    const unsub = onDeliveryStatusChange(TODAY, setStatuses);
    return () => unsub();
  }, []);

  const completedCount = Object.values(statuses).filter(s => s.status === "completed").length;
  const totalRoute = Object.keys(statuses).length;
  const enrouteStore = Object.values(statuses).find(s => s.status === "enroute");

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", margin: "0 0 4px", fontSize: 20, fontWeight: 900 }}>
        本日の納品状況
      </h2>
      <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, margin: "0 0 16px" }}>
        {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
      </p>

      {/* 現在向かっている店舗（点滅バナー） */}
      {enrouteStore && (
        <div style={{
          background: "linear-gradient(135deg, #fffbeb, #fef3c7)", border: "2px solid #f59e0b",
          borderRadius: 14, padding: "14px 18px", marginBottom: 14,
          animation: "enroutePulse 2s infinite",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22, animation: "blink 1s infinite" }}>🚚</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#92400e" }}>
                {enrouteStore.storeName}に向かっています
              </div>
              <div style={{ fontSize: 12, color: "#b45309", marginTop: 2 }}>スタッフが配送中です</div>
            </div>
          </div>
        </div>
      )}

      {/* 進捗バー */}
      {totalRoute > 0 && (
        <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "12px 16px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#166534", marginBottom: 6 }}>
            納品進捗: {completedCount}/{totalRoute}店 完了
          </div>
          <div style={{ height: 6, background: "#dcfce7", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${totalRoute > 0 ? Math.round(completedCount / totalRoute * 100) : 0}%`, height: "100%", background: G, borderRadius: 3, transition: "width .5s" }} />
          </div>
        </div>
      )}

      {/* ルート表示 */}
      {totalRoute > 0 && (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>本日の巡回ルート</div>
          <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.8 }}>
            {Object.entries(statuses)
              .filter(([, v]) => v.storeName)
              .map(([sid, v], i) => (
                <span key={sid}>
                  {i > 0 && " → "}
                  <span style={{
                    fontWeight: v.status === "completed" ? 700 : v.status === "enroute" ? 800 : 400,
                    color: v.status === "completed" ? "#16a34a" : v.status === "enroute" ? "#d97706" : "#94a3b8",
                  }}>
                    {v.status === "completed" && "✅"}{v.status === "enroute" && "🚚"}{v.storeName}
                  </span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* エリアフィルター */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {areas.map((a) => (
          <button key={a} onClick={() => setSelectedArea(a)}
            style={{ padding: "5px 14px", borderRadius: 20, border: "none", background: selectedArea === a ? G : "#e2e8f0", color: selectedArea === a ? "#fff" : "#64748b", fontWeight: selectedArea === a ? 700 : 400, cursor: "pointer", fontSize: 12 }}>
            {a}
          </button>
        ))}
      </div>

      {/* 店舗カード */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sortedStores.map((store) => (
          <StoreCard key={store.id} store={store} expanded={expandedStore === store.id} onToggle={() => setExpandedStore(expandedStore === store.id ? null : store.id)} />
        ))}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;max-height:0} to{opacity:1;max-height:300px} }
        @keyframes enroutePulse { 0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.3)} 50%{box-shadow:0 0 16px 4px rgba(245,158,11,.2)} }
      `}</style>
    </div>
  );
}

function StoreCard({ store, expanded, onToggle }) {
  const status = store.status || "pending";

  const config = {
    pending: { icon: "⏳", label: "配送予定", bg: "#fafafa", border: "#e5e7eb", color: "#94a3b8" },
    enroute: { icon: "🚚", label: "向かっています", bg: "#fffbeb", border: "#f59e0b", color: "#d97706", pulse: true },
    arrived: { icon: "📦", label: "納品作業中", bg: "#eff6ff", border: "#3b82f6", color: "#2563eb" },
    completed: { icon: "✅", label: "納品完了", bg: "#f0fdf4", border: "#22c55e", color: "#16a34a" },
    delayed: { icon: "⚠️", label: "遅延中", bg: "#fef2f2", border: "#ef4444", color: "#dc2626", pulse: true },
  };
  const c = config[status] || config.pending;
  const hasItems = store.items && store.items.length > 0;

  return (
    <div onClick={onToggle} style={{
      background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 12, padding: "14px 16px",
      cursor: hasItems ? "pointer" : "default",
      animation: c.pulse ? "enroutePulse 2s infinite" : status === "completed" ? "fadeIn .4s" : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{store.name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: c.color, animation: c.pulse ? "blink 1s infinite" : "none" }}>
          {c.icon} {c.label}
        </span>
      </div>

      {status === "enroute" && (
        <div style={{ marginTop: 6, fontSize: 13, color: "#b45309", fontWeight: 600, animation: "blink 1.5s infinite" }}>
          スタッフが向かっています
        </div>
      )}

      {status === "completed" && store.completedAt && (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
            {new Date(store.completedAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} に納品完了
          </div>
          {hasItems && (
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
              {expanded ? "▲ 閉じる" : "▼ タップして納品内容を見る"}
            </div>
          )}
        </div>
      )}

      {status === "delayed" && (
        <div style={{ marginTop: 6, fontSize: 13, color: "#dc2626" }}>
          {store.delayReason}により約{store.delayMinutes}分遅れています
        </div>
      )}

      {expanded && hasItems && (
        <div style={{ marginTop: 10, padding: 14, background: "#fff", borderRadius: 10, border: "1px solid #dcfce7", animation: "slideDown .3s ease-out" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#166534", marginBottom: 8 }}>納品内容</div>
          {store.items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < store.items.length - 1 ? "1px solid #f0fdf4" : "none" }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: G, fontFamily: "'IBM Plex Mono', monospace" }}>¥{Number(item.price).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: "8px 10px", background: "#f0fdf4", borderRadius: 6, fontSize: 12, color: "#166534", fontWeight: 600, textAlign: "center" }}>
            「{store.items.map(it => `${it.price}円 ${it.name}`).join("」「")}」を納品いたしました！
          </div>
        </div>
      )}
    </div>
  );
}
