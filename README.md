# 🪙 FinTrack — Personal Finance Dashboard

A clean, interactive personal finance dashboard built with React, Vite, and Tailwind CSS. FinTrack lets users track income, expenses, and spending patterns with live-reactive charts, role-based UI, and a polished peach-orange design system.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/FinanceTracker.git
cd FinanceTracker

# 2. Install dependencies
npm install

# 3. Install required libraries
npm install recharts react-router-dom

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂 Project Structure

```
src/
├── context/
│   └── AppContext.jsx         # Global state — useReducer + Context
├── data/
│   └── mockData.js            # 48 mock transactions + category config
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        # Desktop sidebar navigation
│   │   ├── Header.jsx         # Top navbar with role switcher + dark mode
│   │   └── Layout.jsx         # Page wrapper
│   ├── dashboard/
│   │   ├── StatCard.jsx       # Reusable summary stat card
│   │   ├── SummaryCards.jsx   # 4-card overview row
│   │   ├── BalanceTrendChart.jsx      # Area chart — income vs expenses
│   │   └── SpendingBreakdownChart.jsx # Donut chart — spending by category
│   ├── transactions/
│   │   ├── TransactionFilters.jsx     # Search + filter + sort controls
│   │   ├── TransactionTable.jsx       # Desktop table + mobile cards
│   │   └── AddTransactionModal.jsx    # Add / edit transaction modal
│   └── insights/
│       ├── InsightCard.jsx    # Reusable insight stat card
│       └── InsightsPanel.jsx  # Full insights page content
├── pages/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   └── Insights.jsx
├── theme.js                   # Centralized design tokens
├── App.jsx                    # Router + AppProvider wrapper
└── main.jsx
```

---

## ✨ Features

### Dashboard Overview
- 4 summary cards — Net Balance, Total Income, Total Expenses, Savings Rate
- Balance Trend area chart — monthly income vs expenses
- Spending Breakdown donut chart — expenses by category
- All charts update instantly when transactions are added or edited

### Transactions
- Full transaction list with date, description, category, type, and amount
- Search by name or category
- Filter by category and type (income / expense)
- Sort by date or amount
- Pagination with configurable rows per page
- Responsive — desktop table and mobile card layout

### Role-Based UI
Switch between roles using the dropdown in the header:
- **Viewer** — read-only, can browse all data
- **Admin** — can add, edit, and delete transactions

No backend required — role is managed entirely on the frontend via Context.

### Insights
- Top spending category
- Savings rate with health indicator
- Average monthly spend
- Best no-spend streak (days between expenses)
- Monthly comparison — income and expense change between last two months
- Smart observation banner with personalized advice
- Monthly bar chart — income vs expenses per month
- Category breakdown table ranked by spend

### Additional Features
- Dark mode toggle — clean, no-gradient dark theme
- LocalStorage persistence — data and role survive page refresh
- Fully responsive — works on mobile, tablet, and desktop
- Peach-orange glassmorphism design system

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Utility-first styling |
| React Context + useReducer | State management |
| React Router v6 | Client-side routing |
| Recharts | Charts and data visualization |
| LocalStorage | Data persistence |

---




## 📱 Responsive Behavior

| Screen | Layout |
|---|---|
| Mobile (< 768px) | Single column, card-based transaction list, hamburger menu |
| Tablet (768px–1024px) | Two-column charts, desktop table visible |
| Desktop (> 1024px) | Full sidebar, 4-column stat cards, side-by-side charts |

---

## 🔑 Usage Guide

1. Open the app — you start as **Viewer** by default
2. Browse the Dashboard, Transactions, and Insights pages
3. Switch to **Admin** using the role dropdown in the header
4. Click **➕ Add Transaction** on the Transactions page
5. Fill in description, amount, type, category, and date — click Add
6. Watch the Dashboard charts and Insights update immediately
7. Use the ✏️ and 🗑️ buttons to edit or delete transactions
8. Toggle 🌙 / ☀️ for dark and light mode
9. Refresh the page — all your data is still there (LocalStorage)



