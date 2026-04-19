export function getTitleFromPath(pathname) {
  if (pathname === "/") return "Compile";
  if (pathname === "/post") return "Create Post";
  if (pathname === "/account") return "Profile";
}
