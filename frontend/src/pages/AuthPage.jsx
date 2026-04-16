import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import LoginSignup from "../components/auth/LoginSignup";
import ForgotPassword from "../components/auth/ForgotPassword";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate()

  return (
    <div className="relative flex flex-row h-screen w-screen">
      <div
        onClick={() => navigate("/")}
        className="absolute top-2 left-2 rounded-full bg-gray-200 hover:bg-gray-300 hover:text-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 p-1 dark:hover:text-white transition-all cursor-pointer"
      >
        <ArrowLeft />
      </div>
      <div
        className={`${isForgotPassword ? "w-full" : "w-1/2"} flex justify-center items-center h-full bg-gray-50 dark:bg-gray-800 transition-all duration-300`}
      >
        {!isForgotPassword ? (
          <LoginSignup setIsForgotPassword={setIsForgotPassword} />
        ) : (
          <ForgotPassword setIsForgotPassword={setIsForgotPassword} />
        )}
      </div>

      <div
        className={`${isForgotPassword ? "w-0" : "w-1/2"} relative h-full dark:opacity-75 transition-all duration-300`}
      >
        <img
          src="/AuthPageCover.jpg"
          alt="Auth page cover"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
