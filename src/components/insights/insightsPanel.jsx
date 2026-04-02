import { useMemo } from "react";
import { useAppState } from "../../context/AppContext";
import { CATEGORY_ICONS } from "../../data/mockData";
import { theme } from "../../theme";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// ── Currency formatter ────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

// ── Custom Bar Tooltip ────────────────────────────────────────
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl p-4 shadow-xl border border-orange-200 text-sm"
      style={{ background: theme.chart.tooltip.bg }}
    >
      <p className="font-bold text-orange-900 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
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

// ── Derived insight helpers ───────────────────────────────────

// Get last two months that have data and compare them
const getMonthlyComparison = (monthlyData) => {
  if (monthlyData.length < 2) return null;
  const last    = monthlyData[monthlyData.length - 1];
  const prev    = monthlyData[monthlyData.length - 2];
  const expDiff = last.expense - prev.expense;
  const incDiff = last.income  - prev.income;
  return { last, prev, expDiff, incDiff };
};

// Average monthly expense
const getAvgMonthlyExpense = (monthlyData) => {
  if (!monthlyData.length) return 0;
  const total = monthlyData.reduce((s, m) => s + m.expense, 0);
  return total / monthlyData.length;
};

// Longest expense-free streak (days between expenses)
const getLongestStreak = (transactions) => {
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .map((t) => new Date(t.date))
    .sort((a, b) => a - b);

  if (expenses.length < 2) return 0;
  let max = 0;
  for (let i = 1; i < expenses.length; i++) {
    const diff = Math.floor(
      (expenses[i] - expenses[i - 1]) / (1000 * 60 * 60 * 24)
    );
    if (diff > max) max = diff;
  }
  return max;
};

// Radar data — spending per category as % of total expenses
const getRadarData = (categoryData, totalExpenses) =>
  categoryData.slice(0, 6).map((c) => ({
    category: c.category,
    percent:  totalExpenses > 0
      ? Math.round((c.amount / totalExpenses) * 100)
      : 0,
  }));

