import { useState } from "react";
import DriverView from "./components/DriverView";
import CustomerView from "./components/CustomerView";

const DRIVERS = ["助川", "神谷", "長久保"];

export default function App() {
  const [mode, setMode] = useState(null); // null | "driver" | "customer"
  const [driverName, setDriverName] = useState("");

  // トップ画面
  if (!mode) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)",
        padding: 24,
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, margin: "0 0 8px", color: "#1e293b" }}>
            🥬 音川青果
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
            ツルハドラッグ 配送管理システム
          </p>
        </div>

        <div style={{
          display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 360,
        }}>
          {/* ドライバーログイン */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: 24,
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
          }}>
            <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>🚚 ドライバー</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DRIVERS.map((name) => (
                <button
                  key={name}
                  onClick={() => { setDriverName(name); setMode("driver"); }}
                  style={{
                    padding: "12px 20px", borderRadius: 10, border: "2px solid #2563eb",
                    background: "#eff6ff", color: "#2563eb", fontWeight: 700,
                    fontSize: 16, cursor: "pointer", transition: "all .2s",
                  }}
                  onMouseOver={(e) => { e.target.style.background = "#2563eb"; e.target.style.color = "#fff"; }}
                  onMouseOut={(e) => { e.target.style.background = "#eff6ff"; e.target.style.color = "#2563eb"; }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* お客様（ツルハ側） */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: 24,
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
          }}>
            <h2 style={{ fontSize: 18, margin: "0 0 12px" }}>🏪 配送状況を確認する</h2>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 12px" }}>
              ツルハドラッグ店舗スタッフの方はこちら
            </p>
            <button
              onClick={() => setMode("customer")}
              style={{
                width: "100%", padding: "12px 20px", borderRadius: 10,
                border: "2px solid #16a34a", background: "#f0fdf4",
                color: "#16a34a", fontWeight: 700, fontSize: 16, cursor: "pointer",
              }}
              onMouseOver={(e) => { e.target.style.background = "#16a34a"; e.target.style.color = "#fff"; }}
              onMouseOut={(e) => { e.target.style.background = "#f0fdf4"; e.target.style.color = "#16a34a"; }}
            >
              配送状況を見る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* ヘッダー */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => { setMode(null); setDriverName(""); }}
          style={{
            background: "none", border: "none", color: "#2563eb",
            fontSize: 14, cursor: "pointer", fontWeight: 600,
          }}
        >
          ← 戻る
        </button>
        <span style={{ fontWeight: 700, color: "#1e293b" }}>
          {mode === "driver" ? `🚚 ${driverName}` : "🏪 配送状況"}
        </span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>
          {new Date().toLocaleDateString("ja-JP")}
        </span>
      </div>

      {mode === "driver" ? (
        <DriverView driverName={driverName} />
      ) : (
        <CustomerView />
      )}
    </div>
  );
}
