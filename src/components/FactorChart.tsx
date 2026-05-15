import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import type { FactorContribution } from "@/lib/api";

export function FactorChart({ data }: { data: FactorContribution[] }) {
  return (
    <Card className="p-6 shadow-card border-border/60">
      <h3 className="text-lg font-bold">Model Feature Importance</h3>
      <p className="text-xs text-muted-foreground mb-4">What drives the AI risk prediction</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16, top: 4, bottom: 0 }}>
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis type="category" dataKey="factor" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))" }}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={`hsl(var(--primary) / ${0.4 + (data.length - i) * 0.1})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
