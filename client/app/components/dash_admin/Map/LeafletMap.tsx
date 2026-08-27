"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface DispatchPin {
  id: number;
  sector: string;
  type: string;
  coords: string;
  lat: number;
  lng: number;
  status: "active" | "standby";
  intensity: "high" | "moderate" | "low";
  color: string;
}

interface LeafletMapProps {
  pins: DispatchPin[];
  selectedPin: DispatchPin | null;
  onSelectPin: (pin: DispatchPin) => void;
}

// Custom Div Icon Creator for Leaflet to fix default icon image rendering bugs in Next.js
const createCustomIcon = (color: string, isSelected: boolean) => {
  const size = isSelected ? "18px" : "14px";
  const anchor = isSelected ? 9 : 7;
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: ${size}; height: ${size}; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; position: relative;">
             <div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%; position: absolute; top: 0; left: 0; animation: ping 1.8s infinite ease-in-out; opacity: 0.6;"></div>
           </div>`,
    className: "custom-leaflet-icon",
    iconSize: [isSelected ? 18 : 14, isSelected ? 18 : 14],
    iconAnchor: [anchor, anchor],
  });
};

// Map Recenter Helper component
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14, { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function LeafletMap({ pins, selectedPin, onSelectPin }: LeafletMapProps) {
  const defaultPosition: [number, number] = [22.2531, 84.9011];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative">
      <MapContainer
        center={defaultPosition}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      >
        {/* Soft watermark-free OpenStreetMap style requires no API keys */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dashed boundary circle centered around NIT Rourkela campus */}
        <Circle
          center={[22.2531, 84.9011]}
          radius={1200}
          pathOptions={{
            color: "#16a34a",
            fillColor: "#16a34a",
            fillOpacity: 0.05,
            dashArray: "8, 8",
            weight: 2,
          }}
        />

        {pins.map((pin) => {
          const isSelected = selectedPin?.id === pin.id;
          return (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={createCustomIcon(pin.color, isSelected)}
              eventHandlers={{
                click: () => onSelectPin(pin),
              }}
            >
              <Popup>
                <div className="text-xs p-1 font-sans">
                  <h5 className="font-bold text-slate-800 uppercase leading-none mb-1">{pin.sector}</h5>
                  <p className="text-[10px] text-slate-500 font-semibold">{pin.type}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {selectedPin && (
          <RecenterMap lat={selectedPin.lat} lng={selectedPin.lng} />
        )}
      </MapContainer>
    </div>
  );
}
