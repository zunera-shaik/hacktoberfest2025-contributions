import React from "react";
import { calendarAppointments } from "../data/appointments";

export default function CalendarView() {
  return (
    <div className="calendar-view">
      <h3>October 2021</h3>
      <div className="calendar-grid">
        {[...Array(30)].map((_, i) => {
          const date = `2021-10-${String(i + 1).padStart(2, "0")}`;
          const dayAppointments = calendarAppointments.filter(
            (app) => app.date === date
          );
          return (
            <div key={i} className="calendar-day">
              <span>{i + 1}</span>
              {dayAppointments.map((app, idx) => (
                <div key={idx} className="calendar-event">
                  {app.time}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
