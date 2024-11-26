import { useState } from "react";
import { useTransactions } from "../context/TransactionsContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransactionForm = () => {
  const { addTransaction, getCategorySpending, budgetLimits } = useTransactions();
  const [type, setType] = useState("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date || (type === "expense" && !category)) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }
    if (type === "expense" && budgetLimits[category]) {
      const currentSpending = getCategorySpending(category);
      if (currentSpending + parseFloat(amount) >= budgetLimits[category] * 0.8) {
        toast.warning(
          `"${category}" kategorisinde mevcut harcamalar limitin %80'ine ulaşmış ve geçmiş olabilir. (${currentSpending} TL / ${limit} TL)!`,
          { autoClose: 5000 }
        );
      }
    }

    addTransaction({
      type,
      description,
      amount: parseFloat(amount),
      date,
      category,
    });

    toast.success("İşlem başarıyla eklendi!");

    setDescription("");
    setAmount(0);
    setDate("");
    setCategory("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-md shadow-md bg-white dark:bg-gray-800 h-full min-h-[400px]"
    >
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        Yeni Gelir/Gider Ekle
      </h2>
      <div className="mb-4 w-full">
        <label className="block text-gray-700 dark:text-gray-300">Tür:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>
      </div>

      <div className="mb-4 w-full">
        <label className="block text-gray-700 dark:text-gray-300">Kategori:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Örn: Gıda, Ulaşım"
        />
      </div>

      <div className="mb-4 w-full">
        <label className="block text-gray-700 dark:text-gray-300">Açıklama:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="mb-4 w-full">
        <label className="block text-gray-700 dark:text-gray-300">Tutar:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="mb-4 w-full">
        <label className="block text-gray-700 dark:text-gray-300">Tarih:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="w-full mt-3">
        <button
          type="submit"
          className="bg-blue-500 dark:bg-blue-600 text-white dark:hover:bg-blue-700 px-16 py-1 rounded hover:bg-blue-600 w-full"
        >
          {type === "income" ? "Gelir Ekle" : "Gider Ekle"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
