import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/api";

const styles: Record<RiskLevel, string> = {
  low: "bg-[hsl(var(--risk-low))]/15 text-[hsl(var(--risk-low))] border-[hsl(var(--risk-low))]/30",
  moderate: "bg-[hsl(var(--risk-moderate))]/15 text-[hsl(var(--risk-moderate))] border-[hsl(var(--risk-moderate))]/40",
  high: "bg-[hsl(var(--risk-high))]/15 text-[hsl(var(--risk-high))] border-[hsl(var(--risk-high))]/40",
  critical: "bg-[hsl(var(--risk-critical))]/15 text-[hsl(var(--risk-critical))] border-[hsl(var(--risk-critical))]/40",
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize", styles[level], className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

export function riskColor(level: RiskLevel) {
  return {
    low: "hsl(var(--risk-low))",
    moderate: "hsl(var(--risk-moderate))",
    high: "hsl(var(--risk-high))",
    critical: "hsl(var(--risk-critical))",
  }[level];
}
