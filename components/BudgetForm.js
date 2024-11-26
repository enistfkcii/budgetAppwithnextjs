import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTransactions } from "../context/TransactionsContext";
import ReactPaginate from "react-paginate";

const BudgetForm = () => {
  const { setLimitForCategory, budgetLimits, transactions, removeLimitForCategory } = useTransactions(); // removeLimitForCategory ekledik
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    setIsClient(true);

    if (Object.keys(budgetLimits).length > 0 && transactions.length > 0) {
      Object.entries(budgetLimits).forEach(([category, limit]) => {
        const currentSpending = transactions
          .filter(
            (transaction) =>
              transaction.type === "expense" &&
              transaction.category === category
          )
          .reduce((total, transaction) => total + transaction.amount, 0);

        if (currentSpending >= parseFloat(limit) * 0.8) {
          toast.warning(
            `"${category}" kategorisinde mevcut harcamalar limitin %80'ine ulaşmış ve geçmiş olabilir. (${currentSpending} TL / ${limit} TL)!`,
            { autoClose: 5000 }
          );
        }
      });
    }
  }, [budgetLimits, transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !limit) {
      toast.error("Lütfen tüm alanları doldurun!");
      return;
    }
    if (!limit || parseFloat(limit) <= 0) {
      toast.error("Limit sıfırdan büyük bir değer olmalıdır!");
      return;
    }

    if (editCategory) {
      if (editCategory !== category) {
        removeLimitForCategory(editCategory);
      }
      setLimitForCategory(category, parseFloat(limit));
      toast.success(`"${category}" limiti başarıyla güncellendi!`);
      setEditCategory(null);
    } else {
      setLimitForCategory(category, parseFloat(limit));
      toast.success(`"${category}" için ${limit} TL limiti başarıyla eklendi!`);
    }
    setCategory("");
    setLimit("");
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setCategory(category);
    setLimit(budgetLimits[category]);
  };

  const handleDelete = (category) => {
    removeLimitForCategory(category);
    toast.success(`"${category}" limiti başarıyla silindi!`);
  };

  const handlePageClick = ({ selected }) => setCurrentPage(selected);
  const offset = currentPage * itemsPerPage;
  const paginatedLimits = Object.entries(budgetLimits).slice(
    offset,
    offset + itemsPerPage
  );

  if (!isClient) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-md shadow-md bg-white dark:bg-gray-800 h-full min-h-[400px]"
    >
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        Bütçe Limiti Belirle
      </h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-gray-300"
          htmlFor="category"
        >
          Kategori:
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Kategori adı"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-gray-300"
          htmlFor="limit"
        >
          Limit:
        </label>
        <input
          id="limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Limit belirleyin"
        />
      </div>
      <div className="w-full mt-6">
        <button
          type="submit"
          className="bg-blue-500 dark:bg-blue-600 text-white dark:hover:bg-blue-700 px-16 py-1 rounded hover:bg-blue-600 w-full"
        >
          {editCategory ? "Güncelle" : "Limit Ekle"}
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Mevcut Limitler:
        </h3>
        {Object.keys(budgetLimits).length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Henüz bir limit eklenmedi.
          </p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                    Kategori
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                    Limit (TL)
                  </th>
                  <th className="border border-gray-300 dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLimits.map(([category, limit]) => (
                  <tr key={category}>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white">
                      {category}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white">
                      {limit}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-gray-900 dark:text-white flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(category)}
                        className="bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-600 dark:hover:bg-yellow-700"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="bg-red-500 dark:bg-red-600 text-white px-4 py-1 rounded hover:bg-red-600 dark:hover:bg-red-700"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"Önceki"}
              nextLabel={"Sonraki"}
              pageCount={Math.ceil(
                Object.keys(budgetLimits).length / itemsPerPage
              )}
              onPageChange={handlePageClick}
              containerClassName={
                "pagination flex justify-center mt-4 gap-2 text-gray-900 dark:text-white"
              }
              previousLinkClassName={
                "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded"
              }
              nextLinkClassName={
                "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded"
              }
              disabledClassName={"opacity-50 cursor-not-allowed"}
              pageClassName={"mx-1"}
              pageLinkClassName={
                "p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }
            />
          </>
        )}
      </div>
    </form>
  );
};

export default BudgetForm;
