import { theme } from "../theme";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable   from "../components/transactions/TransactionTable";

export default function Transactions() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.text.heading}`}>
          Transactions 💳
        </h1>
        <p className={`text-sm ${theme.text.muted} mt-1`}>
          Browse, filter and manage all your transactions
        </p>
      </div>

      {/* Filters always visible */}
      <TransactionFilters />

      {/* Table with modal built-in */}
      <TransactionTable />
    </div>
  );
}