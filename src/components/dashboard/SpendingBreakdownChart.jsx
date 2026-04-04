import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from "recharts";
import { useAppState } from "../../context/AppContext";
import { CATEGORY_ICONS } from "../../data/mockData";
import { theme } from "../../theme";

const fmt = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(v);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { category, amount } = payload[0].payload;
  return (
    <div className="glass rounded-2xl p-3.5 shadow-xl text-sm">
      <p className="font-bold text-orange-900 mb-1">
        {CATEGORY_ICONS[category]} {category}
      </p>
      <p className="text-orange-600 font-semibold">{fmt(amount)}</p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-4 px-4">
    {payload.map((entry) => (
      <div key={entry.value} className="flex items-center gap-4 text-xs font-semibold text-orange-700">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: entry.color }}
        />
        <span>{CATEGORY_ICONS[entry.value]}</span>
        <span>{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function SpendingBreakdownChart() {
  const { categoryData } = useAppState();

  if (!categoryData.length) {
    return (
      <div className="glass rounded-3xl p-6 flex items-center justify-center h-80">
        <p className="text-orange-300 text-sm">No expense data yet</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 fade-up-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-orange-950">
            Spending Breakdown
          </h2>
          <p className="text-orange-400 text-xs mt-1 font-medium">
            Expenses by category
          </p>
        </div>
        
      </div>

      {/* Chart — NO Legend inside */}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="amount"
            nameKey="category"
            cx="50%" cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={3}
            stroke="none"
          >
            {categoryData.map((_, i) => (
              <Cell key={i} fill={theme.chart.colors[i % theme.chart.colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Manual legend — full control over spacing */}
      <div
        style={{
          display:        "flex",
          flexWrap:       "wrap",
          justifyContent: "center",
          gap:            "12px 24px",
          marginTop:      "20px",
          padding:        "0 8px",
        }}
      >
        {categoryData.map((entry, i) => (
          <div
            key={entry.category}
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "8px",
              fontSize:   "20px",
              fontWeight: "600",
              color:      "#9a3412",
            }}
          >
            <span
              style={{
                width:        "10px",
                height:       "10px",
                borderRadius: "50%",
                background:   theme.chart.colors[i % theme.chart.colors.length],
                flexShrink:   0,
              }}
            />
            <span>{CATEGORY_ICONS[entry.category]}</span>
            <span>{entry.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}