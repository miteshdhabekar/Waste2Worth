import React, { useState, useEffect } from "react";
import axios from "axios";

// Lightweight GitHub-style calendar heatmap (no external dep needed)
const COLORS = ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];

const getColor = (count) => {
  if (!count || count === 0) return COLORS[0];
  if (count <= 1) return COLORS[1];
  if (count <= 3) return COLORS[2];
  if (count <= 6) return COLORS[3];
  return COLORS[4];
};

const getDaysArray = () => {
  const days = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","","Wed","","Fri",""];

const DonationCalendar = () => {
  const [dataMap, setDataMap]   = useState({});
  const [loading, setLoading]   = useState(true);
  const [tooltip, setTooltip]   = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/admin/report/calendar")
      .then((res) => {
        const map = {};
        (res.data || []).forEach((item) => { map[item.date] = item.count; });
        setDataMap(map);
      })
      .catch((err) => console.error("Calendar fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const allDays = getDaysArray();

  // Group into weeks (columns), padding the first week
  const firstDayOfWeek = new Date(allDays[0]).getDay();
  const paddedDays = [...Array(firstDayOfWeek).fill(null), ...allDays];
  const weeks = [];
  for (let i = 0; i < paddedDays.length; i += 7) weeks.push(paddedDays.slice(i, i + 7));

  // Build month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstReal = week.find(Boolean);
    if (firstReal) {
      const m = new Date(firstReal).getMonth();
      if (m !== lastMonth) { monthLabels.push({ wi, label: MONTHS[m] }); lastMonth = m; }
    }
  });

  const totalDonations = Object.values(dataMap).reduce((a, b) => a + Number(b), 0);
  const activeDays = Object.keys(dataMap).length;

  if (loading) return (
    <div style={{ textAlign: "center", padding: "3rem", color: "#2d6a4f" }}>⏳ Loading calendar…</div>
  );

  return (
    <div style={{ padding: "1rem 0" }}>
      <h3 style={{ color: "#1b4332", fontWeight: 700, marginBottom: "0.5rem" }}>📅 Donation Activity — Last 12 Months</h3>
      <p style={{ color: "#555", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        <strong style={{ color: "#1b4332" }}>{totalDonations}</strong> total donations across&nbsp;
        <strong style={{ color: "#1b4332" }}>{activeDays}</strong> active days
      </p>

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "inline-block", minWidth: 700 }}>
          {/* Month labels */}
          <div style={{ display: "flex", marginLeft: 28, marginBottom: 4 }}>
            {weeks.map((_, wi) => {
              const label = monthLabels.find((m) => m.wi === wi);
              return (
                <div key={wi} style={{ width: 13, marginRight: 2, fontSize: "0.7rem", color: "#666", whiteSpace: "nowrap" }}>
                  {label ? label.label : ""}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex" }}>
            {/* Day-of-week labels */}
            <div style={{ display: "flex", flexDirection: "column", marginRight: 4 }}>
              {DAYS.map((d, i) => (
                <div key={i} style={{ height: 13, marginBottom: 2, fontSize: "0.65rem", color: "#666", lineHeight: "13px", width: 24, textAlign: "right", paddingRight: 2 }}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", marginRight: 2 }}>
                {week.map((day, di) => {
                  const count = day ? (dataMap[day] || 0) : null;
                  return (
                    <div
                      key={di}
                      onMouseEnter={(e) => day && setTooltip({ day, count, x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        width: 13, height: 13, marginBottom: 2, borderRadius: 2,
                        background: day ? getColor(count) : "transparent",
                        cursor: day ? "pointer" : "default",
                        border: day ? "1px solid rgba(0,0,0,0.06)" : "none",
                        transition: "transform 0.1s",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, marginLeft: 28 }}>
            <span style={{ fontSize: "0.75rem", color: "#666" }}>Less</span>
            {COLORS.map((c, i) => (
              <div key={i} style={{ width: 13, height: 13, background: c, borderRadius: 2, border: "1px solid rgba(0,0,0,0.08)" }} />
            ))}
            <span style={{ fontSize: "0.75rem", color: "#666" }}>More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed", top: tooltip.y - 48, left: tooltip.x - 60,
          background: "#1b4332", color: "#fff", padding: "0.4rem 0.8rem",
          borderRadius: 6, fontSize: "0.8rem", pointerEvents: "none", zIndex: 9999,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}>
          <strong>{tooltip.count}</strong> donation{tooltip.count !== 1 ? "s" : ""} on {tooltip.day}
        </div>
      )}
    </div>
  );
};

export default DonationCalendar;
