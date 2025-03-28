import React, { useState, useEffect } from "react";
import axios from "axios";
import { useExpenseContext } from "../contexts/expenseContext";

function History() {
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState("");
  const { user } = useExpenseContext();
  const API_URL = "http://localhost:3000/expenses";

  //if user selects category filter
  const [selectedCategory, setSelectedCategory] = useState("");
  const uniqueCategories = [
    ...new Set(expenses.map((expense) => expense.category)),
  ];

  const filteredExpenses = selectedCategory
    ? expenses.filter((expense) => expense.category === selectedCategory)
    : expenses;

  const [editExpense, setEditExpense] = useState(null);

  //fech expenses in given month
  const fetchExpenses = async () => {
    try {
      if (!month) {
        return alert("Please select a month");
      }

      const response = await axios.get(`${API_URL}?month=${month}`, {
        headers: { user_id: user },
      });
      setExpenses(response.data.message);
    } catch (error) {
      console.error("Error fetching expenses", error);
    }
  };

  //update expense
  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: { user_id: user },
      });

      setExpenses((prev) =>
        prev.map((exp) =>
          exp._id === id ? { ...exp, ...response.data.updatedExpense } : exp
        )
      );
      setEditExpense(null);
    } catch (error) {
      console.error("Error updating expense", error);
    }
  };

  //delete expense
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { user_id: user },
      });

      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  //download JSON report of monthly expenses
  const handleDownloadJSON = async () => {
    try {
      if (!month) {
        return alert("Please select a month");
      }
      const response = await fetch(`http://localhost:3000/export?month=${month}`,{
        headers: {user_id: user}
      });

      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `expenses_${month}.json`; 
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url); 
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading JSON file:", error);
      alert("Failed to download expenses!");
    }
  };

  useEffect(() => {
    if (month) {
      fetchExpenses();
    }
  }, [month]);

  return (
    <div className="w-full max-w-[80vw] mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Expense History
      </h2>

      {/* month Selector */}
      <div className="mb-4 sm:flex flex-row items-center justify-center">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchExpenses}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate
        </button>
        <button
          onClick={handleDownloadJSON}
          className="ml-2 bg-gray-100 border border-black text-black px-4 py-2 rounded"
        >
          Download JSON
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          className={`px-4 py-2 rounded ${
            selectedCategory === "" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {/* display all categories */}
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredExpenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Category</th>
                <th className="border p-3">Amount</th>
                <th className="border p-3">Date</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense._id} className="text-center border-b">
                  {editExpense?._id === expense._id ? (
                    <>
                      <td className="border p-3">
                        <input
                          type="text"
                          value={editExpense.category}
                          onChange={(e) =>
                            setEditExpense((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="border p-1"
                        />
                      </td>

                      <td className="border p-3">
                        <input
                          type="number"
                          value={editExpense.amount}
                          onChange={(e) =>
                            setEditExpense((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                          className="border p-1"
                        />
                      </td>

                      <td className="border p-3">
                        <input
                          type="date"
                          value={editExpense.date.split("T")[0]}
                          onChange={(e) =>
                            setEditExpense((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                          className="border p-1"
                        />
                      </td>

                      <td className="border p-3">
                        <input
                          type="text"
                          value={editExpense.description}
                          onChange={(e) =>
                            setEditExpense((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="border p-1"
                        />
                      </td>

                      <td className="border p-3 flex justify-center gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          onClick={() => handleUpdate(expense._id, editExpense)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          onClick={() => setEditExpense(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-3">{expense.category}</td>
                      <td className="border p-3">₹{expense.amount}</td>
                      <td className="border p-3">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="border p-3">{expense.description}</td>
                      <td className="border p-3 flex justify-center gap-2">
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          onClick={() => setEditExpense({ ...expense })}
                        >
                          Update
                        </button>

                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(expense._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default History;