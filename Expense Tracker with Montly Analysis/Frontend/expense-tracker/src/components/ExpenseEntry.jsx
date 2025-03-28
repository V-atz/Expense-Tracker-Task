import axios from "axios";
import React from "react";
import { useExpenseContext } from "../contexts/expenseContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ExpenseEntry() {
  const {amount, setAmount, category, setCategory, date, setDate, description, setDescription, user} = useExpenseContext()

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try{
        const url = 'http://localhost:3000/expenses'
        const res = await axios.post(url, {userId:user, amount, category, date, description})
        setAmount("")
        setCategory("")
        setDate("")
        setDescription("")
        console.log(res)
        toast.success('Expense added successfully.')
    } catch (error) {
        console.error("Error signing in", error);
        toast.error(error)
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Add Expense</h2>
      <form onSubmit={handleAddExpense} className="space-y-4">
        <input
          type="number"
          name="amount"
          value={amount}
          min={0}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Add Expense
        </button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default ExpenseEntry;