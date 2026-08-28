"use client";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Setup custom Leaflet marker icon to fix Next.js path resolution bugs
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface IncidentReport {
  _id: string;
  name: string;
  mobileNumber: string;
  latitude: number;
  longitude: number;
  notes?: string;
  image?: string;
  createdAt: string;
}

interface MapComponentProps {
  incidents: IncidentReport[];
}

export default function MapComponent({ incidents }: MapComponentProps) {
  // Focus on NIT Rourkela by default
  const centerPosition: [number, number] = [22.2525, 84.9035];
  const zoomLevel = 15;

  const nitRourkelaBounds: [number, number][] = [
    [22.2590, 84.8910],
    [22.2590, 84.9130],
    [22.2420, 84.9130],
    [22.2420, 84.8910]
  ];

  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden neu-flat border border-slate-200 z-10">
      <MapContainer
        center={centerPosition}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={nitRourkelaBounds}
          pathOptions={{
            color: "#dc2626",
            dashArray: "10, 10",
            fillColor: "#dc2626",
            fillOpacity: 0.05
          }}
        />
        {incidents.map((incident) => (
          <Marker
            key={incident._id}
            position={[incident.latitude, incident.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 space-y-2 text-foreground font-sans max-w-[200px]">
                {/* Header */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-emerald-800 m-0 leading-tight">
                    {incident.name}
                  </h4>
                  <span className="text-[8px] text-slate-400 font-bold block mt-0.5">
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Image */}
                {incident.image && (
                  <div className="rounded overflow-hidden bg-slate-100 max-h-[80px] flex items-center justify-center">
                    <img
                      src={incident.image}
                      alt="Thumbnail preview"
                      className="max-h-[80px] w-full object-cover"
                    />
                  </div>
                )}

                {/* Details */}
                <div className="text-[10px] space-y-1">
                  <div className="font-semibold text-slate-600">
                    Phone: <span className="text-slate-700">{incident.mobileNumber}</span>
                  </div>
                  {incident.notes && (
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100 italic leading-snug text-slate-600 truncate-3-lines">
                      "{incident.notes}"
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
