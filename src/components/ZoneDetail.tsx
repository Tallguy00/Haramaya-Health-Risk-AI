import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RiskBadge } from "./RiskBadge";
import { api, type Zone } from "@/lib/api";
import { useState } from "react";
import { Sparkles, Users, AlertTriangle, MapPin } from "lucide-react";
import { toast } from "sonner";

export function ZoneDetail({ zone }: { zone: Zone }) {
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState<{ predictedRisk: number; horizonDays: number; confidence: number } | null>(null);

  const runPrediction = async () => {
    setPredicting(true);
    try {
      const res = await api.predict(zone.id);
      setPrediction(res);
      toast.success(`14-day forecast: ${res.predictedRisk} risk score`);
    } catch {
      toast.error("Prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  const factors: [string, number, "higherWorse" | "lowerWorse"][] = [
    ["Sanitation", zone.factors.sanitation, "lowerWorse"],
    ["Water Quality", zone.factors.waterQuality, "lowerWorse"],
    ["Crowding", zone.factors.crowding, "higherWorse"],
    ["Ventilation", zone.factors.ventilation, "lowerWorse"],
    ["Vaccination", zone.factors.vaccination, "lowerWorse"],
  ];

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin className="size-3" /> {zone.category}
          </p>
          <h3 className="text-xl font-bold mt-1 truncate">{zone.name}</h3>
        </div>
        <RiskBadge level={zone.riskLevel} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-lg bg-muted/60 p-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="size-3" /> Population</p>
          <p className="text-lg font-bold mt-0.5">{zone.population.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-muted/60 p-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="size-3" /> Risk Score</p>
          <p className="text-lg font-bold mt-0.5">{zone.riskScore}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm font-semibold mb-3">Risk Factors</p>
        <div className="space-y-3">
          {factors.map(([name, value, dir]) => {
            const bad = dir === "higherWorse" ? value : 100 - value;
            const tone = bad >= 70 ? "destructive" : bad >= 45 ? "warning" : "success";
            const color = tone === "destructive" ? "hsl(var(--risk-critical))" : tone === "warning" ? "hsl(var(--risk-moderate))" : "hsl(var(--risk-low))";
            return (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{name}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm font-semibold mb-2">Top Concerns</p>
        <ul className="space-y-1.5">
          {zone.topRisks.map((r) => (
            <li key={r} className="text-sm flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-destructive" /> {r}
            </li>
          ))}
        </ul>
      </div>

      <Button onClick={runPrediction} disabled={predicting} className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
        <Sparkles className="size-4 mr-2" />
        {predicting ? "Forecasting…" : "Run AI Forecast"}
      </Button>

      {prediction && (
        <div className="mt-4 p-3 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-xs text-muted-foreground">{prediction.horizonDays}-day forecast</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-primary">{prediction.predictedRisk}</span>
            <span className="text-xs text-muted-foreground">risk · {(prediction.confidence * 100).toFixed(0)}% confidence</span>
          </div>
          <Progress value={prediction.confidence * 100} className="h-1 mt-2" />
        </div>
      )}
    </Card>
  );
}
