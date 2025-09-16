import React from "react";
import { healthIndicators } from "../data/healthData";

export default function HealthStatusCards() {
  return (
    <div className="health-cards">
      {healthIndicators.map((item, index) => (
        <div key={index} className={`health-card ${item.color}`}>
          <h4>{item.organ}</h4>
          <p>Status: {item.status}</p>
        </div>
      ))}
    </div>
  );
}
