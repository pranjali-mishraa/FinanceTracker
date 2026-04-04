import { useMemo } from "react";
import { useAppState } from "../../context/AppContext";
import { CATEGORY_ICONS } from "../../data/mockData";
import { theme } from "../../theme";
import InsightCard from "./InsightCard";
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const fmt = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(v);

  const BarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background:   "#fff7ed",
        border:       "1px solid rgba(249,115,22,0.2)",
        borderRadius: "12px",
        padding:      "10px 14px",
        fontSize:     "12px",
        boxShadow:    "0 4px 12px rgba(249,115,22,0.1)",
        minWidth:     "140px",
      }}>
        <p style={{ fontWeight: "700", color: "#431407", marginBottom: "6px" }}>{label}</p>
        {payload.map((e) => (
          <div key={e.name} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: e.color, flexShrink: 0 }} />
            <span style={{ color: "#9a3412", textTransform: "capitalize" }}>{e.name}:</span>
            <span style={{ fontWeight: "700", color: "#431407" }}>{fmt(e.value)}</span>
          </div>
        ))}
      </div>
    );
  };

const getMonthlyComparison = (monthlyData) => {
  if (monthlyData.length < 2) return null;
  const last = monthlyData[monthlyData.length - 1];
  const prev = monthlyData[monthlyData.length - 2];
  return {
    last, prev,
    expDiff: last.expense - prev.expense,
    incDiff: last.income  - prev.income,
  };
};

const getAvgMonthlyExpense = (monthlyData) => {
  if (!monthlyData.length) return 0;
  return monthlyData.reduce((s, m) => s + m.expense, 0) / monthlyData.length;
};

const getLongestStreak = (transactions) => {
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .map((t)   => new Date(t.date))
    .sort((a, b) => a - b);
  if (expenses.length < 2) return 0;
  let max = 0;
  for (let i = 1; i < expenses.length; i++) {
    const diff = Math.floor((expenses[i] - expenses[i - 1]) / 86400000);
    if (diff > max) max = diff;
  }
  return max;
};

// ── Comparison sub-card (reused for income + expense) ─────────
const ComparisonCard = ({ label, diff, prev, last, prevLabel, lastLabel, positiveIsGood }) => {
  const isGood = positiveIsGood ? diff >= 0 : diff <= 0;
  return (
    <div style={{
      background:    "rgba(255,255,255,0.92)",
      border:        "1px solid rgba(249,115,22,0.1)",
      boxShadow:     "0 4px 20px rgba(249,115,22,0.07)",
      borderRadius:  "20px",
      padding:       "24px",
      display:       "flex",
      flexDirection: "column",
      gap:           "12px",
      minHeight:     "180px",
    }}>
      <span style={{
        fontSize: "11px", fontWeight: "700", color: "#c2855a",
        textTransform: "uppercase", letterSpacing: "0.08em",
      }}>
        {label}
      </span>

      <div style={{ height: "1px", background: "rgba(249,115,22,0.08)" }} />

      {/* Big number */}
      <div className="flex items-end gap-2">
        <span style={{ fontSize: "34px", fontWeight: "800", color: "#1a0a00", lineHeight: 1 }}>
          {diff >= 0 ? "+" : ""}{fmt(diff)}
        </span>
        <span style={{
          fontSize: "22px", fontWeight: "700", marginBottom: "2px",
          color: isGood ? "#16a34a" : "#e11d48",
        }}>
          {isGood ? "↑" : "↓"}
        </span>
      </div>

      {/* From → To */}
      <div style={{
        padding:      "10px 14px",
        borderRadius: "12px",
        background:   isGood ? "#f0fdf4" : "#fff1f2",
        display:      "flex",
        flexDirection:"column",
        gap:          "4px",
      }}>
        <p style={{ fontSize: "12px", color: "#9a7060" }}>
          {prevLabel}: <strong>{fmt(prev)}</strong>
        </p>
        <p style={{ fontSize: "12px", color: "#9a7060" }}>
          {lastLabel}: <strong>{fmt(last)}</strong>
        </p>
      </div>
    </div>
  );
};

