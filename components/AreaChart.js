import { useTransactions } from "../context/TransactionsContext";
import CategoryChart from "./CategoryChart";

const AreaCharts = () => {
  const { transactions } = useTransactions();

  return (
    <div className="p-4">
      <CategoryChart
        title="Gelirlerin Zaman İçindeki Değişimi (Alan Grafik)"
        transactions={transactions}
        type="income"
        chartType="area"
      />
      <CategoryChart
        title="Harcama Dağılımı (Alan Grafik)"
        transactions={transactions}
        type="expense"
        chartType="area"
      />
    </div>
  );
};

export default AreaCharts;
