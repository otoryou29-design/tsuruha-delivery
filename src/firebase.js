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

export { db, ref, set, onValue, update, get };
