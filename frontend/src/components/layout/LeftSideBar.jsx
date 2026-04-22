import { MessageSquare, LayoutList, HelpCircle, FileText, Gamepad2, Code, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeftSidebar() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hidden md:block">
            {/* Updated to blue-600 and added navigation */}
            <button
                onClick={() => navigate('/post')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 transition cursor-pointer"
            >
                New Discussion
            </button>

            <div className="space-y-6">
                <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Main Categories</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        {/* Updated icon to blue-500 */}
                        <li className="flex items-center gap-3 hover:text-white cursor-pointer p-2 rounded hover:bg-gray-700/50 transition"><LayoutList size={18} className="text-blue-500"/> All Discussions</li>
                        <li className="flex items-center gap-3 hover:text-white cursor-pointer p-2 rounded hover:bg-gray-700/50 transition"><HelpCircle size={18} className="text-blue-400"/> Q & A</li>
                        <li className="flex items-center gap-3 hover:text-white cursor-pointer p-2 rounded hover:bg-gray-700/50 transition"><FileText size={18} className="text-purple-400"/> Articles</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Computer Science</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-center gap-3 hover:text-white cursor-pointer p-2 rounded hover:bg-gray-700/50 transition"><Code size={18} className="text-yellow-500"/> Object-Oriented</li>
                        <li className="flex items-center gap-3 hover:text-white cursor-pointer p-2 rounded hover:bg-gray-700/50 transition"><Terminal size={18} className="text-gray-400"/> OS & Kernels</li>
                        <li className="flex items-center gap-3 hover:text-white cursor-pointer p-2 rounded hover:bg-gray-700/50 transition"><Gamepad2 size={18} className="text-red-400"/> Game Dev</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}