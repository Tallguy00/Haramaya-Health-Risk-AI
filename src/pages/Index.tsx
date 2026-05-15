import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, AlertTriangle, Activity, Bell } from "lucide-react";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { RiskMap } from "@/components/RiskMap";
import { ZoneDetail } from "@/components/ZoneDetail";
import { ZoneList } from "@/components/ZoneList";
import { TrendChart } from "@/components/TrendChart";
import { FactorChart } from "@/components/FactorChart";
import { api } from "@/lib/api";
import L from "leaflet";

// Fix leaflet default icon path issue
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Index = () => {
  const { data: zones = [] } = useQuery({ queryKey: ["zones"], queryFn: api.getZones });
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: api.getStats });
  const { data: trend = [] } = useQuery({ queryKey: ["trend"], queryFn: api.getTrend });
  const { data: factors = [] } = useQuery({ queryKey: ["factors"], queryFn: api.getFactors });

  const [selectedId, setSelectedId] = useState<string | undefined>();
  useEffect(() => {
    if (!selectedId && zones.length) setSelectedId(zones[0].id);
  }, [zones, selectedId]);
  const selected = zones.find((z) => z.id === selectedId);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-6">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Population Monitored" value={stats?.totalPopulation.toLocaleString() ?? "—"} hint="Across all campus zones" icon={Users} tone="primary" />
          <StatCard label="Average Risk Score" value={stats?.averageRisk ?? "—"} hint="0–100 composite index" icon={Activity} tone="warning" />
          <StatCard label="High-Risk Zones" value={stats?.highRiskZones ?? "—"} hint="Score ≥ 55" icon={AlertTriangle} tone="destructive" />
          <StatCard label="Active Alerts" value={stats?.activeAlerts ?? "—"} hint="Requiring intervention" icon={Bell} tone="success" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border/60 bg-card shadow-card p-2">
              <RiskMap zones={zones} selectedId={selectedId} onSelect={setSelectedId} />
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">Risk:</span>
                  <div className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[hsl(var(--risk-low))]" /> Low</div>
                  <div className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[hsl(var(--risk-moderate))]" /> Moderate</div>
                  <div className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[hsl(var(--risk-high))]" /> High</div>
                  <div className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[hsl(var(--risk-critical))]" /> Critical</div>
                </div>
                <span className="text-muted-foreground">Click a zone to see details</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrendChart data={trend} />
              <FactorChart data={factors} />
            </div>
          </div>

          <div className="space-y-6">
            {selected && <ZoneDetail zone={selected} />}
            <ZoneList zones={zones} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </section>

      </main>

      <footer className="border-t border-border/60 mt-8 py-6">
        <p className="container text-center text-xs text-muted-foreground">
          Haramaya University · AI-driven Community Health Risk Prediction · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
