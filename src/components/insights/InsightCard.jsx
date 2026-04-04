export default function InsightCard({ title, children }) {
  return (
    <div
      style={{
        background:     "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        border:         "1px solid rgba(249,115,22,0.1)",
        boxShadow:      "0 4px 20px rgba(249,115,22,0.07), 0 1px 3px rgba(0,0,0,0.04)",
        borderRadius:   "20px",
        padding:        "18px 20px",
        display:        "flex",
        flexDirection:  "column",
        gap:            "10px",
        width:          "100%",
        minHeight:      "150px",
        transition:     "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(249,115,22,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.07)";
      }}
    >
      {/* Title only — no icon */}
      <span style={{
        fontSize:      "11px",
        fontWeight:    "700",
        color:         "#c2855a",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}>
        {title}
      </span>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(249,115,22,0.08)" }} />

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1 justify-center">
        {children}
      </div>
    </div>
  );
}