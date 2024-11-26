import { useTransactions } from "../context/TransactionsContext";
import { useEffect, useState } from "react";

const TransactionList = () => {
  const { transactions } = useTransactions();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <p className="text-gray-700 dark:text-gray-300">Yükleniyor...</p>;
  }

  return (
    <div className="p-4 border rounded-md shadow-md mt-4 bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        Gelir ve Gider Listesi
      </h2>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 py-2"
            >
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {transaction.date} - {transaction.description}
                </p>
                {transaction.type === "expense" && transaction.category && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kategori: {transaction.category}
                  </p>
                )}
              </div>
              <p
                className={`font-bold ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.amount} TL
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Kayıt Yok</p>
        )}
      </ul>
    </div>
  );
};

export default TransactionList;
