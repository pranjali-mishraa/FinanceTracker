import { theme } from "../theme";
import InsightsPanel from "../components/insights/insightsPanel";

export default function Insights() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text.heading}`}>
          Insights 💡
        </h1>
        <p className={`text-sm ${theme.text.muted} mt-1`}>
          Smart observations from your financial data
        </p>
      </div>

      <InsightsPanel />
    </div>
  );
}