import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { useExpenseContext } from "../contexts/expenseContext";

function FetchExpenseByMonth() {
  const [month, setMonth] = useState("");
  const [categoryTotals, setCategoryTotals] = useState({});
  const chartRef = useRef(null);

  //stores chart instance - manage & delete when needed
  const chartInstance = useRef(null);
  const { user } = useExpenseContext();

  //fetch expense summary for given month
  const handleFetchExpense = async () => {
    try {
      if (!month) {
        return alert("Please select a month");
      }

      const url = `http://localhost:3000/summary?month=${month}`;
      const response = await axios.get(url, {
        headers: { user_id: user },
      });

      setCategoryTotals(response.data.message);
    } catch (error) {
      console.error("Error fetching the expenses", error);
    }
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    //when expense data isn't available
    if (Object.keys(categoryTotals).length === 0) {
      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["No Data Available"],
          datasets: [{ data: [1], backgroundColor: ["#d1d5db"] }],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
        },
      });
      return;
    }

    const labels = Object.keys(categoryTotals);
    const dataValues = Object.values(categoryTotals);
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#8E44AD",
      "#1ABC9C",
      "#D35400",
      "#C0392B",
      "#2ECC71",
      "#F39C12",
    ];

    //data available of expenses
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: colors.slice(0, labels.length),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [categoryTotals]);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">
        Monthly Expense Summary
      </h2>

      {/* month selection */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mb-4"
      />
      <button
        onClick={handleFetchExpense}
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mb-4"
      >
        View Summary
      </button>

      <div className="flex justify-center">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default FetchExpenseByMonth;