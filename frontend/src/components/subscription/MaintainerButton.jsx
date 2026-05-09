export default function MaintainerButton({ isLoading, setIsLoading }) {
  const handleSubscribe = async (tier) => {
    setIsLoading(true);

    try {
      await subscribe(tier);
    } catch (err) {
      displayMessage("Could not start subscription checkout.", true);
      setIsLoading(false);
    }
  };

  const className = `
    rounded-lg border
    border-yellow-300 dark:border-yellow-500

    bg-yellow-100 hover:bg-yellow-200
    dark:bg-yellow-500/10 dark:hover:bg-yellow-500/30

    text-yellow-800 dark:text-yellow-300

    p-4 text-left transition duration-300
    disabled:opacity-50 cursor-pointer

    hover:shadow-lg
    hover:shadow-yellow-300 dark:hover:shadow-yellow-800

    transform hover:scale-[1.02] hover:-translate-y-0.5
  `;
  return (
    <button
      onClick={() => handleSubscribe("tier2")}
      disabled={isLoading}
      className={className}
    >
      <h3 className="font-bold text-gray-900 dark:text-white">Maintainer</h3>
      <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
        Remove ads and get a gold glowing dev badge.
      </p>
    </button>
  );
}