export default function InsightsPanel() {
  const { transactions, monthlyData, categoryData, totalExpenses,
          totalIncome, topCategory } = useAppState();

  // All derived insight values — recalc only when deps change
  const comparison    = useMemo(() => getMonthlyComparison(monthlyData),    [monthlyData]);
  const avgExpense    = useMemo(() => getAvgMonthlyExpense(monthlyData),    [monthlyData]);
  const streak        = useMemo(() => getLongestStreak(transactions),       [transactions]);
  const radarData     = useMemo(() => getRadarData(categoryData, totalExpenses), [categoryData, totalExpenses]);
  const savingsRate   = totalIncome > 0
    ? ((1 - totalExpenses / totalIncome) * 100).toFixed(1)
    : 0;

  // ── Empty state ───────────────────────────────────────────
  if (!transactions.length) {
    return (
      <div className={`${theme.card.base} flex flex-col items-center justify-center py-20 gap-3`}>
        <span className="text-5xl">📭</span>
        <p className={`${theme.text.muted} text-sm`}>
          No transactions yet. Add some to see insights!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Quick Insight Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Top Spending Category */}
        <div className={`${theme.card.gradient} flex flex-col gap-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${theme.text.secondary} uppercase tracking-wide`}>
              Top Category
            </span>
            <span className="text-xl">🏆</span>
          </div>
          {topCategory ? (
            <>
              <p className={`text-lg font-bold ${theme.text.heading}`}>
                {CATEGORY_ICONS[topCategory.category]} {topCategory.category}
              </p>
              <p className={`text-sm font-semibold text-red-500`}>
                {fmt(topCategory.amount)} spent
              </p>
            </>
          ) : (
            <p className={theme.text.muted}>No data</p>
          )}
        </div>

        {/* Savings Rate */}
        <div className={`${theme.card.gradient} flex flex-col gap-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${theme.text.secondary} uppercase tracking-wide`}>
              Savings Rate
            </span>
            <span className="text-xl">💹</span>
          </div>
          <p className={`text-3xl font-bold ${theme.text.heading}`}>
            {savingsRate}%
          </p>
          <p className={`text-xs ${theme.text.muted}`}>
            {savingsRate >= 20
              ? "🟢 Great saving habit!"
              : savingsRate >= 10
              ? "🟡 Room to improve"
              : "🔴 Try to save more"}
          </p>
        </div>

        {/* Avg Monthly Expense */}
        <div className={`${theme.card.gradient} flex flex-col gap-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${theme.text.secondary} uppercase tracking-wide`}>
              Avg Monthly Spend
            </span>
            <span className="text-xl">📆</span>
          </div>
          <p className={`text-xl font-bold ${theme.text.heading}`}>
            {fmt(Math.round(avgExpense))}
          </p>
          <p className={`text-xs ${theme.text.muted}`}>
            Per month average
          </p>
        </div>

        {/* Longest No-Spend Streak */}
        <div className={`${theme.card.gradient} flex flex-col gap-2`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${theme.text.secondary} uppercase tracking-wide`}>
              Best No-Spend Streak
            </span>
            <span className="text-xl">🔥</span>
          </div>
          <p className={`text-3xl font-bold ${theme.text.heading}`}>
            {streak}
            <span className="text-base font-medium ml-1">days</span>
          </p>
          <p className={`text-xs ${theme.text.muted}`}>
            Between two expenses
          </p>
        </div>
      </div>

      {/* ── Monthly Comparison Banner ───────────────────────── */}
      {comparison && (
        <div
          className={`
            rounded-2xl p-5 border border-orange-100
            bg-gradient-to-r from-orange-50 via-pink-50 to-orange-50
            shadow-md shadow-orange-100
          `}
        >
          <h3 className={`text-sm font-bold ${theme.text.heading} mb-4`}>
            📅 Monthly Comparison — {comparison.prev.month} vs {comparison.last.month}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Income comparison */}
            <div className="flex items-center justify-between
                            bg-white/70 rounded-xl px-4 py-3
                            border border-orange-100">
              <div>
                <p className={`text-xs ${theme.text.muted}`}>Income change</p>
                <p className={`text-lg font-bold ${theme.text.heading}`}>
                  {comparison.incDiff >= 0 ? "+" : ""}{fmt(comparison.incDiff)}
                </p>
              </div>
              <span className={`text-2xl font-bold
                ${comparison.incDiff >= 0 ? "text-green-500" : "text-red-500"}`}>
                {comparison.incDiff >= 0 ? "↑" : "↓"}
              </span>
            </div>

            {/* Expense comparison */}
            <div className="flex items-center justify-between
                            bg-white/70 rounded-xl px-4 py-3
                            border border-orange-100">
              <div>
                <p className={`text-xs ${theme.text.muted}`}>Expense change</p>
                <p className={`text-lg font-bold ${theme.text.heading}`}>
                  {comparison.expDiff >= 0 ? "+" : ""}{fmt(comparison.expDiff)}
                </p>
              </div>
              <span className={`text-2xl font-bold
                ${comparison.expDiff <= 0 ? "text-green-500" : "text-red-500"}`}>
                {comparison.expDiff <= 0 ? "↓" : "↑"}
              </span>
            </div>
          </div>

          {/* Smart observation */}
          <div className="mt-4 bg-white/60 rounded-xl px-4 py-3
                          border border-orange-100 text-sm text-orange-800">
            💡{" "}
            {comparison.expDiff > 0
              ? `You spent ${fmt(comparison.expDiff)} more in ${comparison.last.month} compared to ${comparison.prev.month}. Consider reviewing your ${topCategory?.category} spending.`
              : `Great job! You spent ${fmt(Math.abs(comparison.expDiff))} less in ${comparison.last.month} compared to ${comparison.prev.month}. Keep it up! 🎉`}
          </div>
        </div>
      )}

      {/* ── Charts Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Monthly Bar Chart */}
        <div className={theme.card.base}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold ${theme.text.heading}`}>
                Monthly Overview
              </h3>
              <p className={`text-xs ${theme.text.muted} mt-0.5`}>
                Income vs Expenses per month
              </p>
            </div>
            <span className="text-2xl">📊</span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={monthlyData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chart.grid} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#c2410c", fontSize: 11 }}
                axisLine={{ stroke: "#fed7aa" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#c2410c", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                }
              />
              <Tooltip content={<BarTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#9a3412" }} />
              <Bar
                dataKey="income"
                fill={theme.chart.income}
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="expense"
                fill={theme.chart.expense}
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart — spending profile */}
        <div className={theme.card.base}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-bold ${theme.text.heading}`}>
                Spending Profile
              </h3>
              <p className={`text-xs ${theme.text.muted} mt-0.5`}>
                Top 6 categories as % of total spend
              </p>
            </div>
            <span className="text-2xl">🕸️</span>
          </div>

          {radarData.length >= 3 ? (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={theme.chart.grid} />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: "#c2410c", fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#c2410c", fontSize: 9 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Radar
                  dataKey="percent"
                  stroke="#fb923c"
                  fill="#fb923c"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Share of spend"]}
                  contentStyle={{
                    background: theme.chart.tooltip.bg,
                    border: `1px solid ${theme.chart.tooltip.border}`,
                    borderRadius: "12px",
                    color: theme.chart.tooltip.text,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className={`text-sm ${theme.text.muted}`}>
                Add more categories to see the radar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Category Breakdown Table ────────────────────────── */}
      <div className={theme.card.base}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-base font-bold ${theme.text.heading}`}>
              Category Breakdown
            </h3>
            <p className={`text-xs ${theme.text.muted} mt-0.5`}>
              All expense categories ranked by spend
            </p>
          </div>
          <span className="text-2xl">🗂️</span>
        </div>

        <div className="flex flex-col gap-3">
          {categoryData.length === 0 ? (
            <p className={`text-sm ${theme.text.muted} text-center py-8`}>
              No expense data yet
            </p>
          ) : (
            categoryData.map((cat, idx) => {
              const pct = totalExpenses > 0
                ? ((cat.amount / totalExpenses) * 100).toFixed(1)
                : 0;

              return (
                <div key={cat.category}>
                  {/* Label row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {/* Rank */}
                      <span
                        className={`
                          w-5 h-5 rounded-full text-xs font-bold
                          flex items-center justify-center flex-shrink-0
                          ${idx === 0
                            ? "bg-orange-400 text-white"
                            : idx === 1
                            ? "bg-orange-300 text-white"
                            : idx === 2
                            ? "bg-orange-200 text-orange-800"
                            : "bg-orange-100 text-orange-600"}
                        `}
                      >
                        {idx + 1}
                      </span>
                      <span className={`text-sm font-medium ${theme.text.primary}`}>
                        {CATEGORY_ICONS[cat.category]} {cat.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${theme.text.muted}`}>
                        {pct}%
                      </span>
                      <span className={`text-sm font-bold text-red-500`}>
                        {fmt(cat.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-orange-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background:
                          theme.chart.colors[idx % theme.chart.colors.length],
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}