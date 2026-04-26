import { Link } from "react-router-dom";
import { HomeIcon, PlusIcon } from "lucide-react";
import AccountButton from "./AccountButton";

export const NavBar = ({ title }) => {
  return (
    <div className="w-full h-[60px]">
      <div className="w-full max-w-[1600px] mx-auto h-full flex items-center justify-between text-white px-4 lg:px-[200px]">
        <div className="flex items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className="group flex items-center text-gray-600 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full px-2 h-[40px] transition-all overflow-hidden"
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

        <div className="absolute left-1/2 -translate-x-1/2 text-3xl text-gray-800 dark:text-white font-semibold pointer-events-none">
          {title}
        </div>
        <AccountButton />
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
