from __future__ import annotations

from datetime import date, timedelta
import math
from statistics import mean
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Haramaya Health Risk API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


RiskLevel = Literal["low", "moderate", "high", "critical"]

CENTER = {"lat": 9.4083, "lng": 42.0244}

RAW_ZONES = [
    {
        "id": "z1",
        "name": "Block 1 Dormitory",
        "category": "dorm",
        "lat": CENTER["lat"] + 0.004,
        "lng": CENTER["lng"] - 0.003,
        "population": 820,
        "riskScore": 78,
        "factors": {
            "sanitation": 42,
            "waterQuality": 55,
            "crowding": 88,
            "ventilation": 40,
            "reportedCases": 12,
            "vaccination": 61,
        },
    },
    {
        "id": "z2",
        "name": "Block 4 Dormitory",
        "category": "dorm",
        "lat": CENTER["lat"] + 0.003,
        "lng": CENTER["lng"] + 0.004,
        "population": 760,
        "riskScore": 64,
        "factors": {
            "sanitation": 58,
            "waterQuality": 60,
            "crowding": 76,
            "ventilation": 50,
            "reportedCases": 6,
            "vaccination": 70,
        },
    },
    {
        "id": "z3",
        "name": "Main Cafeteria",
        "category": "dining",
        "lat": CENTER["lat"] + 0.001,
        "lng": CENTER["lng"] + 0.001,
        "population": 1500,
        "riskScore": 71,
        "factors": {
            "sanitation": 55,
            "waterQuality": 50,
            "crowding": 84,
            "ventilation": 60,
            "reportedCases": 9,
            "vaccination": 65,
        },
    },
    {
        "id": "z4",
        "name": "College of Health Sciences",
        "category": "academic",
        "lat": CENTER["lat"] - 0.002,
        "lng": CENTER["lng"] + 0.002,
        "population": 950,
        "riskScore": 38,
        "factors": {
            "sanitation": 78,
            "waterQuality": 80,
            "crowding": 45,
            "ventilation": 75,
            "reportedCases": 2,
            "vaccination": 88,
        },
    },
    {
        "id": "z5",
        "name": "Engineering Faculty",
        "category": "academic",
        "lat": CENTER["lat"] - 0.003,
        "lng": CENTER["lng"] - 0.002,
        "population": 1100,
        "riskScore": 46,
        "factors": {
            "sanitation": 70,
            "waterQuality": 72,
            "crowding": 60,
            "ventilation": 65,
            "reportedCases": 3,
            "vaccination": 78,
        },
    },
    {
        "id": "z6",
        "name": "Student Health Clinic",
        "category": "clinic",
        "lat": CENTER["lat"],
        "lng": CENTER["lng"] - 0.0015,
        "population": 220,
        "riskScore": 52,
        "factors": {
            "sanitation": 82,
            "waterQuality": 85,
            "crowding": 55,
            "ventilation": 78,
            "reportedCases": 18,
            "vaccination": 92,
        },
    },
    {
        "id": "z7",
        "name": "Staff Housing East",
        "category": "staff",
        "lat": CENTER["lat"] + 0.0055,
        "lng": CENTER["lng"] + 0.006,
        "population": 410,
        "riskScore": 31,
        "factors": {
            "sanitation": 80,
            "waterQuality": 78,
            "crowding": 38,
            "ventilation": 72,
            "reportedCases": 1,
            "vaccination": 82,
        },
    },
    {
        "id": "z8",
        "name": "Sports Complex",
        "category": "public",
        "lat": CENTER["lat"] - 0.005,
        "lng": CENTER["lng"] + 0.005,
        "population": 600,
        "riskScore": 42,
        "factors": {
            "sanitation": 65,
            "waterQuality": 70,
            "crowding": 58,
            "ventilation": 90,
            "reportedCases": 2,
            "vaccination": 74,
        },
    },
    {
        "id": "z9",
        "name": "Library Complex",
        "category": "academic",
        "lat": CENTER["lat"] + 0.0015,
        "lng": CENTER["lng"] - 0.004,
        "population": 700,
        "riskScore": 49,
        "factors": {
            "sanitation": 72,
            "waterQuality": 75,
            "crowding": 70,
            "ventilation": 55,
            "reportedCases": 3,
            "vaccination": 76,
        },
    },
    {
        "id": "z10",
        "name": "Block 7 Dormitory",
        "category": "dorm",
        "lat": CENTER["lat"] - 0.001,
        "lng": CENTER["lng"] - 0.005,
        "population": 690,
        "riskScore": 81,
        "factors": {
            "sanitation": 38,
            "waterQuality": 48,
            "crowding": 92,
            "ventilation": 35,
            "reportedCases": 14,
            "vaccination": 58,
        },
    },
]

