const express = require("express");
const {
  handleAddExpense,
  handleUpdateExpense,
  handleDeleteExpense,
  handleFetchExpenses,
  handleFetchExpenseSummary,
  handleExportExpenses,
} = require("../controllers/expense");
const expenseRoute = express.Router();

//add expense
expenseRoute.post("/expenses", handleAddExpense);

//get expense for given month
expenseRoute.get("/expenses", handleFetchExpenses);

//update expense
expenseRoute.put("/expenses/:id", handleUpdateExpense);

//delete expense
expenseRoute.delete("/expenses/:id", handleDeleteExpense);

//get expense summary by month (category wise total expense)
expenseRoute.get("/summary", handleFetchExpenseSummary);

//JSON monthly expenses report
expenseRoute.get("/export", handleExportExpenses);

module.exports = expenseRoute;