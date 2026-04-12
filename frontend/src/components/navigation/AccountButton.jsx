import { Link } from "react-router-dom";
import { CircleUser } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AccountButton() {
  const { currentUser } = useAuth();

  return (
    <div>
      {!currentUser ? (
        <Link
          to="/auth"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded transition-all"
        >
          Login
        </Link>
      ) : (
        <Link
          to={`/account/`}
          className="group flex flex-row items-center bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-all"
        >
          <CircleUser />
          <span className="max-w-0 group-hover:max-w-[150px] group-hover:pl-2 overflow-hidden whitespace-nowrap transition-all duration-300">
            {currentUser.username}
          </span>{" "}
        </Link>
      )}
    </div>
  );
}
