import { useState, useEffect } from "react";
import { getMyTeacherClasses } from "../../services/classService";
import { getTimetables } from "../../services/timetableService";
import styles from "./teacherStyles";

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
  const [classes, setClasses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMyTeacherClasses(), getTimetables()])
      .then(([classData, ttData]) => {
        setClasses(classData || []);
        setTimetable(ttData || []);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load the timetable")
      )
      .finally(() => setLoading(false));
  }, []);

  // Timetable entries for the teacher's assigned classes
  const myClassKeys = classes.map(
    (c) => `${c.className}`.toUpperCase() + (c.section ? `-${c.section}`.toUpperCase() : "")
  );

  const myEntries = timetable.filter((t) => {
    const key = `${t.className}`.toUpperCase() + (t.section ? `-${t.section}`.toUpperCase() : "");
    return myClassKeys.includes(key);
  });

  const days = DAY_ORDER.filter((d) => myEntries.some((t) => t.day === d));

  // Periods where this teacher appears
  const teacherName = classes[0]?.classTeacher || "";

  return (
    <div>
      <h1 style={styles.heading}>🕐 Timetable</h1>
      <p style={styles.sub}>Weekly schedule for your assigned classes.</p>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : days.length === 0 ? (
        <div style={styles.section}>
          <p style={styles.empty}>No timetable published for your classes yet.</p>
        </div>
      ) : (
        days.map((day) => {
          const dayEntries = myEntries.filter((t) => t.day === day);
          return (
            <div style={styles.section} key={day}>
              <h2 style={styles.sectionTitle}>{day}</h2>

              {dayEntries.length === 0 ? (
                <p style={styles.empty}>No periods scheduled.</p>
              ) : (
                dayEntries.map((t) => (
                  <div key={t._id} style={{ marginBottom: "14px" }}>
                    <strong style={{ color: "#334155" }}>
                      {t.className}
                      {t.section ? ` - Section ${t.section}` : ""}
                    </strong>
                    {!t.periods?.length ? (
                      <p style={styles.empty}>No periods.</p>
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
                          {t.periods.map((p, idx) => (
                            <tr
                              key={idx}
                              style={
                                teacherName &&
                                p.teacher?.toLowerCase() === teacherName.toLowerCase()
                                  ? { background: "#eff6ff" }
                                : {}
                              }
                            >
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
                ))
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
