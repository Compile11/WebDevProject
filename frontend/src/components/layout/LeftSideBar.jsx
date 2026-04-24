import { MessageSquare, LayoutList, HelpCircle, FileText, Gamepad2, Code, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeftSidebar({activeCategory, setActiveCategory}) {
    const navigate = useNavigate();

    const getButtonClass = (categoryName) => {
        const isActive = activeCategory === categoryName|| (!activeCategory && categoryName === "All Discussions");
        return `flex items-center gap-3 cursor-pointer p-2 rounded transition ${
            isActive ? "bg-gray-700 text-white font-semibold" : "text-gray-300 hover:text-white hover:bg-gray-700/50"
        }`;
    };

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hidden md:block">
            <button
                onClick={() => navigate('/post')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 transition cursor-pointer"
            >
                New Discussion
            </button>

            <div className="space-y-6">
                <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Main Categories</h3>
                    <ul className="space-y-2 text-sm">
                        <li onClick={() => setActiveCategory(null)} className={getButtonClass("All Discussions")}><LayoutList size={18} className="text-blue-500"/> All Discussions</li>
                        <li onClick={() => setActiveCategory("Q & A")} className={getButtonClass("Q & A")}><HelpCircle size={18} className="text-blue-400"/> Q & A</li>
                        <li onClick={() => setActiveCategory("Articles")} className={getButtonClass("Articles")}><FileText size={18} className="text-purple-400"/> Articles</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Computer Science</h3>
                    <ul className="space-y-2 text-sm">
                        <li onClick={() => setActiveCategory("Object-Oriented")} className={getButtonClass("Object-Oriented")}><Code size={18} className="text-yellow-500"/> Object-Oriented</li>
                        <li onClick={() => setActiveCategory("OS & Kernels")} className={getButtonClass("OS & Kernels")}><Terminal size={18} className="text-gray-400"/> OS & Kernels</li>
                        <li onClick={() => setActiveCategory("Game Dev")} className={getButtonClass("Game Dev")}><Gamepad2 size={18} className="text-red-400"/> Game Dev</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}