export function getFlairStyle(flair) {
    switch (flair) {
        case "Object-Oriented":
            return "bg-yellow-900/30 text-yellow-500 border-yellow-700/50";
        case "OS & Kernels":
            return "bg-red-900/30 text-red-400 border-red-700/50";
        case "Game Dev":
            return "bg-green-900/30 text-green-400 border-green-700/50";
        case "Q & A":
        case "Articles":
            return "bg-gray-700 text-gray-300 border-gray-500";
        default:
            return "bg-gray-800 text-gray-400 border-gray-700";
    }
}