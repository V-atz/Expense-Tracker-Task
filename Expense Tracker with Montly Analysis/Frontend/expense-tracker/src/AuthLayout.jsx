import React from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="flex items-center justify-between p-6 bg-gray-900 text-white shadow-md">
        <div className="text-2xl font-serif font-bold tracking-wide">
          Expense Tracker
        </div>
      </header>

      {/* other pages */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p className="text-sm font-serif">
          Expense Tracker Application Task
        </p>
      </footer>
    </div>
  );
}

export default AuthLayout;