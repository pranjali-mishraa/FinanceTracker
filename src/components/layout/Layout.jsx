import { useAppState } from "../../context/AppContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const { darkMode } = useAppState();

  return (
    // dark class on root div enables Tailwind dark: variants globally
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-orange-50 dark:bg-gray-950 flex">

        {/* ── Sidebar (hidden on mobile) ───────────────────── */}
        <Sidebar />

        {/* ── Main content area ────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header />

          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}