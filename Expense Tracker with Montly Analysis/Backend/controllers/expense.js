const Expense = require("../models/Expense");

//add new expense
const handleAddExpense = async (req, res) => {
  try {
    const { userId, amount, category, date, description } = req.body;

    //if any field is missing
    if (!userId || !amount || !category || !date || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //add expense to database
    await Expense.create({
      userId: userId.toString(),
      amount: Number(amount),
      category: category.toString(),
      date: new Date(date),
      description: description.toString(),
    });

    console.log("Expense successfully registered");
    return res.status(201).json({ message: "Expense created successfully" });
  } catch (error) {
    console.error("Error adding the expense", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//fetch expense by given month
const handleFetchExpenses = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.headers.user_id;

    //typecast month-query (string) to date format
    //startDate- 1st of given month
    const startDate = new Date(`${month}-01`);
    console.log(startDate);
    //endDate- 1st of next month of given month
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    console.log(endDate);
    console.log(userId);
    //show expenses of given month (range: startDate to endDate)
    const expense = await Expense.find({
      userId: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    console.log(expense);
    return res.json({ message: expense });
  } catch (error) {
    console.error("Error fetching the expense", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update existing expense
const handleUpdateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, description } = req.body;

    if (!amount && !category && !date && !description) {
      return res
        .status(400)
        .json({ message: "At least one field must be provided" });
    }

    //check if expense record exist or not
    const expense = await Expense.findOne({ _id: id });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    //new object with all update fields
    const updates = {};
    //typecast the fields which are passed from frontend
    if (amount) updates.amount = Number(amount);
    if (category) updates.category = category.toString();
    if (date) updates.date = new Date(date);
    if (description) updates.description = description.toString();

    //update the changes
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    console.log("Expense updated successfully", updatedExpense);
    return res
      .status(200)
      .json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    console.error("Error updating the expense", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//delete expense
const handleDeleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    //check if expense exist or not
    const expense = await Expense.findOne({ _id: id });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    //delete the expense record
    await Expense.findByIdAndDelete(id);

    console.log("Expense successfully deleted", expense);
    return res.status(200).json({ message: "Expense successfully deleted" });
  } catch (error) {
    console.error("Error deleting the expense", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//fetch expense summary in given month
const handleFetchExpenseSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.headers.user_id;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    //convert date and setting start and end date
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    //fetch expenses for the given month
    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lt: endDate },
    });

    //summarize expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    console.log(categoryTotals);
    return res.json({ message: categoryTotals });
  } catch (error) {
    console.error("Error fetching the expense", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//JSON monthly expenses report
const handleExportExpenses = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.headers.user_id;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    //set date format, start & end date setup
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    //fetch expenses for the given month
    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lt: endDate },
    });

    if (expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found for the given month" });
    }

    //convert expenses to JSON format
    const jsonReport = JSON.stringify(expenses, null, 2);

    //send resp for file download
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=expenses_${month}.json`
    );

    return res.send(jsonReport);
  } catch (error) {
    console.error("Error exporting expenses", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleAddExpense,
  handleUpdateExpense,
  handleDeleteExpense,
  handleFetchExpenses,
  handleFetchExpenseSummary,
  handleExportExpenses,
};