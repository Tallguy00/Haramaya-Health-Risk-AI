import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo, useDeferredValue } from "react";
import type { Zone } from "@/lib/api";
import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";

export function ZoneList({ zones, selectedId, onSelect }: { zones: Zone[]; selectedId?: string; onSelect: (id: string) => void }) {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const filtered = useMemo(() => {
    const sorted = [...zones].sort((a, b) => b.riskScore - a.riskScore);
    if (!deferredQ) return sorted;
    const needle = deferredQ.toLowerCase();
    return sorted.filter((z) => z.name.toLowerCase().includes(needle));
  }, [zones, deferredQ]);

  return (
    <Card className="p-4 shadow-card border-border/60">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold">Zones ranked by risk</h3>
        <span className="text-xs text-muted-foreground">{filtered.length} zones</span>
      </div>
      <div className="relative mb-3">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search zone…" className="pl-9 h-9" />
      </div>
      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {filtered.map((z) => (
          <button
            key={z.id}
            onClick={() => onSelect(z.id)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-lg border transition-all hover:border-primary/40 hover:bg-muted/60",
              selectedId === z.id ? "border-primary bg-primary/5" : "border-transparent"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{z.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{z.category} · {z.population.toLocaleString()} ppl</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-bold">{z.riskScore}</span>
                <RiskBadge level={z.riskLevel} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
