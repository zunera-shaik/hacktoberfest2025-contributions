import React from "react";

export default function ActivityFeed() {
  return (
    <div className="activity-feed">
      <h3>Activity</h3>
      <p>3 appointments on this week</p>
      <div className="bar-chart">
        {[30, 50, 70, 20, 40, 60, 80].map((val, i) => (
          <div key={i} className="bar" style={{ height: `${val}px` }}></div>
        ))}
      </div>
    </div>
  );
}
