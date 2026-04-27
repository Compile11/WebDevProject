import {useState, useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import {Navigate} from "react-router-dom";
import {getAllUsers} from "../api/admin";
import {ShieldAlert, Trash2, Shield, User as UserIcon} from "lucide-react";

export default function AdminDashboard() {
    const {currentUser, authLoading} = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            const res = await getAllUsers();
            if(res.error) setError(res.error);
            else setUsers(res.data);
            setIsLoading(false);
        }
        if (currentUser?.role === "admin") fetchUsers();
    }, [currentUser]);

    if(authLoading||isLoading) return <div className="text-center mt-20 text-gray-400">Loading Secure Dashboard...</div>;
    if(!currentUser || currentUser.role!== "admin") return <Navigate to="/" />;

    return(
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
                            <th className="p-4 font-semibold">Role</th>
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
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                            user.role === 'admin' ? 'bg-red-900/30 text-red-400 border-red-800' :
                                                user.role === 'moderator' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                                    'bg-gray-700 text-gray-300 border-gray-600'
                                        }`}>
                                            {user.role === 'admin' ? <ShieldAlert size={12}/> : user.role === 'moderator' ? <Shield size={12}/> : <UserIcon size={12}/>}
                                            {user.role}
                                        </span>
                                </td>

                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>

                                <td className="p-4 flex justify-end gap-2">
                                    <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition border border-gray-600">
                                        Edit Role
                                    </button>
                                    <button className="p-1.5 bg-red-900/30 hover:bg-red-900 text-red-400 rounded transition border border-red-800/50">
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