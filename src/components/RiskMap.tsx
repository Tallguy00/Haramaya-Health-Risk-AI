import { memo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import type { Zone } from "@/lib/api";
import { riskColor } from "./RiskBadge";

interface Props {
  zones: Zone[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

function RiskMapImpl({ zones, selectedId, onSelect }: Props) {
  const center: [number, number] = [9.4083, 42.0244];
  return (
    <MapContainer center={center} zoom={15} scrollWheelZoom className="h-[520px] w-full rounded-xl overflow-hidden">
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {zones.map((z) => {
        const color = riskColor(z.riskLevel);
        const radius = 10 + z.riskScore / 6;
        const isSelected = selectedId === z.id;
        return (
          <CircleMarker
            key={z.id}
            center={[z.lat, z.lng]}
            radius={radius}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: isSelected ? 0.85 : 0.55,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect?.(z.id) }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              <span className="font-semibold">{z.name}</span> · risk {z.riskScore}
            </Tooltip>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{z.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{z.category} · pop {z.population}</div>
                <div className="text-xs">Risk score: <strong>{z.riskScore}</strong> ({z.riskLevel})</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

export const RiskMap = memo(RiskMapImpl);
