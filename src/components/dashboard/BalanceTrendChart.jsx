import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { useAppState } from "../../context/AppContext";
import { theme } from "../../theme";

const fmt = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-2xl p-4 shadow-xl text-sm min-w-[160px]">
      <p className="font-display font-bold text-orange-900 mb-3 text-base">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-orange-700 capitalize font-medium">{entry.name}</span>
          </div>
          <span className="font-bold text-orange-950">{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrendChart() {
  const { monthlyData } = useAppState();

  if (!monthlyData.length) {
    return (
      <div className="glass rounded-3xl p-6 flex items-center justify-center h-80">
        <p className="text-orange-300 text-sm">No data to display</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 fade-up-2">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-orange-950">
            Balance Trend
          </h2>
          <p className="text-orange-400 text-xs mt-1 font-medium">
            Monthly income vs expenses overview
          </p>
        </div>
        
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#34d399" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#fb7185" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa30" />
          <XAxis dataKey="month"
            tick={{ fill: "#c2410c", fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: "#fed7aa50" }} tickLine={false} />
          <YAxis
            tick={{ fill: "#c2410c", fontSize: 11 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", color: "#9a3412", fontWeight: 600 }} />
          <Area type="monotone" dataKey="income" stroke="#34d399" strokeWidth={3}
            fill="url(#incomeGrad)" dot={{ fill: "#34d399", r: 4, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff" }} />
          <Area type="monotone" dataKey="expense" stroke="#fb7185" strokeWidth={3}
            fill="url(#expenseGrad)" dot={{ fill: "#fb7185", r: 4, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: "#fff" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}