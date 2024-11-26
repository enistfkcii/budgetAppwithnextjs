import { useTransactions } from "../context/TransactionsContext";
import CategoryChart from "./CategoryChart";

const LineCharts = () => {
  const { transactions } = useTransactions();

  return (
    <div className="p-4">
      <CategoryChart
        title="Gelirlerin Zaman İçindeki Değişimi (Çizgi Grafik)"
        transactions={transactions}
        type="income"
        chartType="line"
      />
      <CategoryChart
        title="Harcama Dağılımı (Çizgi Grafik)"
        transactions={transactions}
        type="expense"
        chartType="line"
      />
    </div>
  );
};

export default LineCharts;
