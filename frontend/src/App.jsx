import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/navigation/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="min-h-screen w-screen">
      <NavBar />
      <div className="mx-[200px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
