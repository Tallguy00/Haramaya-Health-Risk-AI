import type { Zone, Stats, TrendPoint, FactorContribution } from "./api";

// Haramaya University main campus is around 9.4083° N, 42.0244° E
const C = { lat: 9.4083, lng: 42.0244 };

function level(score: number): Zone["riskLevel"] {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "moderate";
  return "low";
}

const raw: Omit<Zone, "riskLevel" | "topRisks">[] = [
  { id: "z1", name: "Block 1 Dormitory", category: "dorm", lat: C.lat + 0.004, lng: C.lng - 0.003, population: 820, riskScore: 78,
    factors: { sanitation: 42, waterQuality: 55, crowding: 88, ventilation: 40, reportedCases: 12, vaccination: 61 } },
  { id: "z2", name: "Block 4 Dormitory", category: "dorm", lat: C.lat + 0.003, lng: C.lng + 0.004, population: 760, riskScore: 64,
    factors: { sanitation: 58, waterQuality: 60, crowding: 76, ventilation: 50, reportedCases: 6, vaccination: 70 } },
  { id: "z3", name: "Main Cafeteria", category: "dining", lat: C.lat + 0.001, lng: C.lng + 0.001, population: 1500, riskScore: 71,
    factors: { sanitation: 55, waterQuality: 50, crowding: 84, ventilation: 60, reportedCases: 9, vaccination: 65 } },
  { id: "z4", name: "College of Health Sciences", category: "academic", lat: C.lat - 0.002, lng: C.lng + 0.002, population: 950, riskScore: 38,
    factors: { sanitation: 78, waterQuality: 80, crowding: 45, ventilation: 75, reportedCases: 2, vaccination: 88 } },
  { id: "z5", name: "Engineering Faculty", category: "academic", lat: C.lat - 0.003, lng: C.lng - 0.002, population: 1100, riskScore: 46,
    factors: { sanitation: 70, waterQuality: 72, crowding: 60, ventilation: 65, reportedCases: 3, vaccination: 78 } },
  { id: "z6", name: "Student Health Clinic", category: "clinic", lat: C.lat, lng: C.lng - 0.0015, population: 220, riskScore: 52,
    factors: { sanitation: 82, waterQuality: 85, crowding: 55, ventilation: 78, reportedCases: 18, vaccination: 92 } },
  { id: "z7", name: "Staff Housing East", category: "staff", lat: C.lat + 0.0055, lng: C.lng + 0.006, population: 410, riskScore: 31,
    factors: { sanitation: 80, waterQuality: 78, crowding: 38, ventilation: 72, reportedCases: 1, vaccination: 82 } },
  { id: "z8", name: "Sports Complex", category: "public", lat: C.lat - 0.005, lng: C.lng + 0.005, population: 600, riskScore: 42,
    factors: { sanitation: 65, waterQuality: 70, crowding: 58, ventilation: 90, reportedCases: 2, vaccination: 74 } },
  { id: "z9", name: "Library Complex", category: "academic", lat: C.lat + 0.0015, lng: C.lng - 0.004, population: 700, riskScore: 49,
    factors: { sanitation: 72, waterQuality: 75, crowding: 70, ventilation: 55, reportedCases: 3, vaccination: 76 } },
  { id: "z10", name: "Block 7 Dormitory", category: "dorm", lat: C.lat - 0.001, lng: C.lng - 0.005, population: 690, riskScore: 81,
    factors: { sanitation: 38, waterQuality: 48, crowding: 92, ventilation: 35, reportedCases: 14, vaccination: 58 } },
];

function topRisks(z: typeof raw[number]): string[] {
  const entries = Object.entries(z.factors) as [keyof Zone["factors"], number][];
  const labels: Record<keyof Zone["factors"], string> = {
    sanitation: "Low sanitation", waterQuality: "Poor water quality",
    crowding: "Overcrowding", ventilation: "Poor ventilation",
    reportedCases: "Recent cases", vaccination: "Low vaccination",
  };
  return entries
    .map(([k, v]) => ({
      k, label: labels[k],
      // higher is worse for crowding/cases; lower is worse for the rest
      severity: ["crowding", "reportedCases"].includes(k) ? v : 100 - v,
    }))
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3)
    .map(x => x.label);
}

export const sampleZones: Zone[] = raw.map(z => ({
  ...z,
  riskLevel: level(z.riskScore),
  topRisks: topRisks(z),
}));

export const sampleStats: Stats = {
  totalPopulation: sampleZones.reduce((s, z) => s + z.population, 0),
  averageRisk: Math.round(sampleZones.reduce((s, z) => s + z.riskScore, 0) / sampleZones.length),
  highRiskZones: sampleZones.filter(z => z.riskScore >= 55).length,
  activeAlerts: 4,
};

export const sampleTrend: TrendPoint[] = Array.from({ length: 14 }).map((_, i) => {
  const base = 48 + Math.sin(i / 2) * 8 + i * 0.6;
  return {
    date: `Apr ${i + 18}`,
    risk: Math.round(base),
    cases: Math.max(0, Math.round(4 + Math.sin(i / 1.5) * 3 + i * 0.4)),
  };
});

export const sampleFactors: FactorContribution[] = [
  { factor: "Overcrowding", impact: 28 },
  { factor: "Sanitation", impact: 22 },
  { factor: "Water Quality", impact: 18 },
  { factor: "Ventilation", impact: 14 },
  { factor: "Vaccination Gap", impact: 11 },
  { factor: "Recent Cases", impact: 7 },
];
