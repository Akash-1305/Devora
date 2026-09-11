import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
export default function MapView({ lat, lon, label = "Issue location" }) {
  if (lat == null || lon == null)
    return <div className="empty">Location unavailable</div>;
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={16}
      style={{ height: 280, width: "100%", borderRadius: 14 }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}
