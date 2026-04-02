export const theme = {
    // --- Gradients ---
    gradient: {
      primary: "bg-gradient-to-r from-orange-300 via-orange-200 to-pink-200",
      sidebar: "bg-gradient-to-b from-orange-400 via-orange-300 to-pink-300",
      card: "bg-gradient-to-br from-orange-100 via-pink-50 to-orange-50",
      hero: "bg-gradient-to-br from-orange-400 via-pink-300 to-orange-200",
      button: "bg-gradient-to-r from-orange-400 to-pink-400",
      badge: "bg-gradient-to-r from-orange-200 to-pink-200",
      header: "bg-gradient-to-r from-orange-300 via-pink-200 to-orange-100",
      chartBg: "bg-gradient-to-b from-orange-50 to-pink-50",
    },
  
    // --- Text ---
    text: {
      primary: "text-orange-900",
      secondary: "text-orange-700",
      muted: "text-orange-400",
      light: "text-orange-100",
      white: "text-white",
      heading: "text-orange-950",
      link: "text-orange-600 hover:text-orange-800",
    },
  
    // --- Borders ---
    border: {
      default: "border border-orange-200",
      strong: "border border-orange-400",
      card: "border border-orange-100",
      input: "border border-orange-300 focus:border-orange-500 focus:ring-orange-300",
    },
  
    // --- Backgrounds ---
    bg: {
      page: "bg-orange-50",
      card: "bg-white/70 backdrop-blur-sm",
      hover: "hover:bg-orange-100",
      activeNav: "bg-white/30",
      modal: "bg-white",
      input: "bg-orange-50",
      tag: {
        income: "bg-green-100 text-green-700",
        expense: "bg-red-100 text-red-700",
      },
    },
  
    // --- Shadows ---
    shadow: {
      card: "shadow-md shadow-orange-100",
      button: "shadow-md shadow-orange-200",
      modal: "shadow-2xl shadow-orange-200",
    },
  
    // --- Buttons ---
    button: {
      primary:
        "bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-orange-200 hover:from-orange-500 hover:to-pink-500 transition-all duration-200",
      secondary:
        "bg-white text-orange-600 border border-orange-300 font-semibold px-4 py-2 rounded-xl hover:bg-orange-50 transition-all duration-200",
      danger:
        "bg-red-100 text-red-600 border border-red-200 font-semibold px-4 py-2 rounded-xl hover:bg-red-200 transition-all duration-200",
      icon: "p-2 rounded-lg hover:bg-orange-100 text-orange-600 transition-all duration-200",
    },
  
    // --- Cards ---
    card: {
      base: "rounded-2xl p-5 bg-white/70 backdrop-blur-sm border border-orange-100 shadow-md shadow-orange-100",
      gradient: "rounded-2xl p-5 bg-gradient-to-br from-orange-100 via-pink-50 to-orange-50 border border-orange-100 shadow-md shadow-orange-100",
    },
  
    // --- Inputs ---
    input: {
      base: "w-full rounded-xl bg-orange-50 border border-orange-300 px-4 py-2 text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all duration-200",
      select: "w-full rounded-xl bg-orange-50 border border-orange-300 px-4 py-2 text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all duration-200",
    },
  
    // --- Badges ---
    badge: {
      income: "px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700",
      expense: "px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700",
      category: "px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800",
    },
  
    // --- Chart colors (for Recharts) ---
    chart: {
      colors: ["#fb923c", "#f9a8d4", "#fbbf24", "#f472b6", "#fdba74", "#fcd34d"],
      income: "#4ade80",
      expense: "#f87171",
      grid: "#fed7aa",
      tooltip: {
        bg: "#fff7ed",
        border: "#fdba74",
        text: "#7c2d12",
      },
    },
  };