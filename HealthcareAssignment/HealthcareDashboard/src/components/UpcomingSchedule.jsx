import React from "react";
import { upcoming } from "../data/appointments";
import SimpleAppointmentCard from "./SimpleAppointmentCard";

export default function UpcomingSchedule() {
  return (
    <div className="upcoming-schedule">
      <h3>The Upcoming Schedule</h3>
      <div className="appointments-list">
        {upcoming.map((item, idx) => (
          <SimpleAppointmentCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}
