import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "warning" | "destructive" | "success";
}

const tones = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "primary" }: Props) {
  return (
    <Card className="p-5 shadow-card border-border/60 hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("size-11 rounded-xl flex items-center justify-center shrink-0", tones[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}
