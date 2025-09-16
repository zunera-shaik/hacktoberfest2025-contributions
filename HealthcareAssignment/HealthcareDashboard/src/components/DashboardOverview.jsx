import React from "react";
import AnatomySection from "./AnatomySection";
import HealthStatusCards from "./HealthStatusCards";

export default function DashboardOverview() {
  return (
    <section className="dashboard-overview">
      <AnatomySection />
      <HealthStatusCards />
    </section>
  );
}
