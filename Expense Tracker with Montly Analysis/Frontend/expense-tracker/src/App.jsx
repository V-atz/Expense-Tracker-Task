import React from "react";
import ExpenseEntry from "./components/ExpenseEntry";
import FetchExpenseByMonth from "./api/FetchExpenseByMonth";

function App() {
  return (
      <div className="sm:flex flex-row sm:gap-y-0 gap-y-5 items-center justify-center bg-gray-100 w-full sm:h-[85vh]">
        <ExpenseEntry />
        <FetchExpenseByMonth />
      </div>
  );
}

export default App;