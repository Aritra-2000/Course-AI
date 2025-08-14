import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wide hover:text-indigo-400 transition">
              Text<span className="text-indigo-400">Learn</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {token ? (
              <>
                <Link to="/dashboard" className="hover:text-indigo-400 transition">
                  My Courses
                </Link>
                <span className="text-gray-300">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow transition"
                >
                  Logout
                </button>
              </>
            ) : (
              null
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 space-y-3">
          {token ? (
            <>
              <Link to="/dashboard" className="block hover:text-indigo-400 transition">
                My Courses
              </Link>
              <span className="block text-gray-300">Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="w-full bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg shadow transition">
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
