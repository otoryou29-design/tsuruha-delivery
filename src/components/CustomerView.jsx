import { useState, useEffect, useMemo } from "react";
import { STORES } from "../stores";
import { onDeliveryStatusChange } from "../firebase";
import { formatTime } from "../utils/routing";

const TODAY = new Date().toISOString().slice(0, 10);

export default function CustomerView() {
  const [statuses, setStatuses] = useState({});
  const [selectedArea, setSelectedArea] = useState("全エリア");

  const areas = useMemo(() => {
    const a = [...new Set(STORES.map((s) => s.area))];
    return ["全エリア", ...a];
  }, []);

  const filteredStores = useMemo(() => {
    const list = selectedArea === "全エリア" ? STORES : STORES.filter((s) => s.area === selectedArea);
    return list.map((s) => ({ ...s, ...(statuses[s.id] || {}) }));
  }, [selectedArea, statuses]);

  useEffect(() => {
    const unsub = onDeliveryStatusChange(TODAY, setStatuses);
    return () => unsub();
  }, []);

  // 遅延バナー
  const delayedStores = Object.values(statuses).filter((s) => s.status === "delayed");

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", margin: "0 0 8px", fontSize: 20 }}>
        🥬 音川青果 — 本日の配送状況
      </h2>
      <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>
        {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
      </p>

      {/* 遅延バナー */}
      {delayedStores.map((d) => (
        <div
          key={d.storeName}
          style={{
            background: "#dc2626", color: "#fff", padding: 12, borderRadius: 10,
            marginBottom: 10, animation: "fadeIn .3s",
          }}
        >
          <strong>⚠️ 遅延のお知らせ</strong>
          <div style={{ marginTop: 4 }}>
            {d.storeName}: {d.delayReason}により約{d.delayMinutes}分遅れています
          </div>
        </div>
      ))}

      {/* エリアフィルター */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {areas.map((a) => (
          <button
            key={a}
            onClick={() => setSelectedArea(a)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              background: selectedArea === a ? "#16a34a" : "#e2e8f0",
              color: selectedArea === a ? "#fff" : "#334155",
              fontWeight: selectedArea === a ? 700 : 400, cursor: "pointer",
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {/* 配送状況カード */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function StoreCard({ store }) {
  const status = store.status || "pending";

  const config = {
    pending: { icon: "⏳", label: "本日配送予定", bg: "#f8fafc", border: "#e2e8f0", labelColor: "#94a3b8" },
    enroute: { icon: "🚚", label: "向かっています", bg: "#fffbeb", border: "#f59e0b", labelColor: "#d97706", blink: true },
    arrived: { icon: "📦", label: "納品作業中", bg: "#eff6ff", border: "#3b82f6", labelColor: "#2563eb" },
    completed: { icon: "✅", label: "納品完了", bg: "#f0fdf4", border: "#22c55e", labelColor: "#16a34a" },
    delayed: { icon: "⚠️", label: "遅延中", bg: "#fef2f2", border: "#ef4444", labelColor: "#dc2626", blink: true },
  };

  const c = config[status];

  return (
    <div
      style={{
        background: c.bg,
        border: `2px solid ${c.border}`,
        borderRadius: 12,
        padding: 16,
        transition: "all .3s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>{store.name}</span>
        <span
          style={{
            fontSize: 13, fontWeight: 700, color: c.labelColor,
            animation: c.blink ? "blink 1s infinite" : "none",
          }}
        >
          {c.icon} {c.label}
        </span>
      </div>

      {status === "enroute" && store.etaTime && (
        <div style={{ marginTop: 8, fontSize: 14 }}>
          <span style={{ color: "#64748b" }}>担当: </span>
          <strong>{store.driver}</strong>
          <span style={{ marginLeft: 12, color: "#64748b" }}>到着予定: </span>
          <strong style={{ color: "#d97706" }}>{formatTime(new Date(store.etaTime))}</strong>
        </div>
      )}

      {status === "arrived" && (
        <div style={{ marginTop: 8, fontSize: 14, color: "#2563eb" }}>
          <span>担当: </span><strong>{store.driver}</strong> が納品作業中です
        </div>
      )}

      {status === "completed" && store.completedAt && (
        <div style={{ marginTop: 8, fontSize: 14, color: "#16a34a" }}>
          ✅ {formatTime(new Date(store.completedAt))} に納品完了
          {store.driver && <span>（担当: {store.driver}）</span>}
        </div>
      )}

      {status === "delayed" && (
        <div style={{ marginTop: 8, fontSize: 14, color: "#dc2626" }}>
          {store.delayReason}により約{store.delayMinutes}分遅れています
        </div>
      )}
    </div>
  );
}
