export default function RightSidebar({ totalThreads, onlineUsers }) {
    return (
        <div className="space-y-4 hidden lg:block">
            {/* Forum Stats Widget */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h3 className="text-white font-bold text-sm mb-4">Forum Statistics</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-400">
                        <span>Online Users</span>
                        <span className="text-blue-500 font-bold">{onlineUsers || 1}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Total Threads</span>
                        <span className="text-white">{totalThreads || 0}</span>
                    </div>
                </div>
            </div>

            {/* Staff Online Widget */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <h3 className="text-white font-bold text-sm mb-4">Staff Online</h3>
                <div className="space-y-3">
                    {/* Dimmed out Placeholder Staff */}
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-bold border-2 border-gray-600">?</div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-300 font-semibold leading-tight">Placeholder Staff</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Moderator</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}