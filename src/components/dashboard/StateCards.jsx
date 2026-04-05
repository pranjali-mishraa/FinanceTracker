import { useAppState } from "../../context/AppContext";

export default function StatCard({ label, value, icon, iconBg, badge, badgeUp }) {
  const { darkMode } = useAppState();

  return (
    <div
      className="insight-card cursor-default"
      style={{
        background:     darkMode ? "#252525" : "rgba(255,255,255,0.9)",
        border:         darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(249,115,22,0.1)",
        boxShadow:      darkMode ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 20px rgba(249,115,22,0.07)",
        borderRadius:   "24px",
        padding:        "28px 24px",
        height:         "160px",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "space-between",
        transition:     "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = darkMode
          ? "0 16px 40px rgba(0,0,0,0.4)"
          : "0 16px 40px rgba(249,115,22,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = darkMode
          ? "0 4px 16px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(249,115,22,0.07)";
      }}
    >
      {/* Top — icon + label + badge */}
      <div className="flex flex-col gap-3">
        <div style={{
          width: "44px", height: "44px", borderRadius: "14px",
          background: darkMode ? "rgba(255,255,255,0.08)" : iconBg,
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "22px",
        }}>
          {icon}
        </div>

        <div className="flex items-center gap-2">
          <span style={{
            fontSize: "13px", fontWeight: "600", letterSpacing: "0.01em",
            color: darkMode ? "#909090" : "#9a7060",
          }}>
            {label}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "3px 10px", borderRadius: "99px",
            fontSize: "11px", fontWeight: "700",
            background: badgeUp
              ? darkMode ? "rgba(16,185,129,0.15)" : "#f0fdf4"
              : darkMode ? "rgba(244,63,94,0.15)"  : "#fff1f2",
            color:  badgeUp ? "#34d399" : "#fb7185",
            border: badgeUp
              ? "1px solid rgba(16,185,129,0.25)"
              : "1px solid rgba(244,63,94,0.25)",
          }}>
            {badge}
          </span>
        </div>
      </div>

      <span
  style={{
    fontSize:      "28px",
    fontWeight:    "800",
    letterSpacing: "-0.02em",
    lineHeight:    "1",
    fontFamily:    "'DM Sans', sans-serif",
    color:         darkMode ? "#f0f0f0" : "#1a0a00",
  }}
>
  {value}
</span>
    </div>
  );
}