import { useState } from "react";
import { resetPasswordEmail } from "../../api/auth"

export default function ForgotPassword({ setIsForgotPassword }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await resetPasswordEmail(email)

    if (result.error) {
      setMessage(result.error.message || "Failed to send email")
      return
    }
    setMessage("Successfully sent reset password link")
    setIsLoading(false)
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 mb-6 text-center">
        Reset Password
      </h2>

      {message && (
        <div
          className={`p-3 mb-4 text-sm rounded border ${message.startsWith("Error") ? "bg-red-900/50 text-red-400 border-red-800" : "bg-green-900/50 text-green-400 border-green-800"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-50 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded text-black dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your registered email"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <div
          className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer"
          onClick={() => setIsForgotPassword((prev) => false)}
        >
          Back to Login
        </div>
      </div>
    </div>
  );
}
