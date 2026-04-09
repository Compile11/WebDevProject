export const NavBar = () => { 
  return (
    <div className="w-full bg-gray-700">
      <div className="max-w-5xl mx-[200px] h-[50px] bg-gray-800 px-6">
        <div className="flex h-full items-center space-x-12 text-white">
          {routes.map((route) => 
            <div>
              {route.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/p",
    label: "Post",
  }, 
]
