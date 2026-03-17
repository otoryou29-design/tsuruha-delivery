/**
 * OSRM (Open Source Routing Machine) を使った無料ルート計算
 * Google Maps API不要・APIキー不要
 */

const OSRM_BASE = "https://router.project-osrm.org";

/**
 * 2地点間のルート情報を取得
 * @param {number} fromLat
 * @param {number} fromLng
 * @param {number} toLat
 * @param {number} toLng
 * @returns {{ distance: number, duration: number, geometry: string }}
 *   distance: メートル, duration: 秒
 */
export async function getRoute(fromLat, fromLng, toLat, toLng) {
  const url = `${OSRM_BASE}/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.code !== "Ok" || !data.routes.length) {
    throw new Error("ルート取得に失敗しました");
  }

  const route = data.routes[0];
  return {
    distance: route.distance,           // メートル
    duration: route.duration,           // 秒
    geometry: route.geometry,           // GeoJSON LineString
  };
}

/**
 * ETA（到着予定時刻）を計算
 * @param {number} durationSec - 移動時間（秒）
 * @param {number} workMinutes - 業務時間（分）デフォルト20分
 * @returns {{ eta: Date, driveMin: number, totalMin: number }}
 */
export function calcETA(durationSec, workMinutes = 20) {
  const now = new Date();
  const driveMin = Math.ceil(durationSec / 60);
  const totalMin = driveMin + workMinutes;
  const eta = new Date(now.getTime() + totalMin * 60 * 1000);
  return { eta, driveMin, totalMin };
}

/**
 * 複数店舗の最適巡回ルートを取得（OSRM Trip API）
 * @param {Array<{lat: number, lng: number}>} points
 * @returns {{ distance: number, duration: number, waypoints: Array, geometry: object }}
 */
export async function getOptimalRoute(points) {
  if (points.length < 2) return null;

  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `${OSRM_BASE}/trip/v1/driving/${coords}?overview=full&geometries=geojson&roundtrip=false&source=first`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.code !== "Ok") {
    throw new Error("最適ルート計算に失敗しました");
  }

  const trip = data.trips[0];
  return {
    distance: trip.distance,
    duration: trip.duration,
    geometry: trip.geometry,
    waypoints: data.waypoints,
  };
}

/**
 * 距離を読みやすい形式に変換
 */
export function formatDistance(meters) {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)}km`
    : `${Math.round(meters)}m`;
}

/**
 * 秒を「X時間Y分」形式に変換
 */
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.ceil((seconds % 3600) / 60);
  return h > 0 ? `${h}時間${m}分` : `${m}分`;
}

/**
 * 時刻を HH:MM 形式に変換
 */
export function formatTime(date) {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}
