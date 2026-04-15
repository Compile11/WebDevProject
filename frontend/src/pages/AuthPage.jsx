import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../api/auth";
import { ArrowLeft, Loader } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true)

    try {
      if (isLogin) {
        const data = await loginUser({
          email,
          password,
        });

        login({
          user: data.user,
          token: data.token,
        });

        navigate("/");
      } else {
        const data = await registerUser({
          username,
          email,
          password,
        });

        login({
          user: data.user,
          token: data.token,
        });

        navigate("/");
      }
    } catch (error) {
      console.error("AUTHENTICATION ERROR:", error);
      setError(error.error || "Authentication failed");
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="relative flex flex-row h-screen w-screen">
      <div 
        onClick={() => navigate("/")}
        className="absolute top-2 left-2 rounded-full bg-gray-200 hover:bg-gray-300 hover:text-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 p-1 dark:hover:text-white transition-all cursor-pointer"
      >
        <ArrowLeft />
      </div>
      <div className="flex justify-center items-center h-full w-1/2 bg-gray-50 dark:bg-gray-800 transition-all">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-md border border-gray-200 dark:border-gray-600">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-50 pb-2">
            {isLogin ? "Welcome Back to Compile" : "Join the Discussion"}
          </h2>

          {error && (
            <div
              className="p-3 mb-4 text-sm rounded bg-red-100 text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Only show Username input if they are registering */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                  className="w-full p-2 border border-gray-300 text-black dark:text-gray-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CS_Student_99"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 text-black dark:text-gray-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="student@university.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-50 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 text-black dark:text-gray-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end mt-1 mb-4">
              <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              {isLoading ? <Loader className="animate-spin" size={18} /> : isLogin ? "Log In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-100">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(""); // Clear errors when toggling
              }}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-1/2 h-full dark:opacity-75 transition-all duration-300">
        <img
          src="/AuthPageCover.jpg"
          alt="Auth page cover"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