export default function InsightsPanel() {
  const {
    transactions, monthlyData, categoryData,
    totalExpenses, totalIncome, topCategory,
  } = useAppState();

  const comparison = useMemo(() => getMonthlyComparison(monthlyData), [monthlyData]);
  const avgExpense  = useMemo(() => getAvgMonthlyExpense(monthlyData), [monthlyData]);
  const streak      = useMemo(() => getLongestStreak(transactions),    [transactions]);
  const savingsRate = totalIncome > 0
    ? ((1 - totalExpenses / totalIncome) * 100).toFixed(1) : 0;

  if (!transactions.length) {
    return (
      <div className="glass rounded-3xl p-12 flex flex-col items-center gap-3">
        <p className="text-orange-300 text-sm">
          No transactions yet. Add some to see insights!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── 2×2 Insight Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">

        <InsightCard title="Top Spending Category">
          <p style={{ fontSize: "24px", fontWeight: "800", color: "#1a0a00", lineHeight: 1.2 }}>
            {topCategory
              ? `${CATEGORY_ICONS[topCategory.category]} ${topCategory.category}`
              : "—"}
          </p>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#ef4444", marginTop: "6px" }}>
            {topCategory ? fmt(topCategory.amount) : "No data"}
          </p>
          <p style={{ fontSize: "12px", color: "#9a7060", marginTop: "2px" }}>
            Highest expense category
          </p>
        </InsightCard>

        <InsightCard title="Savings Rate">
          <p style={{ fontSize: "48px", fontWeight: "800", color: "#1a0a00", lineHeight: 1 }}>
            {savingsRate}
            <span style={{ fontSize: "20px", fontWeight: "600", color: "#9a7060", marginLeft: "4px" }}>%</span>
          </p>
          <p style={{ fontSize: "13px", color: "#9a7060", marginTop: "6px" }}>
            {savingsRate >= 20 ? "Great saving habit" : savingsRate >= 10 ? "Room to improve" : "Try to save more"}
          </p>
        </InsightCard>

        <InsightCard title="Average Monthly Spend">
          <p style={{ fontSize: "32px", fontWeight: "800", color: "#1a0a00", lineHeight: 1 }}>
            {fmt(Math.round(avgExpense))}
          </p>
          <p style={{ fontSize: "13px", color: "#9a7060", marginTop: "6px" }}>
            Per month across all data
          </p>
        </InsightCard>

        <InsightCard title="Best No-Spend Streak">
          <p style={{ fontSize: "48px", fontWeight: "800", color: "#1a0a00", lineHeight: 1 }}>
            {streak}
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#9a7060", marginLeft: "6px" }}>
              days
            </span>
          </p>
          <p style={{ fontSize: "13px", color: "#9a7060", marginTop: "6px" }}>
            Between two expenses
          </p>
        </InsightCard>

      </div>

      {/* ── Monthly Comparison — 2 vertical rectangle cards ── */}
      {comparison && (
        <div className="flex flex-col gap-4">
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#431407" }}>
            Monthly Comparison — {comparison.prev.month} vs {comparison.last.month}
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <ComparisonCard
              label="Income Change"
              diff={comparison.incDiff}
              prev={comparison.prev.income}
              last={comparison.last.income}
              prevLabel={comparison.prev.month}
              lastLabel={comparison.last.month}
              positiveIsGood={true}
            />
            <ComparisonCard
              label="Expense Change"
              diff={comparison.expDiff}
              prev={comparison.prev.expense}
              last={comparison.last.expense}
              prevLabel={comparison.prev.month}
              lastLabel={comparison.last.month}
              positiveIsGood={false}
            />
          </div>

          {/* Smart observation */}
          <div style={{
            background:   "#fff7ed",
            border:       "1px solid rgba(249,115,22,0.15)",
            borderRadius: "16px",
            padding:      "14px 18px",
            fontSize:     "13px",
            color:        "#92400e",
            fontWeight:   "500",
          }}>
            💡 {comparison.expDiff > 0
              ? `You spent ${fmt(comparison.expDiff)} more in ${comparison.last.month} vs ${comparison.prev.month}. Consider reviewing your ${topCategory?.category} spending.`
              : `Great job! You spent ${fmt(Math.abs(comparison.expDiff))} less in ${comparison.last.month} vs ${comparison.prev.month}. Keep it up!`}
          </div>
        </div>
      )}

      {/* ── Monthly Bar Chart ──────────────────────────────── */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#431407" }}>
              Monthly Overview
            </h3>
            <p style={{ fontSize: "12px", color: "#c2855a", marginTop: "2px" }}>
              Income vs Expenses per month
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>

        <BarChart
  data={monthlyData}
  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
  barGap={4}
>
  <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa30" />
  <XAxis dataKey="month"
    tick={{ fill: "#c2410c", fontSize: 11 }}
    axisLine={{ stroke: "#fed7aa50" }} tickLine={false} />
  <YAxis
    tick={{ fill: "#c2410c", fontSize: 11 }}
    axisLine={false} tickLine={false}
    tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`} />
  <Tooltip
  content={<BarTooltip />}
  allowEscapeViewBox={{ x: false, y: false }}
  wrapperStyle={{ zIndex: 10 }}
  position={{ y: 0 }}
  cursor={{ fill: "rgba(249,115,22,0.06)", radius: 8 }}
/>
  <Bar dataKey="income"  fill={theme.chart.income}  radius={[6,6,0,0]} maxBarSize={32} />
  <Bar dataKey="expense" fill={theme.chart.expense} radius={[6,6,0,0]} maxBarSize={32} />
</BarChart>

        </ResponsiveContainer>
      </div>

      {/* ── Category Breakdown Table ───────────────────────── */}
      <div className="glass rounded-3xl p-6">
        <div className="mb-4">
          <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#431407" }}>
            Category Breakdown
          </h3>
          <p style={{ fontSize: "12px", color: "#c2855a", marginTop: "2px" }}>
            All expense categories ranked by spend
          </p>
        </div>

        {categoryData.length === 0 ? (
          <p className="text-sm text-orange-300 text-center py-8">No expense data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(249,115,22,0.1)" }}>
                  {["#", "Category",  "Amount"].map((h) => (
                    <th key={h}
                      className={`py-2 px-3 text-xs font-bold uppercase tracking-wider
                                  ${h === "Amount" ? "text-right" : "text-left"}`}
                      style={{ color: "#c2855a" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {categoryData.map((cat, idx) => {
                  const pct = totalExpenses > 0
                    ? ((cat.amount / totalExpenses) * 100).toFixed(1) : 0;
                  const barColor = theme.chart.colors[idx % theme.chart.colors.length];

                  return (
                    <tr key={cat.category}
                      style={{ borderBottom: "1px solid rgba(249,115,22,0.06)" }}
                      className="hover:bg-orange-50/40 transition-colors">

                      {/* Rank */}
                      <td className="py-3 px-3">
                        <span className={`
                          w-6 h-6 rounded-full text-xs font-bold
                          flex items-center justify-center
                          ${idx === 0 ? "bg-orange-400 text-white"
                            : idx === 1 ? "bg-orange-300 text-white"
                            : idx === 2 ? "bg-orange-200 text-orange-800"
                            : "bg-orange-100 text-orange-500"}
                        `}>
                          {idx + 1}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 font-semibold text-orange-900">
                        {CATEGORY_ICONS[cat.category]} {cat.category}
                      </td>

                      

                      {/* Amount */}
                      <td className="py-3 px-3 text-right font-bold" style={{ color: "#ef4444" }}>
                        {fmt(cat.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Total row */}
              <tfoot>
                <tr style={{ borderTop: "2px solid rgba(249,115,22,0.15)", background: "rgba(249,115,22,0.03)" }}>
                  <td colSpan={2} className="py-3 px-3 text-sm font-bold text-orange-900">
                    Total
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold" style={{ color: "#dc2626" }}>
                    {fmt(totalExpenses)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}