FACTOR_LABELS = {
    "sanitation": "Low sanitation",
    "waterQuality": "Poor water quality",
    "crowding": "Overcrowding",
    "ventilation": "Poor ventilation",
    "reportedCases": "Recent cases",
    "vaccination": "Low vaccination",
}

FACTOR_DIRECTIONS = {
    "sanitation": "lower",
    "waterQuality": "lower",
    "crowding": "higher",
    "ventilation": "lower",
    "reportedCases": "higher",
    "vaccination": "lower",
}


def risk_level(score: int) -> RiskLevel:
    if score >= 75:
        return "critical"
    if score >= 55:
        return "high"
    if score >= 35:
        return "moderate"
    return "low"


def top_risks(zone: dict) -> list[str]:
    severities: list[tuple[int, str]] = []
    for factor_name, value in zone["factors"].items():
        severity = value if FACTOR_DIRECTIONS[factor_name] == "higher" else 100 - value
        severities.append((severity, FACTOR_LABELS[factor_name]))
    severities.sort(reverse=True)
    return [label for _, label in severities[:3]]


def zone_payload(zone: dict) -> dict:
    return {
        **zone,
        "riskLevel": risk_level(zone["riskScore"]),
        "topRisks": top_risks(zone),
    }


def all_zones() -> list[dict]:
    return [zone_payload(zone) for zone in RAW_ZONES]


def trend_points() -> list[dict]:
    start = date.today() - timedelta(days=13)
    points: list[dict] = []
    for index in range(14):
        risk = round(48 + (math.sin(index / 2) * 8) + index * 0.6)
        cases = max(0, round(4 + (math.sin(index / 1.5) * 3) + index * 0.4))
        points.append(
            {
                "date": (start + timedelta(days=index)).strftime("%b %d"),
                "risk": risk,
                "cases": cases,
            }
        )
    return points


@app.get("/")
def home() -> dict:
    return {"message": "Backend is working"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/zones")
def get_zones() -> list[dict]:
    return all_zones()


@app.get("/api/stats")
def get_stats() -> dict:
    zones = all_zones()
    return {
        "totalPopulation": sum(zone["population"] for zone in zones),
        "averageRisk": round(mean(zone["riskScore"] for zone in zones)),
        "highRiskZones": sum(1 for zone in zones if zone["riskScore"] >= 55),
        "activeAlerts": 4,
    }


@app.get("/api/trend")
def get_trend() -> list[dict]:
    return trend_points()


@app.get("/api/factors")
def get_factors() -> list[dict]:
    return [
        {"factor": "Overcrowding", "impact": 28},
        {"factor": "Sanitation", "impact": 22},
        {"factor": "Water Quality", "impact": 18},
        {"factor": "Ventilation", "impact": 14},
        {"factor": "Vaccination Gap", "impact": 11},
        {"factor": "Recent Cases", "impact": 7},
    ]


@app.get("/api/predict/{zone_id}")
def predict(zone_id: str) -> dict:
    zone = next((item for item in RAW_ZONES if item["id"] == zone_id), None)
    if zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")

    predicted_risk = min(100, zone["riskScore"] + 6)
    confidence = round(
        min(
            0.97,
            0.72
            + (zone["factors"]["reportedCases"] * 0.008)
            + (zone["factors"]["crowding"] / 1000),
        ),
        2,
    )

    return {
        "zoneId": zone_id,
        "predictedRisk": predicted_risk,
        "horizonDays": 14,
        "confidence": confidence,
    }
