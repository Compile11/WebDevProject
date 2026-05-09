import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateEmail, updatePassword, deleteMyAccount } from "../api/user";
import { Lock, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import SubscriptionPanel from "../components/subscription/SubscriptionPanel";

export default function SettingsPage() {
  const { currentUser, setCurrentUser, logout, authLoading } = useAuth();

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="text-center mt-20 text-gray-400">Loading Settings...</div>
    );
  }

  if (!currentUser) return <Navigate to="/" />;

  const displayMessage = (text, error = false) => {
    setIsError(error);
    setMessage(text);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await updateEmail(newEmail, emailPassword);

    if (res.error) {
      displayMessage(res.error, true);
    } else {
      displayMessage(res.data.message);
      setCurrentUser({ ...currentUser, email: res.data.email });
      setNewEmail("");
      setEmailPassword("");
    }

    setIsLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return displayMessage("Passwords do not match", true);
    }

    setIsLoading(true);

    const res = await updatePassword(currentPassword, newPassword);

    if (res.error) {
      displayMessage(res.error, true);
    } else {
      displayMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirmStr = `DELETE ${currentUser.username}`;
    const userInput = window.prompt(
      `WARNING: This is permanent.\n\nTo confirm, please type:\n${confirmStr}`,
    );

    if (userInput === confirmStr) {
      const res = await deleteMyAccount();

      if (!res.error) {
        alert("ACCOUNT DELETED");
        logout();
      } else {
        displayMessage(res.error, true);
      }
    }
  };
  const cardClass =
    "bg-gray-300 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 overflow-hidden";

  const cardHeaderClass =
    "bg-gray-200 dark:bg-gray-900/50 p-4 border-b border-gray-300 dark:border-gray-700 flex items-center gap-2";

  const headingClass = "text-lg font-bold text-gray-900 dark:text-white";

  const labelClass =
    "block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2";

  const inputClass =
    "w-full p-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-400 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 pb-20 space-y-8">
      {message && (
        <div
          className={`p-4 rounded flex items-center gap-2 font-semibold border transition-all ${isError
              ? "bg-red-900/50 text-red-400 border-red-800"
              : "bg-green-900/50 text-green-400 border-green-800"
            }`}
        >
          {isError ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          {message}
        </div>
      )}

      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <Mail className="text-blue-600 dark:text-blue-400" size={20} />
          <h2 className={headingClass}>Update Email</h2>
        </div>

        <form onSubmit={handleEmailChange} className="p-6 space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-400 mb-4">
            Current Email:{" "}
            <span className="font-bold text-gray-900 dark:text-gray-200">{currentUser.email}</span>
          </p>

          <div>
            <label className={labelClass}>
              New Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              placeholder="new@university.edu"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Confirm with Password
            </label>
            <input
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              required
              placeholder="Enter your current password"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Updating..." : "Update Email"}
          </button>
        </form>
      </div>

      <div className={cardClass}>
        <div className={cardHeaderClass}>
          <Lock className="text-blue-600 dark:text-blue-400" size={20} />
          <h2 className={headingClass}>Change Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <SubscriptionPanel
        currentUser={currentUser}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        displayMessage={displayMessage}

        cardClass={cardClass}
        cardHeaderClass={cardHeaderClass}
        headingClass={headingClass}
      />

      <div className="bg-red-100 dark:bg-red-900/10 rounded-lg shadow-lg border border-red-300 dark:border-red-900/50 overflow-hidden">
        <div className="bg-red-200 dark:bg-red-900/20 p-4 border-b border-red-300 dark:border-red-900/50 flex items-center gap-2">
          <AlertTriangle className="text-red-700 dark:text-red-500" size={20} />
          <h2 className="text-lg font-bold text-red-800 dark:text-red-500">
            Danger Zone
          </h2>
        </div>

        <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-1">
              Delete Account
            </h3>
            <p className="text-gray-700 dark:text-gray-400 text-sm">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-200 hover:bg-red-600 dark:bg-red-600/20 dark:hover:bg-red-600 text-red-800 hover:text-white dark:text-red-500 dark:hover:text-white border border-red-300 dark:border-red-600 font-bold py-2 px-6 rounded transition whitespace-nowrap cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
