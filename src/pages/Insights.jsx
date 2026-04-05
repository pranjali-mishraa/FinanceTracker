import InsightsPanel from "../components/insights/insightsPanel";

export default function Insights() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="fade-up">
        <h1 className="font-display text-3xl font-bold grad-text leading-tight">
          Insights
        </h1>
        <p className="text-orange-400 text-sm mt-1.5 font-medium">
          Smart observations from your financial data 💡
        </p>
      </div>

      <InsightsPanel />
    </div>
  );
}