import { theme } from "../theme";
import SummaryCards from "../components/dashboard/SummaryCards";
import BalanceTrendChart from "../components/dashboard/BalanceTrendChart";
import SpendingBreakdownChart from "../components/dashboard/SpendingBreakdownChart";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Title ─────────────────────────────────────── */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.text.heading}`}>
          Dashboard 📊
        </h1>
        <p className={`text-sm ${theme.text.muted} mt-1`}>
          Your financial overview at a glance
        </p>
      </div>

      {/* ── Summary Cards ──────────────────────────────────── */}
      <SummaryCards />

      {/* ── Charts row — stack on mobile, side by side on lg ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

    </div>
  );
}