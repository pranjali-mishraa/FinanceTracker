import TransactionFilter from "../components/transactions/TransactionFilter";
import TransactionTable   from "../components/transactions/TransactionTable";

export default function Transactions() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="fade-up">
        <h1 className="font-display text-3xl font-bold grad-text leading-tight">
          Transactions
        </h1>
        <p className="text-orange-400 text-sm mt-1.5 font-medium">
          Browse, filter and manage all your transactions 💳
        </p>
      </div>
      <TransactionFilter />
      <TransactionTable />
    </div>
  );
}