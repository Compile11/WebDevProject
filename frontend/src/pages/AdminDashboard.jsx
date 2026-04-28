import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getAllUsers, updateUserRole, deleteUser } from "../api/admin";
import { ShieldAlert, Trash2, Shield, User as UserIcon } from "lucide-react";

export default function AdminDashboard() {
    const { currentUser, authLoading } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            const res = await getAllUsers();
            if (res.error) setError(res.error);
            else setUsers(res.data);
            setIsLoading(false);
        }
        if (currentUser?.role === 'admin') fetchUsers();

        else if (!authLoading) setIsLoading(false);
    }, [currentUser, authLoading]);

    // HANDLER: Change Role
    const handleRoleChange = async (userId, newRole) => {
        const res = await updateUserRole(userId, newRole);
        if (res.error) {
            setError(res.error);
        } else {
            // Instantly update the UI so we don't have to refresh the page
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            setError(""); // Clear any previous errors
        }
    };

    // HANDLER: Delete User
    const handleDeleteUser = async (userId, username) => {
        // Native browser confirmation so you don't accidentally click it
        if (!window.confirm(`Are you SURE you want to permanently delete ${username}? This cannot be undone.`)) return;

        const res = await deleteUser(userId);
        if (res.error) {
            setError(res.error);
        } else {
            // Remove the user from the table instantly
            setUsers(users.filter(u => u._id !== userId));
            setError("");
        }
    };

    if (authLoading || isLoading) return <div className="text-center mt-20 text-gray-400">Loading Secure Dashboard...</div>;
    if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/" />;

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4 pb-20">
            <div className="flex items-center gap-3 mb-8">
                <ShieldAlert className="text-red-500 w-8 h-8" />
                <h1 className="text-3xl font-bold text-white">Admin Control Panel</h1>
            </div>

            {error && <div className="bg-red-900/50 text-red-400 p-4 rounded mb-6 border border-red-800">{error}</div>}

            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-900 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-700">
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Role Control</th>
                            <th className="p-4 font-semibold">Joined</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-750 transition-colors bg-gray-800">
                                <td className="p-4 flex items-center gap-3">
                                    {user.profilePic ? (
                                        <img src={user.profilePic} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-600" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-xs font-bold border border-blue-700">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-gray-200 font-medium">{user.username}</span>
                                </td>

                                <td className="p-4 text-gray-400 text-sm">{user.email}</td>

                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {/* Dynamic Icon based on role */}
                                        {user.role === 'admin' ? <ShieldAlert size={16} className="text-red-400"/> : user.role === 'moderator' ? <Shield size={16} className="text-green-400"/> : <UserIcon size={16} className="text-gray-400"/>}

                                        {/* Sleek inline dropdown to change role */}
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            // Prevent admins from demoting themselves!
                                            disabled={user._id === currentUser.id}
                                            className={`bg-gray-900 border border-gray-700 text-sm rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer ${
                                                user.role === 'admin' ? 'text-red-400' : user.role === 'moderator' ? 'text-green-400' : 'text-gray-300'
                                            }`}
                                        >
                                            <option value="user" className="text-gray-300">User</option>
                                            <option value="moderator" className="text-green-400">Moderator</option>
                                            <option value="admin" className="text-red-400">Admin</option>
                                        </select>
                                    </div>
                                </td>

                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>

                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDeleteUser(user._id, user.username)}
                                        // Disable the trash button if it's the current user
                                        disabled={user._id === currentUser.id}
                                        className="p-1.5 bg-red-900/30 hover:bg-red-900 text-red-400 rounded transition border border-red-800/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex"
                                        title="Delete User"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}