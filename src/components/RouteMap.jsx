import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet デフォルトアイコン修正
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const storeIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function RouteMap({ route, from, to, storeName }) {
  const center = [(from.lat + to.lat) / 2, (from.lng + to.lng) / 2];

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "2px solid #e2e8f0" }}>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: 250, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {route && (
          <GeoJSON
            data={route}
            style={{ color: "#2563eb", weight: 4, opacity: 0.8 }}
          />
        )}
        <Marker position={[from.lat, from.lng]}>
          <Popup>現在地</Popup>
        </Marker>
        <Marker position={[to.lat, to.lng]} icon={storeIcon}>
          <Popup>{storeName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
