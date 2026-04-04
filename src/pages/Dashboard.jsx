import SummaryCards           from "../components/dashboard/SummaryCards";
import BalanceTrendChart      from "../components/dashboard/BalanceTrendChart";
import SpendingBreakdownChart from "../components/dashboard/SpendingBreakdownChart";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-7 max-w-7xl mx-auto">

      <div className="fade-up">
        <h1 className="font-display text-4xl font-bold grad-text leading-tight">
          Dashboard
        </h1>
        <p className="text-orange-400  text-center mt-1.5 font-bolder">
          Your complete financial overview at a glance 📊
        </p>
      </div>

      {/* Cards — mb-4 gives breathing room before charts */}
      <div className="mb-4">
        <SummaryCards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

    </div>
  );
}