import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } from "recharts";
  import { useAppState } from "../../context/AppContext";
  import { theme } from "../../theme";
  
  // ── Custom Tooltip UI ─────────────────────────────────────────
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
  
    const fmt = (v) =>
      new Intl.NumberFormat("en-IN", {
        style:    "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(v);
  
    return (
      <div
        className="rounded-2xl p-4 shadow-xl border border-orange-200"
        style={{ background: theme.chart.tooltip.bg }}
      >
        <p className="font-bold text-orange-900 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ background: entry.color }}
            />
            <span className="text-orange-700 capitalize">{entry.name}:</span>
            <span className="font-semibold text-orange-900">
              {fmt(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  export default function BalanceTrendChart() {
    // monthlyData is already computed in context via useMemo —
    // it auto-updates the moment any transaction is added/edited
    const { monthlyData } = useAppState();
  
    if (!monthlyData.length) {
      return (
        <div className={`${theme.card.base} flex items-center justify-center h-64`}>
          <p className={theme.text.muted}>No data to display</p>
        </div>
      );
    }
  
    return (
      <div className={theme.card.base}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-base font-bold ${theme.text.heading}`}>
              Balance Trend
            </h2>
            <p className={`text-xs ${theme.text.muted} mt-0.5`}>
              Monthly income vs expenses
            </p>
          </div>
          <span className="text-2xl">📉</span>
        </div>
  
        {/* Chart — ResponsiveContainer fills parent width automatically */}
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={monthlyData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            {/* Gradient fills for the areas */}
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f87171" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}   />
              </linearGradient>
            </defs>
  
            <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
  
            <XAxis
              dataKey="month"
              tick={{ fill: "#c2410c", fontSize: 12 }}
              axisLine={{ stroke: "#fed7aa" }}
              tickLine={false}
            />
  
            <YAxis
              tick={{ fill: "#c2410c", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              // Format y-axis as ₹ shorthand
              tickFormatter={(v) =>
                v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
              }
            />
  
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "13px", color: "#9a3412" }}
            />
  
            {/* Income area — green */}
            <Area
              type="monotone"
              dataKey="income"
              stroke={theme.chart.income}
              strokeWidth={2.5}
              fill="url(#incomeGrad)"
              dot={{ fill: "#4ade80", r: 4 }}
              activeDot={{ r: 6 }}
            />
  
            {/* Expense area — red */}
            <Area
              type="monotone"
              dataKey="expense"
              stroke={theme.chart.expense}
              strokeWidth={2.5}
              fill="url(#expenseGrad)"
              dot={{ fill: "#f87171", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }