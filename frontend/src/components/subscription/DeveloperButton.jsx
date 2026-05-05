export default function DeveloperButton({ isLoading, onSubscribe }) {
  return (
    <button
      onClick={() => onSubscribe("tier1")}
      disabled={isLoading}
      className="rounded-lg border border-blue-500 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white p-4 text-left transition disabled:opacity-50 cursor-pointer"
    >
      <h3 className="font-bold text-white">Developer</h3>
      <p className="text-sm text-gray-400 mt-1">
        Remove ads and get a blue dev badge.
      </p>
    </button>
  );
}
