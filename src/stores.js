/**
 * ツルハドラッグ店舗マスタ（OTOKAWAアプリ data.js ベース + GPS座標）
 * 座標は国土地理院APIから取得した住所ベースのジオコーディング結果
 */
export const STORES = [
  // ── 須賀川：月・水・土
  { id: 2, area: "須賀川", name: "須賀川大袋店", rank: "A", logistics: "アサヒ", deliveryDays: "月・水・土", time: "9:00", advisors: "助川", lat: 37.2844, lng: 140.3576 },
  { id: 3, area: "須賀川", name: "須賀川南店", rank: "C", logistics: "アサヒ", deliveryDays: "月・水・土", time: "9:15", advisors: "助川", lat: 37.2733, lng: 140.3663 },
  { id: 4, area: "須賀川", name: "須賀川西店", rank: "B", logistics: "アサヒ", deliveryDays: "月・水・土", time: "9:45", advisors: "助川", lat: 37.2963, lng: 140.3625 },

  // ── 郡山：月・水・土
  { id: 6, area: "郡山", name: "郡山守山店", rank: "A", logistics: "アサヒ", deliveryDays: "月・水・土", time: "13:00", advisors: "助川", lat: 37.3272, lng: 140.4026 },
  { id: 25, area: "郡山", name: "堤店", rank: "B", logistics: "自社", deliveryDays: "月・水・土", time: "自社(午前)", advisors: "助川", lat: 37.3995, lng: 140.3380 },
  { id: 26, area: "郡山", name: "久保田店", rank: "B", logistics: "自社", deliveryDays: "月・水・土", time: "自社(午前)", advisors: "助川", lat: 37.4110, lng: 140.3894 },
  { id: 27, area: "郡山", name: "郡山富田店", rank: "A", logistics: "自社", deliveryDays: "月・水・土", time: "自社(午前)", advisors: "助川", lat: 37.4165, lng: 140.3651 },

  // ── 矢吹：月・水・土
  { id: 7, area: "矢吹", name: "矢吹北店", rank: "D", logistics: "アサヒ", deliveryDays: "月・水・土", time: "16:00", advisors: "神谷・長久保", lat: 37.2142, lng: 140.3275 },

  // ── 白河：月・水・土
  { id: 10, area: "白河", name: "白河結城店", rank: "B", logistics: "アサヒ", deliveryDays: "月・水・土", time: "13:40", advisors: "神谷・長久保", lat: 37.1189, lng: 140.2303 },
  { id: 11, area: "白河", name: "白河西店", rank: "B", logistics: "アサヒ", deliveryDays: "月・水・土", time: "14:25", advisors: "神谷・長久保", lat: 37.1283, lng: 140.1872 },
  { id: 12, area: "白河", name: "白河表郷店", rank: "A", logistics: "アサヒ", deliveryDays: "月・水・土", time: "13:10", advisors: "神谷・長久保", lat: 37.0446, lng: 140.2867 },
  { id: 13, area: "白河", name: "泉崎店", rank: "A", logistics: "アサヒ", deliveryDays: "月・水・土", time: "15:25", advisors: "神谷・長久保", lat: 37.1588, lng: 140.3008 },
  { id: 14, area: "白河", name: "白河浅川店", rank: "B", logistics: "アサヒ", deliveryDays: "月・水・土", time: "9:35", advisors: "神谷・長久保", lat: 37.0831, lng: 140.4167 },
  { id: 15, area: "白河", name: "白河西郷店", rank: "C", logistics: "アサヒ", deliveryDays: "月・水・土", time: "15:00", advisors: "神谷・長久保", lat: 37.1445, lng: 140.1696 },
  { id: 16, area: "白河", name: "矢祭店", rank: "B", logistics: "アサヒ", deliveryDays: "月・水・土", time: "8:30", advisors: "長久保", lat: 36.8574, lng: 140.4312 },
  { id: 17, area: "白河", name: "塙店", rank: "B", logistics: "アサヒ", deliveryDays: "月・水・土", time: "8:55", advisors: "長久保", lat: 36.9636, lng: 140.4054 },
  { id: 18, area: "白河", name: "棚倉店", rank: "C", logistics: "アサヒ", deliveryDays: "月・水・土", time: "9:15", advisors: "長久保", lat: 37.0294, lng: 140.3671 },
  { id: 19, area: "白河", name: "石川店", rank: "C", logistics: "アサヒ", deliveryDays: "月・水・土", time: "10:00", advisors: "長久保", lat: 37.1556, lng: 140.4460 },
  { id: 20, area: "白河", name: "古殿店", rank: "B", logistics: "アサヒ", deliveryDays: "月・水・土", time: "10:35", advisors: "長久保", lat: 37.1067, lng: 140.5248 },
  { id: 21, area: "白河", name: "白河東店", rank: "C", logistics: "アサヒ", deliveryDays: "月・水・土", time: "12:35", advisors: "長久保", lat: 37.0925, lng: 140.3476 },
  { id: 22, area: "白河", name: "白河白坂店", rank: "A", logistics: "アサヒ", deliveryDays: "月・水・土", time: "12:35", advisors: "長久保", lat: 37.0804, lng: 140.1873 },

  // ── 会津：火・金・日
  { id: 28, area: "会津", name: "会津坂下店", rank: "B", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.5649, lng: 139.8189, note: "冷蔵なし" },
  { id: 30, area: "会津", name: "喜多方塩川店", rank: "A", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.5967, lng: 139.8882, note: "冷蔵なし" },
  { id: 31, area: "会津", name: "会津坂下インター店", rank: "B", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.5529, lng: 139.7644, note: "冷蔵なし" },
  { id: 32, area: "会津", name: "喜多方上江店", rank: "A", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.6560, lng: 139.8859, note: "冷蔵なし" },
  { id: 33, area: "会津", name: "猪苗代店", rank: "C", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.5569, lng: 140.1119, note: "冷蔵なし" },
  { id: 34, area: "会津", name: "喜多方南店", rank: "A", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.6420, lng: 139.8857, note: "冷蔵なし" },
  { id: 36, area: "会津", name: "会津門田店", rank: "B", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.4799, lng: 139.9383, note: "冷蔵なし" },
  { id: 37, area: "会津", name: "会津高田店", rank: "B", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.4621, lng: 139.8310, note: "冷蔵なし" },
  { id: 38, area: "会津", name: "南会津バイパス店", rank: "A", logistics: "アサヒ", deliveryDays: "火・金・日", time: "―", advisors: "―", lat: 37.1954, lng: 139.7769, note: "冷蔵なし" },

  // ── いわき：月・木・土
  { id: 23, area: "いわき", name: "小野店", rank: "A", logistics: "自社", deliveryDays: "月・木・土", time: "自社(午前)", advisors: "助川", lat: 37.3151, lng: 140.5890 },
  { id: 24, area: "いわき", name: "平田店", rank: "B", logistics: "自社", deliveryDays: "月・木・土", time: "自社(午前)", advisors: "助川", lat: 37.2483, lng: 140.5588 },
  { id: 39, area: "いわき", name: "下神谷店", rank: "B", logistics: "アサヒ", deliveryDays: "月・木・土", time: "―", advisors: "―", lat: 37.0656, lng: 140.9567 },
  { id: 40, area: "いわき", name: "神谷店", rank: "B", logistics: "アサヒ", deliveryDays: "月・木・土", time: "―", advisors: "―", lat: 37.0600, lng: 140.9192 },
  { id: 41, area: "いわき", name: "久ノ浜店", rank: "B", logistics: "アサヒ", deliveryDays: "月・木・土", time: "―", advisors: "―", lat: 37.1391, lng: 140.9955 },
  { id: 42, area: "いわき", name: "平窪店", rank: "B", logistics: "アサヒ", deliveryDays: "月・木・土", time: "―", advisors: "―", lat: 37.0814, lng: 140.8801 },
  { id: 43, area: "いわき", name: "小名浜店", rank: "B", logistics: "アサヒ", deliveryDays: "月・木・土", time: "―", advisors: "―", lat: 36.9594, lng: 140.9098 },
  { id: 44, area: "いわき", name: "小名浜神白店", rank: "B", logistics: "アサヒ", deliveryDays: "月・木・土", time: "―", advisors: "―", lat: 36.9484, lng: 140.9237 },
];

// エリア一覧
export const AREAS = [...new Set(STORES.map((s) => s.area))];

// ドライバー → 担当エリアのマッピング
export const DRIVER_AREAS = {
  "助川": ["須賀川", "郡山", "いわき"],
  "神谷": ["白河", "矢吹"],
  "長久保": ["白河", "矢吹"],
};

// 配送日でフィルター（今日の曜日に対応する店舗）
const DAY_MAP = { 0: "日", 1: "月", 2: "火", 3: "水", 4: "木", 5: "金", 6: "土" };

export function getTodayStores() {
  const dayStr = DAY_MAP[new Date().getDay()];
  return STORES.filter((s) => s.deliveryDays.includes(dayStr));
}

export function getDriverStores(driverName) {
  const areas = DRIVER_AREAS[driverName];
  if (!areas) return STORES;
  const todayStores = getTodayStores();
  return todayStores.filter((s) => areas.includes(s.area));
}
