import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { CircleUser, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AccountButton() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth");

    window.location.reload();
  };

  return (
      // 'relative' keeps the dropdown attached to this specific button
      <div className="relative inline-block text-left">
        {!currentUser ? (
            <Link
                to="/auth"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded transition-all"
            >
              Login
            </Link>
        ) : (
            <div>
              {/* Changed from <Link> to <button> to trigger the dropdown, but kept all of your teammate's awesome hover styling! */}
              <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="group flex flex-row items-center bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-all focus:outline-none"
              >
                <CircleUser />
                <span className="max-w-0 group-hover:max-w-[150px] group-hover:pl-2 overflow-hidden whitespace-nowrap transition-all duration-300">
              {currentUser.username}
            </span>
              </button>

              {/* The Dropdown Menu */}
              {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">

                    <div className="px-4 py-2 border-b border-gray-700 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      {/* Fallback to username if email isn't in context */}
                      <p className="text-sm font-bold text-white truncate">
                        {currentUser.email || currentUser.username}
                      </p>
                    </div>

                    {/* Moved their original /account link into the dropdown! */}
                    <Link
                        to="/account"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                    >
                      Your Profile
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition border-t border-gray-700 mt-1"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
              )}
            </div>
        )}
      </div>
  );
}
