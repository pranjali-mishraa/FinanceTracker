export default function StatCard({ label, value, icon, iconBg, badge, badgeUp }) {
    return (
      <div
        className="cursor-default"
        style={{
          background:     "rgba(255,255,255,0.9)",
          backdropFilter: "blur(16px)",
          border:         "1px solid rgba(249,115,22,0.1)",
          boxShadow:      "0 4px 20px rgba(249,115,22,0.07), 0 1px 3px rgba(0,0,0,0.04)",
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
          e.currentTarget.style.boxShadow =
            "0 16px 40px rgba(249,115,22,0.13), 0 2px 8px rgba(0,0,0,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 20px rgba(249,115,22,0.07), 0 1px 3px rgba(0,0,0,0.04)";
        }}
      >
        {/* Top — icon + label + badge */}
        <div className="flex flex-col gap-3">
          <div style={{
            width: "44px", height: "44px",
            borderRadius: "14px",
            background: iconBg,
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "22px",
          }}>
            {icon}
          </div>
  
          <div className="flex items-center gap-2">
            <span style={{
              fontSize: "13px", fontWeight: "600",
              color: "#9a7060", letterSpacing: "0.01em",
            }}>
              {label}
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "3px 10px", borderRadius: "99px",
              fontSize: "11px", fontWeight: "700",
              background: badgeUp ? "#f0fdf4" : "#fff1f2",
              color:      badgeUp ? "#16a34a" : "#e11d48",
              border:     badgeUp ? "1px solid #bbf7d0" : "1px solid #fecdd3",
            }}>
              {badge}
            </span>
          </div>
        </div>
  
        {/* Bottom — value */}
        <span
          className="font-display"
          style={{
            fontSize: "clamp(22px, 2.5vw, 30px)",
            fontWeight: "800",
            color: "#1a0a00",
            letterSpacing: "-0.03em",
            lineHeight: "1",
          }}
        >
          {value}
        </span>
      </div>
    );
  }