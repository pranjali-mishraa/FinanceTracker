import SummaryCards           from "../components/dashboard/SummaryCards";
import BalanceTrendChart      from "../components/dashboard/BalanceTrendChart";
import SpendingBreakdownChart from "../components/dashboard/SpendingBreakdownChart";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto px-2">

      <div className="fade-up">
        <h1 className="font-display text-3xl font-bold grad-text leading-tight">
          Dashboard
        </h1>
        <p className="text-orange-400 text-sm mt-2 font-medium text-center" style={{ fontWeight: 800 }}>
          Your complete financial overview at a glance 📊
        </p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

    </div>
  );
}