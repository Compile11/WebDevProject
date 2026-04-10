import { Link } from "react-router-dom";
import { HomeIcon, PlusIcon } from "lucide-react";

export const NavBar = () => {
  return (
    <div className="w-full py-4">
      <div className="mx-[200px] flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            to={route.href}
            className="group flex items-center bg-gray-700 hover:bg-gray-600 rounded-full px-2 h-[40px] transition-all overflow-hidden"
          >
            <div className="flex items-center justify-center w-[30px] h-[30px]">
              {route.icon}
            </div>

            <span className="max-w-0 group-hover:max-w-[100px] group-hover:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300">
              {route.label}
            </span>
          </Link>
        ))}
        </div>

        <div>
          <Link to="/auth" className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded transition-all">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const routes = [
  {
    href: "/",
    label: "Home",
    icon: <HomeIcon />,
  },
  {
    href: "/p",
    label: "Post",
    icon: <PlusIcon />,
  },
];
