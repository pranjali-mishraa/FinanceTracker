import { useAppState } from "../../context/AppContext";
import { theme } from "../../theme";

// ── Individual card config — easy to extend ───────────────────
const getCards = (totalBalance, totalIncome, totalExpenses) => [
  {
    label:    "Total Balance",
    value:    totalBalance,
    icon:     "🪙",
    gradient: "from-orange-400 to-pink-400",
    text:     "text-white",
    sub:      totalBalance >= 0 ? "↑ Looking healthy" : "↓ Overspent",
    subColor: "text-white/70",
  },
  {
    label:    "Total Income",
    value:    totalIncome,
    icon:     "💰",
    gradient: "from-green-400 to-emerald-400",
    text:     "text-white",
    sub:      "All income sources",
    subColor: "text-white/70",
  },
  {
    label:    "Total Expenses",
    value:    totalExpenses,
    icon:     "💸",
    gradient: "from-red-400 to-rose-400",
    text:     "text-white",
    sub:      "All spending",
    subColor: "text-white/70",
  },
  {
    label:    "Savings Rate",
    value:    totalIncome > 0
                ? `${((1 - totalExpenses / totalIncome) * 100).toFixed(1)}%`
                : "0%",
    icon:     "📈",
    gradient: "from-orange-300 to-yellow-300",
    text:     "text-orange-900",
    sub:      "Income saved",
    subColor: "text-orange-700/70",
    isPercent: true,
  },
];

// ── Format numbers as ₹ currency ─────────────────────────────
const formatCurrency = (val) =>
  typeof val === "number"
    ? new Intl.NumberFormat("en-IN", {
        style:    "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val)
    : val;

export default function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useAppState();
  const cards = getCards(totalBalance, totalIncome, totalExpenses);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`
            rounded-2xl p-5
            bg-gradient-to-br ${card.gradient}
            shadow-lg shadow-orange-100
            transition-transform duration-200 hover:scale-[1.02]
          `}
        >
          {/* Top row — label + icon */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-semibold ${card.text} opacity-90`}>
              {card.label}
            </span>
            <span className="text-2xl">{card.icon}</span>
          </div>

          {/* Value */}
          <p className={`text-2xl font-bold ${card.text} mb-1`}>
            {card.isPercent ? card.value : formatCurrency(card.value)}
          </p>

          {/* Sub label */}
          <p className={`text-xs ${card.subColor}`}>{card.sub}</p>
        </div>
      ))}
    </div>
  );
}