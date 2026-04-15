import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/navigation/NavBar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage"
import PostPage from "./pages/PostPage";
import ThemeToggle from "./components/ui/ThemeToggle";
import { useLocation } from "react-router-dom"
import ProfilePage from "./pages/ProfilePage";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const location = useLocation();

  const hiddenNavbarRoutes = ["/auth"]
  const shouldHideNavbar = hiddenNavbarRoutes.includes(location.pathname)

  const layoutClass = hiddenNavbarRoutes.includes(location.pathname) ?
    "" : "mx-[200px]"

  return (
    <div className="min-h-screen w-screen">
      {!shouldHideNavbar && <NavBar />}
      <ThemeToggle />
      <div className={layoutClass}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/post" element={<PostPage />} />
            <Route path="/account" element={<ProfilePage />} />
          <Route path = "/forgot-password" element={<ForgotPassword />} />
          <Route path = "/reset-password/:token" element={<ResetPassword/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
