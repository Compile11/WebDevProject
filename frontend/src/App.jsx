import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/navigation/NavBar";
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <div className="min-h-screen w-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={ <HomePage/> } />
        <Route path="/test" element={ <LoginPage /> } />
      </Routes>
    </div>
  );
}

export default App;
