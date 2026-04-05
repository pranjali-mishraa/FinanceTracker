import { useAppState } from "../../context/AppContext";
import StatCard from "./StateCards";

const fmtShort = (v) => {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000)     return `₹${(v / 1000).toFixed(1)}k`;
  return `₹${v}`;
};

const getCards = (totalBalance, totalIncome, totalExpenses) => {
  const savingsRate =
    totalIncome > 0
      ? ((1 - totalExpenses / totalIncome) * 100).toFixed(1)
      : 0;

  return [
    {
      label:   "Net Balance",
      value:   fmtShort(Math.abs(totalBalance)),
      icon:    "🪙",
      iconBg:  "#fff3e0",
      badge:   totalBalance >= 0 ? "↗ Healthy" : "↘ Deficit",
      badgeUp: totalBalance >= 0,
    },
    {
      label:   "Total Income",
      value:   fmtShort(totalIncome),
      icon:    "💰",
      iconBg:  "#e8f5e9",
      badge:   "↗ Earned",
      badgeUp: true,
    },
    {
      label:   "Total Expenses",
      value:   fmtShort(totalExpenses),
      icon:    "💸",
      iconBg:  "#fce4ec",
      badge:   "↘ Spent",
      badgeUp: false,
    },
    {
      label:   "Savings Rate",
      value:   `${savingsRate}%`,
      icon:    "📈",
      iconBg:  "#e3f2fd",
      badge:   savingsRate >= 20 ? "↗ Great" : savingsRate >= 10 ? "→ Okay" : "↘ Low",
      badgeUp: savingsRate >= 10,
    },
  ];
};

export default function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useAppState();
  const cards = getCards(totalBalance, totalIncome, totalExpenses);

  return (
    <div className="fade-up grid grid-cols-4 gap-7">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}