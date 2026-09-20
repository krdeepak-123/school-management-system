import { useState, useEffect } from "react";
import { getMyTimetable } from "../../services/timetableService";
import styles from "./studentStyles";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyTimetable()
      .then((data) => setTimetable(data || []))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load your timetable")
      )
      .finally(() => setLoading(false));
  }, []);

  const days = DAY_ORDER.filter((d) =>
    timetable.some((t) => t.day === d)
  );

  return (
    <div>
      <h1 style={styles.heading}>🕐 My Timetable</h1>
      <p style={styles.sub}>Weekly class schedule for your class.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : days.length === 0 ? (
        <div style={styles.section}>
          <p style={styles.empty}>No timetable published for your class yet.</p>
        </div>
      ) : (
        days.map((day) => {
          const dayEntry = timetable.find((t) => t.day === day);
          return (
            <div style={styles.section} key={day}>
              <h2 style={styles.sectionTitle}>{day}</h2>

              {!dayEntry?.periods?.length ? (
                <p style={styles.empty}>No periods scheduled.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Subject</th>
                      <th>Teacher</th>
                      <th>Time</th>
                      <th>Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayEntry.periods.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.period}</td>
                        <td>{p.subject || "-"}</td>
                        <td>{p.teacher || "-"}</td>
                        <td>
                          {p.startTime || p.endTime
                            ? `${p.startTime || ""} - ${p.endTime || ""}`
                            : "-"}
                        </td>
                        <td>{p.room || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
