import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { TransactionsProvider } from "../context/TransactionsContext";
import BudgetForm from "../components/BudgetForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import DarkModeToggle from "../components/DarkModeToggle";

const CategoryChart = dynamic(() => import("../components/CategoryChart"), {
  ssr: false,
});

export default function Home() {
  return (
    <TransactionsProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <div className="container mx-auto p-4">

          <header className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-900 z-50 shadow-md p-4">
            <h1 className="text-3xl font-bold">Bütçe Takip Uygulaması</h1>
            <DarkModeToggle />
          </header>

          <ToastContainer />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <TransactionForm />
            </div>
            <div className="w-full md:w-1/2">
              <BudgetForm />
            </div>
          </div>

          <TransactionList />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <CategoryChart
              title="Gelir Dağılımı (Pasta Grafik)"
              transactions={[]}
              type="income"
              chartType="pie"
            />
            <CategoryChart
              title="Harcama Dağılımı (Pasta Grafik)"
              transactions={[]}
              type="expense"
              chartType="pie"
            />

            <CategoryChart
              title="Gelir Dağılımı (Çubuk Grafik)"
              transactions={[]}
              type="income"
              chartType="bar"
            />
            <CategoryChart
              title="Harcama Dağılımı (Çubuk Grafik)"
              transactions={[]}
              type="expense"
              chartType="bar"
            />
            <CategoryChart
              title="Gelirlerin Zaman İçindeki Değişimi (Alan Grafik)"
              transactions={[]}
              type="income"
              chartType="area"
            />
            <CategoryChart
              title="Harcama Dağılımı (Alan Grafik)"
              transactions={[]}
              type="expense"
              chartType="area"
            />
          </div>
        </div>
      </div>
    </TransactionsProvider>
  );
}
