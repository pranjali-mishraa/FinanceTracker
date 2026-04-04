export const theme = {
  gradient: {
    primary: "bg-gradient-to-r from-orange-400 via-pink-300 to-orange-300",
    sidebar: "bg-gradient-to-b from-orange-500 via-orange-400 to-pink-400",
    card:    "bg-gradient-to-br from-orange-100 via-pink-50 to-orange-50",
    hero:    "bg-gradient-to-br from-orange-500 via-pink-400 to-orange-300",
    button:  "bg-gradient-to-r from-orange-500 to-pink-500",
    header:  "bg-gradient-to-r from-orange-400/90 via-pink-300/80 to-orange-200/90",
    warm:    "bg-gradient-to-br from-amber-400 via-orange-400 to-pink-400",
  },
  text: {
    primary: "text-orange-950",
    secondary: "text-orange-700",
    muted:   "text-orange-400",
    light:   "text-orange-100",
    white:   "text-white",
    heading: "text-orange-950",
  },
  border: {
    default: "border border-orange-200/60",
    card:    "border border-orange-100/80",
    input:   "border border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200",
  },
  bg: {
    page:  "mesh-bg",
    hover: "hover:bg-orange-50/80",
    input: "bg-white/60",
    tag: {
      income:  "bg-emerald-100 text-emerald-700",
      expense: "bg-rose-100 text-rose-600",
    },
  },
  shadow: {
    card:   "shadow-lg shadow-orange-100/80",
    button: "shadow-lg shadow-orange-300/40",
    modal:  "shadow-2xl shadow-orange-900/20",
  },
  button: {
    primary:   "btn-glow text-white font-semibold px-5 py-2.5 rounded-2xl text-sm tracking-wide",
    secondary: "bg-white/80 text-orange-700 border border-orange-200 font-semibold px-5 py-2.5 rounded-2xl text-sm hover:bg-orange-50 transition-all duration-200",
    danger:    "bg-rose-50 text-rose-600 border border-rose-200 font-semibold px-5 py-2.5 rounded-2xl text-sm hover:bg-rose-100 transition-all duration-200",
    icon:      "p-2 rounded-xl hover:bg-orange-100 text-orange-500 transition-all duration-200 hover:scale-110",
  },
  card: {
    base:     "glass p-6",
    gradient: "rounded-2xl p-6 bg-gradient-to-br from-orange-50/80 via-pink-50/60 to-orange-50/80 border border-orange-100/80 shadow-lg shadow-orange-100/60",
  },
  input: {
    base:   "w-full rounded-2xl bg-white/60 border border-orange-200 px-4 py-2.5 text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 backdrop-blur-sm",
    select: "w-full rounded-2xl bg-white/60 border border-orange-200 px-4 py-2.5 text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 backdrop-blur-sm",
  },
  badge: {
    income:   "px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 tracking-wide",
    expense:  "px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-600 tracking-wide",
    category: "px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 border border-orange-200/60",
  },
  chart: {
    colors:  ["#f97316","#f472b6","#fbbf24","#fb923c","#e879f9","#34d399","#60a5fa"],
    income:  "#34d399",
    expense: "#fb7185",
    grid:    "#fed7aa50",
    tooltip: { bg: "#fff7ed", border: "#fdba74", text: "#7c2d12" },
  },
};