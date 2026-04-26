export default function RightSidebar({ totalThreads, onlineUsers, onlineStaff = [] }) {
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

                    {onlineStaff.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No staff currently online.</p>
                    ) : (
                        onlineStaff.map(staff => (
                            <div key={staff._id} className="flex items-center gap-3">
                                {staff.profilePic ? (
                                    <img src={staff.profilePic} alt={staff.username} className="w-8 h-8 rounded-full object-cover border-2 border-gray-600" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-xs font-bold border-2 border-blue-700">
                                        {staff.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className={`text-sm font-semibold leading-tight ${staff.role === 'admin' ? 'text-red-400' : 'text-green-400'}`}>
                                        {staff.username}
                                    </span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{staff.role}</span>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
}