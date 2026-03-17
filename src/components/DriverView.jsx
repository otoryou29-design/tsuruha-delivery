import { useState, useEffect, useMemo } from "react";
import { STORES, getDriverStores } from "../stores";
import { getRoute, calcETA, formatDistance, formatDuration, formatTime } from "../utils/routing";
import { updateDeliveryStatus, reportDelay, onDeliveryStatusChange } from "../firebase";
import RouteMap from "./RouteMap";

const TODAY = new Date().toISOString().slice(0, 10);

const STATUS_LABEL = {
  pending: "未着手",
  enroute: "移動中",
  arrived: "作業中",
  completed: "納品完了",
  delayed: "遅延",
};

const STATUS_COLOR = {
  pending: "#94a3b8",
  enroute: "#f59e0b",
  arrived: "#3b82f6",
  completed: "#22c55e",
  delayed: "#ef4444",
};

export default function DriverView({ driverName }) {
  const [selectedArea, setSelectedArea] = useState("全エリア");
  const [statuses, setStatuses] = useState({});
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentStoreId, setCurrentStoreId] = useState(null);
  const [delayModal, setDelayModal] = useState(null);
  const [delayReason, setDelayReason] = useState("");
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [driverPos, setDriverPos] = useState(null);
  const [loading, setLoading] = useState(false);

  // ドライバーの担当店舗（今日の配送日に対応）
  const myStores = useMemo(() => getDriverStores(driverName), [driverName]);

  const areas = useMemo(() => {
    const a = [...new Set(myStores.map((s) => s.area))];
    return ["全エリア", ...a];
  }, [myStores]);

  const filteredStores = useMemo(() => {
    if (selectedArea === "全エリア") return myStores;
    return myStores.filter((s) => s.area === selectedArea);
  }, [selectedArea, myStores]);

  // リアルタイムでステータス監視
  useEffect(() => {
    const unsub = onDeliveryStatusChange(TODAY, setStatuses);
    return () => unsub();
  }, []);

  // GPS取得
  useEffect(() => {
    if (!navigator.geolocation) return;
    const wid = navigator.geolocation.watchPosition(
      (pos) => setDriverPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, maximumAge: 30000 }
    );
    return () => navigator.geolocation.clearWatch(wid);
  }, []);

  // 店舗へ出発
  async function handleDepart(store) {
    setLoading(true);
    setCurrentStoreId(store.id);

    const from = driverPos || { lat: 37.4005, lng: 140.3594 }; // デフォルト: 郡山
    try {
      const route = await getRoute(from.lat, from.lng, store.lat, store.lng);
      const { eta, driveMin, totalMin } = calcETA(route.duration);
      setRouteInfo({ ...route, store, eta, driveMin, totalMin });

      await updateDeliveryStatus(TODAY, store.id, {
        status: "enroute",
        storeName: store.name,
        driver: driverName,
        departAt: new Date().toISOString(),
        etaTime: eta.toISOString(),
        driveMinutes: driveMin,
      });
    } catch (e) {
      alert("ルート取得エラー: " + e.message);
    }
    setLoading(false);
  }

  // 到着（作業開始）
  async function handleArrive(store) {
    await updateDeliveryStatus(TODAY, store.id, {
      ...statuses[store.id],
      status: "arrived",
      arriveAt: new Date().toISOString(),
    });
  }

  // 納品完了
  async function handleComplete(store) {
    await updateDeliveryStatus(TODAY, store.id, {
      ...statuses[store.id],
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    setCurrentStoreId(null);
    setRouteInfo(null);
  }

  // 遅延報告
  async function handleDelay() {
    if (!delayModal) return;
    await reportDelay(TODAY, delayModal.id, delayReason, delayMinutes);
    setDelayModal(null);
    setDelayReason("");
    setDelayMinutes(15);
  }

  const getStatus = (storeId) => statuses[storeId]?.status || "pending";

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: "0 0 12px", fontSize: 20 }}>
        🚚 {driverName} — 配送管理
      </h2>

      {/* エリアフィルター */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {areas.map((a) => (
          <button
            key={a}
            onClick={() => setSelectedArea(a)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              background: selectedArea === a ? "#2563eb" : "#e2e8f0",
              color: selectedArea === a ? "#fff" : "#334155",
              fontWeight: selectedArea === a ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {a}
          </button>
        ))}
      </div>

      {/* ルート地図 */}
      {routeInfo && (
        <div style={{ marginBottom: 16 }}>
          <RouteMap
            route={routeInfo.geometry}
            from={driverPos || { lat: 37.4005, lng: 140.3594 }}
            to={{ lat: routeInfo.store.lat, lng: routeInfo.store.lng }}
            storeName={routeInfo.store.name}
          />
          <div style={{
            background: "#eff6ff", padding: 12, borderRadius: 8, marginTop: 8,
            display: "flex", justifyContent: "space-around", textAlign: "center"
          }}>
            <div>
              <div style={{ fontSize: 12, color: "#64748b" }}>移動</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{formatDuration(routeInfo.duration)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b" }}>距離</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{formatDistance(routeInfo.distance)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b" }}>到着予定</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2563eb" }}>
                {formatTime(routeInfo.eta)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 店舗リスト */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filteredStores.map((store) => {
          const st = getStatus(store.id);
          const info = statuses[store.id];
          return (
            <div
              key={store.id}
              style={{
                background: "#fff",
                border: `2px solid ${STATUS_COLOR[st]}`,
                borderRadius: 12,
                padding: 14,
                boxShadow: "0 1px 3px rgba(0,0,0,.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{store.name}</span>
                  <span style={{
                    marginLeft: 8, fontSize: 11, padding: "2px 8px",
                    borderRadius: 10, background: STATUS_COLOR[st], color: "#fff",
                  }}>
                    {STATUS_LABEL[st]}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  {store.area} / {store.rank}ランク
                </span>
              </div>

              {info?.etaTime && st === "enroute" && (
                <div style={{ fontSize: 13, color: "#2563eb", marginTop: 4 }}>
                  到着予定: {formatTime(new Date(info.etaTime))}
                </div>
              )}

              {st === "delayed" && info && (
                <div style={{
                  marginTop: 6, padding: 8, background: "#fef2f2",
                  borderRadius: 6, color: "#dc2626", fontSize: 13,
                }}>
                  ⚠️ {info.delayReason}（{info.delayMinutes}分遅延）
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {st === "pending" && (
                  <button
                    onClick={() => handleDepart(store)}
                    disabled={loading}
                    style={btnStyle("#2563eb")}
                  >
                    🚗 出発する
                  </button>
                )}
                {st === "enroute" && (
                  <button onClick={() => handleArrive(store)} style={btnStyle("#3b82f6")}>
                    📍 到着した
                  </button>
                )}
                {(st === "arrived" || st === "enroute") && (
                  <button onClick={() => handleComplete(store)} style={btnStyle("#22c55e")}>
                    ✅ 納品完了
                  </button>
                )}
                {st !== "completed" && st !== "pending" && (
                  <button
                    onClick={() => setDelayModal(store)}
                    style={btnStyle("#ef4444")}
                  >
                    ⚠️ 遅延報告
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 遅延モーダル */}
      {delayModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: 320 }}>
            <h3 style={{ margin: "0 0 12px" }}>⚠️ 遅延報告 — {delayModal.name}</h3>
            <select
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", marginBottom: 10 }}
            >
              <option value="">理由を選択</option>
              <option value="交通渋滞">交通渋滞</option>
              <option value="天候不良">天候不良</option>
              <option value="車両トラブル">車両トラブル</option>
              <option value="前店舗作業超過">前店舗の作業超過</option>
              <option value="その他">その他</option>
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span>遅延: </span>
              {[10, 15, 20, 30, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => setDelayMinutes(m)}
                  style={{
                    padding: "4px 10px", borderRadius: 8, border: "none",
                    background: delayMinutes === m ? "#ef4444" : "#fee2e2",
                    color: delayMinutes === m ? "#fff" : "#dc2626",
                    cursor: "pointer",
                  }}
                >
                  {m}分
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleDelay} disabled={!delayReason} style={btnStyle("#ef4444")}>
                報告する
              </button>
              <button onClick={() => setDelayModal(null)} style={btnStyle("#94a3b8")}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function btnStyle(bg) {
  return {
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: bg, color: "#fff", fontWeight: 600,
    cursor: "pointer", fontSize: 14,
  };
}
