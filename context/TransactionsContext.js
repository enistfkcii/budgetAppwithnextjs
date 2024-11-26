import { createContext, useContext, useEffect, useState } from "react";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTransactions = localStorage.getItem("transactions");
      return storedTransactions ? JSON.parse(storedTransactions) : [];
    }
    return [];
  });

  const [budgetLimits, setBudgetLimits] = useState(() => {
    if (typeof window !== "undefined") {
      const storedLimits = localStorage.getItem("budgetLimits");
      return storedLimits ? JSON.parse(storedLimits) : {};
    }
    return {};
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("budgetLimits", JSON.stringify(budgetLimits));
    }
  }, [budgetLimits, isClient]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const setLimitForCategory = (category, limit) => {
    setBudgetLimits((prev) => ({
      ...prev,
      [category]: limit,
    }));
  };

  const getCategorySpending = (category) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category === category)
      .reduce((total, t) => total + t.amount, 0);
  };

  const removeLimitForCategory = (category) => {
    setBudgetLimits((prev) => {
      const updatedLimits = { ...prev };
      delete updatedLimits[category];
      return updatedLimits;
    });
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        budgetLimits,
        setLimitForCategory,
        getCategorySpending,
        removeLimitForCategory,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
