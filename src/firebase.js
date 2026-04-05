import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update, push, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD3nNq5YNVHvaCmk550NSfuP3LgFsq5Keg",
  authDomain: "otokawa-deploy.firebaseapp.com",
  databaseURL: "https://otokawa-deploy-default-rtdb.firebaseio.com",
  projectId: "otokawa-deploy",
  storageBucket: "otokawa-deploy.appspot.com",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Delivery Status ---
export function updateDeliveryStatus(date, storeId, data) {
  return set(ref(db, `deliveryStatus/${date}/${storeId}`), data);
}

export function onDeliveryStatusChange(date, callback) {
  return onValue(ref(db, `deliveryStatus/${date}`), (snap) => {
    callback(snap.val() || {});
  });
}

// --- Driver Location / Active Route ---
export function updateDriverRoute(driverId, data) {
  return set(ref(db, `drivers/${driverId}/activeRoute`), data);
}

export function onDriverRouteChange(driverId, callback) {
  return onValue(ref(db, `drivers/${driverId}/activeRoute`), (snap) => {
    callback(snap.val());
  });
}

// --- Delay Report ---
export function reportDelay(date, storeId, reason, minutes) {
  return update(ref(db, `deliveryStatus/${date}/${storeId}`), {
    status: "delayed",
    delayReason: reason,
    delayMinutes: minutes,
    delayAt: new Date().toISOString(),
  });
}

// --- Store list from Firebase (fallback to local) ---
export async function getStoresFromFirebase() {
  const snap = await get(ref(db, "stores"));
  return snap.val();
}

// --- Tokubai (お買い得情報) ---
export function onTokubaiChange(callback) {
  return onValue(ref(db, "tokubai"), (snap) => {
    callback(snap.val() || []);
  });
}

export function setTokubaiItems(items) {
  return set(ref(db, "tokubai"), items);
}

// --- Staff Picks (スタッフのおすすめ) ---
export function onStaffPicksChange(callback) {
  return onValue(ref(db, "staffPicks"), (snap) => {
    callback(snap.val() || []);
  });
}

export function addStaffPick(pick) {
  return push(ref(db, "staffPicks"), pick);
}

// --- Timeline (タイムライン) ---
export function addTimelineEntry(date, entry) {
  return push(ref(db, `timeline/${date}`), entry);
}

export function onTimelineChange(date, callback) {
  return onValue(ref(db, `timeline/${date}`), (snap) => {
    callback(snap.val() || {});
  });
}

// 過去N日分のタイムライン取得
export function onTimelineRecentChange(days, callback) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const unsubs = dates.map(date =>
    onValue(ref(db, `timeline/${date}`), () => {
      // 全日付を再取得
      Promise.all(dates.map(dt =>
        new Promise(resolve => {
          onValue(ref(db, `timeline/${dt}`), (snap) => resolve({ date: dt, entries: snap.val() || {} }), { onlyOnce: true });
        })
      )).then(results => {
        const all = [];
        results.forEach(({ date, entries }) => {
          Object.entries(entries).forEach(([id, entry]) => {
            all.push({ id, date, ...entry });
          });
        });
        all.sort((a, b) => (b.at || 0) - (a.at || 0));
        callback(all);
      });
    })
  );
  return () => unsubs.forEach(u => u());
}

// --- Staff Articles (スタッフ記事) ---
export function onStaffArticlesChange(callback) {
  return onValue(ref(db, "staffArticles"), (snap) => {
    callback(snap.val() || {});
  });
}

export { db, ref, set, onValue, update, get, push };
