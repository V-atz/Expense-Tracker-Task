const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      //no negative amount
      min:0,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      //indexing to optimize serach using date
      index: true
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;