import { Link } from "react-router-dom";
import { CircleUser, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AccountButton() {
  const { currentUser, logout } = useAuth();
  console.log(currentUser);

  return (
    <div className="relative group">
      {!currentUser ? (
        <Link
          to="/auth"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded transition-all"
        >
          Login
        </Link>
      ) : (
        <>
          <Link
            to={`/account/`}
            className="flex flex-row items-center bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-all"
          >
            <CircleUser />
            <span className="max-w-0 group-hover:max-w-[150px] group-hover:pl-2 overflow-hidden whitespace-nowrap transition-all duration-300">
              {currentUser.username}
            </span>
          </Link>

          <div className="absolute right-0 top-full opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-200 z-50">
            <div className="w-52 rounded-xl bg-gray-800 border-gray-700 shadow-lg overflow-hidden">
              <Link
                to="/account"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition"
              >
                <User />
                <span>My Account</span>
              </Link>

              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition"
              >
                <Settings />
                <span>Settings</span>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition text-left cursor-pointer"
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
