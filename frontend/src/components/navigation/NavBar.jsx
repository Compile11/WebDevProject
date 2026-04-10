import { Link } from "react-router-dom";
import { CircleUser, HomeIcon, PlusIcon } from "lucide-react";

export const NavBar = () => {
  return (
    <div className="w-full h-[60px]">
      <div className="mx-[200px] h-full flex items-center justify-between text-white">
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

              <div className="h-[18px] w-px bg-gray-400 opacity-0 group-hover:mx-2 group-hover:opacity-100 transition-all duration-200" />
              

              <span className="max-w-0 group-hover:max-w-[100px] overflow-hidden whitespace-nowrap transition-all duration-300">
                {route.label}
              </span>
            </Link>
          ))}
        </div>

        <div>
          {/* if logged out: */}
          <Link
            to="/auth"
            className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded transition-all"
          >
            Login
          </Link>

          {/* if logged in: */}
          {false && (
            <Link to={`/account/${userId}`}>
              <CircleUser />
            </Link>
          )}
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
    href: "/post",
    label: "Post",
    icon: <PlusIcon />,
  },
];
