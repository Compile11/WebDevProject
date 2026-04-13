import { Link } from "react-router-dom";
import { CircleUser, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AccountButton() {
  const { currentUser, logout } = useAuth();
  console.log(currentUser);

  return (
    <div className="relative group text-gray-700 dark:text-white">
      {!currentUser ? (
        <Link
          to="/auth"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded transition-all text-white"
        >
          Login
        </Link>
      ) : (
        <>
          <Link
            to={`/account/`}
            className="flex flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-full p-2 dark:hover:bg-gray-600 transition-all"
          >
            <CircleUser />
            <span className="max-w-0 group-hover:max-w-[150px] group-hover:pl-2 overflow-hidden whitespace-nowrap transition-all duration-300">
              {currentUser.username}
            </span>
          </Link>

          <div className="absolute right-0 top-full opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-200 z-50">
            <div className="w-52 rounded-xl bg-gray-200 dark:bg-gray-700 border-gray-700 shadow-lg overflow-hidden">
              <Link
                to="/account"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                <User />
                <span>My Account</span>
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                <Settings />
                <span>Settings</span>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-left cursor-pointer text-red-400 hover:text-red-500"
              >
                <LogOut />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
