import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/navigation/NavBar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import PostPage from "./pages/PostPage";
import ThemeToggle from "./components/ui/ThemeToggle";
import { useLocation } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PostDetailPage from "./pages/PostDetailPage";
import { getTitleFromPath } from "./utils/getTitleFromPath";
import { useState } from "react";
import PublicProfilePage from "./pages/PublicProfilePage";

function App() {
  const location = useLocation();

  const [dynamicTitle, setDynamicTitle] = useState(null);

  const fallbackTitle = getTitleFromPath(location.pathname);
  const title = dynamicTitle || fallbackTitle;

  const hiddenNavbarRoutes = ["/auth"];
  const shouldHideNavbar = hiddenNavbarRoutes.includes(location.pathname);

  const layoutClass = hiddenNavbarRoutes.includes(location.pathname)
    ? ""
    : "w-full max-w-[1600px] mx-auto";

  return (
    <div className="min-h-screen w-screen">
      {!shouldHideNavbar && <NavBar title={title} />}
      <ThemeToggle />
      <div className={layoutClass}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/user/:userId" element={<PublicProfilePage />} />
          <Route
            path="/p/:postId"
            element={<PostDetailPage setTitle={setDynamicTitle} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
