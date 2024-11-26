import { useTransactions } from "../context/TransactionsContext";
import CategoryChart from "./CategoryChart";

const BarCharts = () => {
  const { transactions } = useTransactions();

  return (
    <div className="p-4">
      <CategoryChart
        title="Gelir Dağılımı (Çubuk Grafik)"
        transactions={transactions}
        type="income"
        chartType="bar"
      />
      <CategoryChart
        title="Harcama Dağılımı (Çubuk Grafik)"
        transactions={transactions}
        type="expense"
        chartType="bar"
      />
    </div>
  );
};

export default BarCharts;
