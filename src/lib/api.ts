// API client for the Python backend.
// Set VITE_API_URL in your .env (e.g. VITE_API_URL=http://localhost:8000).
// Falls back to sample data so the UI works without the backend running.

import { sampleZones, sampleStats, sampleTrend, sampleFactors } from "./sampleData";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface Zone {
  id: string;
  name: string;
  category: "dorm" | "academic" | "dining" | "clinic" | "staff" | "public";
  lat: number;
  lng: number;
  population: number;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  factors: {
    sanitation: number;
    waterQuality: number;
    crowding: number;
    ventilation: number;
    reportedCases: number;
    vaccination: number;
  };
  topRisks: string[];
}

export interface Stats {
  totalPopulation: number;
  averageRisk: number;
  highRiskZones: number;
  activeAlerts: number;
}

export interface TrendPoint { date: string; risk: number; cases: number; }
export interface FactorContribution { factor: string; impact: number; }

async function tryFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(API_URL ? `${API_URL}${path}` : path);
    if (!res.ok) throw new Error(`${res.status}`);
    return (await res.json()) as T;
  } catch (e) {
    console.warn(`[api] ${path} failed, using sample data`, e);
    return fallback;
  }
}

export const api = {
  getZones: () => tryFetch<Zone[]>("/api/zones", sampleZones),
  getStats: () => tryFetch<Stats>("/api/stats", sampleStats),
  getTrend: () => tryFetch<TrendPoint[]>("/api/trend", sampleTrend),
  getFactors: () => tryFetch<FactorContribution[]>("/api/factors", sampleFactors),
  predict: (zoneId: string) =>
    tryFetch<{ zoneId: string; predictedRisk: number; horizonDays: number; confidence: number }>(
      `/api/predict/${zoneId}`,
      {
        zoneId,
        predictedRisk: Math.min(100, (sampleZones.find(z => z.id === zoneId)?.riskScore ?? 50) + 6),
        horizonDays: 14,
        confidence: 0.82,
      },
    ),
};

export const isUsingLiveApi = !!API_URL;
