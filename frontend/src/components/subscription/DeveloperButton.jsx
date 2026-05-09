import { subscribe } from "../../api/subscribe"

export default function DeveloperButton({ isLoading, setIsLoading }) {
  const handleSubscribe = async (tier) => {
    setIsLoading(true);

    try {
      await subscribe(tier);
    } catch (err) {
      displayMessage("Could not start subscription checkout.", true);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={() => handleSubscribe("tier1")}
      disabled={isLoading}
      className="rounded-lg border border-blue-300 dark:border-blue-500 bg-blue-100 hover:bg-blue-200 dark:bg-blue-600/20 dark:hover:bg-blue-600 text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-white p-4 text-left transition disabled:opacity-50 cursor-pointer"
    >
      <h3 className="font-bold text-gray-900 dark:text-white">Developer</h3>
      <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
        Remove ads and get a blue dev badge.
      </p>
    </button>
  );
}
