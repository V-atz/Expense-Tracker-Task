import { createContext, useContext, useState } from "react";

//global state store (context store)
const expenseContext = createContext(null);

//context provider
export const ExpenseContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [test, setTest] = useState("vatsal");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  return (
    <expenseContext.Provider
      value={{
        user,
        setUser,
        test,
        setTest,
        amount,
        setAmount,
        category,
        setCategory,
        date,
        setDate,
        description,
        setDescription,
      }}
    >
      {children}
    </expenseContext.Provider>
  );
};

//custom hook to access context in other components
export const useExpenseContext = () => useContext(expenseContext);