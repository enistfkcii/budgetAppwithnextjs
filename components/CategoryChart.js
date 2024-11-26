import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useTransactions } from "../context/TransactionsContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const COLORS = {
  bar: "#FF6384",
  pie: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
  area: { income: "#82ca9d", expense: "#FF6384" },
};

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const CategoryChart = ({ title, type, chartType }) => {
  const { transactions } = useTransactions();
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    setSelectedMonth(currentDate.getMonth() + 1);
    setSelectedYear(currentDate.getFullYear());
  }, []);

  useEffect(() => {
    if (!selectedMonth || !selectedYear) return;
    let filteredTransactions = transactions.filter((t) => t.type === type);
    if (filterType === "monthly") {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const date = new Date(transaction.date);
        return (
          date.getMonth() + 1 === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });
    } else if (filterType === "yearly") {
      filteredTransactions = filteredTransactions.filter((transaction) => {
        const date = new Date(transaction.date);
        return date.getFullYear() === selectedYear;
      });
    }

    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
      const key = transaction.category || "Diğer";
      acc[key] = (acc[key] || 0) + transaction.amount;
      return acc;
    }, {});

    const chartData = Object.keys(categoryTotals).map((key) => ({
      name: key,
      value: categoryTotals[key],
    }));

    setData(chartData);
  }, [transactions, type, filterType, selectedMonth, selectedYear]);

  const downloadPDF = async () => {
    const chartElement = document.getElementById(`chart-${type}-${chartType}`);
    const canvas = await html2canvas(chartElement, { scale: 2 });
    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const imgProps = pdf.getImageProperties(imageData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imageData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${title}.pdf`);
  };

  return (
    <div className="p-4 border rounded-md shadow-md mt-4 bg-white dark:bg-gray-800">
      <div id={`chart-${type}-${chartType}`}>
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className="flex flex-wrap items-center mb-4 gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-auto"
          >
            <option value="monthly">Aylık</option>
            <option value="yearly">Yıllık</option>
          </select>

          {filterType === "monthly" && selectedMonth && selectedYear && (
            <>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-auto"
              >
                {MONTHS.map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-full sm:w-auto"
              />
            </>
          )}

          {filterType === "yearly" && selectedYear && (
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-full sm:w-auto"
            />
          )}
        </div>

        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height={300}>
          <PieChart width={400} height={400}>
            <Pie
              data={data.length > 0 ? data.map(item => ({ ...item, value: item.value === 0 ? 0.01 : item.value })) : [{ name: "Boş Veri", value: 0.01 }]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {data.length > 0
                ? data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value === 0
                        ? "#E0E0E0"
                        : type === "income"
                          ? COLORS.pie[index % COLORS.pie.length]
                          : COLORS.pie.reverse()[index % COLORS.pie.length]
                    }
                  />
                ))
                : <Cell fill="#E0E0E0" />}
            </Pie>
            <Tooltip
              formatter={(value) =>
                value === 0.01 ? (
                  <span
                    style={{
                      color: "gray",
                      fontWeight: "bold",
                    }}
                  >
                    0 TL
                  </span>
                ) : (
                  <span
                    style={{
                      color: type === "income" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {`${value} TL`}
                  </span>
                )
              }
            />
          </PieChart>
          </ResponsiveContainer>
        )}

        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.length > 0 ? data : [{ name: "Boş", value: 0 }]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${value} TL`,
                  `${name}`,
                ]}
                labelFormatter={(label) => `Kategori: ${label}`}
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg, #fff)",
                  color: "var(--tooltip-text, #000)",
                  borderRadius: "5px",
                  border: "1px solid var(--tooltip-border, #ccc)",
                }}
                labelStyle={{
                  color: "var(--tooltip-label, #555)",
                }}
              />
              <Bar dataKey="value" fill={type === "income" ? "green" : "red"} />
            </BarChart>
          </ResponsiveContainer>
        )}
        {chartType === "area" && (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data.length > 0 ? data : [{ name: "Boş", value: 0 }]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${value} TL`,
                  `${name}`,
                ]}
                labelFormatter={(label) => `Kategori: ${label}`}
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg, #fff)",
                  color: "var(--tooltip-text, #000)",
                  borderRadius: "5px",
                  border: "1px solid var(--tooltip-border, #ccc)",
                }}
                labelStyle={{
                  color: "var(--tooltip-label, #555)",
                }}
              />
              <Area
                nameKey="name"
                dataKey="value"
                stroke={COLORS.area[type]}
                fill={COLORS.area[type]}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {data.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400 text-center mt-4">
            Bu tarihlerde veri bulunamadı.
          </p>
        )}
      </div>
      <div className="w-full mt-3">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 dark:bg-blue-600 text-white dark:hover:bg-blue-700 px-16 py-1 rounded hover:bg-blue-600 w-full"
        >
          PDF İndir
        </button>
      </div>
    </div>
  );
};

export default CategoryChart;
