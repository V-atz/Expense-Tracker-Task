import React from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useExpenseContext } from "./contexts/expenseContext";

function Layout() {
  const navigate = useNavigate();
  const { setUser } = useExpenseContext();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure want to logout?");
    if (confirmLogout) {
      setUser(null);
      navigate("/login");
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="flex items-center justify-between p-6 bg-gray-900 text-white shadow-md">
        <div className="text-2xl font-bold tracking-wide">
          <Link to="/">Expense Tracker</Link>
        </div>
        <nav className="space-x-6 text-lg">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/history" className="hover:underline">
            Logs & History
          </Link>
          <button
            onClick={handleLogout}
            className="hover:underline text-white cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* other pages */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p className="text-sm">
          Expense Tracker Application Task - Vatsal
        </p>
      </footer>
    </div>
  );
}

export default Layout;