import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
  } from "recharts";
  import { useAppState } from "../../context/AppContext";
  import { CATEGORY_ICONS } from "../../data/mockData";
  import { theme } from "../../theme";
  
  // ── Custom Tooltip ────────────────────────────────────────────
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { category, amount } = payload[0].payload;
    const fmt = (v) =>
      new Intl.NumberFormat("en-IN", {
        style:    "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(v);
  
    return (
      <div
        className="rounded-2xl p-3 shadow-xl border border-orange-200 text-sm"
        style={{ background: theme.chart.tooltip.bg }}
      >
        <p className="font-bold text-orange-900">
          {CATEGORY_ICONS[category]} {category}
        </p>
        <p className="text-orange-700 mt-1">
          Amount: <span className="font-semibold">{fmt(amount)}</span>
        </p>
      </div>
    );
  };
  
  // ── Custom Legend ─────────────────────────────────────────────
  const CustomLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-xs">
          <span
            className="w-3 h-3 rounded-full inline-block flex-shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-orange-800">
            {CATEGORY_ICONS[entry.value]} {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
  
  export default function SpendingBreakdownChart() {
    const { categoryData } = useAppState();
  
    if (!categoryData.length) {
      return (
        <div className={`${theme.card.base} flex items-center justify-center h-64`}>
          <p className={theme.text.muted}>No expense data yet</p>
        </div>
      );
    }
  
    return (
      <div className={theme.card.base}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-base font-bold ${theme.text.heading}`}>
              Spending Breakdown
            </h2>
            <p className={`text-xs ${theme.text.muted} mt-0.5`}>
              Expenses by category
            </p>
          </div>
          <span className="text-2xl">🥧</span>
        </div>
  
        {/* Donut Chart */}
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={65}   // donut hole
              outerRadius={100}
              paddingAngle={3}
              stroke="none"
            >
              {categoryData.map((_, index) => (
                <Cell
                  key={index}
                  fill={theme.chart.colors[index % theme.chart.colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }