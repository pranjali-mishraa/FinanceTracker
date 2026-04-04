import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/",             label: "Dashboard",    icon: "📊", sub: "Overview" },
  { path: "/transactions", label: "Transactions", icon: "💳", sub: "History"  },
  { path: "/insights",     label: "Insights",     icon: "💡", sub: "Analytics"},
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-72 min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #ea580c 0%, #f97316 35%, #ec4899 100%)",
        boxShadow: "4px 0 40px rgba(234,88,12,0.25)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
      <div className="absolute bottom-20 -left-12 w-36 h-36 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

      {/* Brand */}
      <div className="px-7 py-8 relative z-10">
        <div className="flex items-center gap-3.5 mb-1">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)",
                     boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.1)" }}>
            🪙
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white tracking-tight leading-none">
              FinTrack
            </h1>
            <p className="text-white/60 text-xs mt-0.5 font-medium tracking-wider uppercase">
              Finance Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-7 h-px bg-white/20 mb-6" />

      {/* Nav */}
      <nav className="flex-1 px-5 flex flex-col gap-2 relative z-10">
        <p className="text-white/40 text-xs font-bold tracking-widest uppercase px-3 mb-2">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => `
              group flex items-center gap-4 px-4 py-3.5 rounded-2xl
              font-medium text-sm transition-all duration-300
              ${isActive
                ? "bg-white/25 text-white shadow-lg shadow-black/10 scale-[1.02]"
                : "text-white/75 hover:bg-white/15 hover:text-white hover:scale-[1.01]"}
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`
                  w-9 h-9 rounded-xl flex items-center justify-center text-lg
                  transition-all duration-300
                  ${isActive
                    ? "bg-white/30 shadow-inner"
                    : "bg-white/10 group-hover:bg-white/20"}
                `}>
                  {item.icon}
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm leading-tight">{item.label}</span>
                  <span className="text-white/50 text-xs">{item.sub}</span>
                </div>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white pulse-dot" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-7 py-6 relative z-10">
        <div className="h-px bg-white/20 mb-5" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm">
            ✨
          </div>
          <div>
            <p className="text-white/80 text-xs font-semibold">FinTrack v1.0</p>
            <p className="text-white/40 text-xs">© 2025 · All rights reserved</p>
          </div>
        </div>
      </div>
    </aside>
  );
}