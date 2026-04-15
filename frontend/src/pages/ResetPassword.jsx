import React, {useState} from "react";
import {useParams, Link} from "react-router-dom";

export default function ResetPassword() {
    const {token} = useParams();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if(newPassword!==confirmPassword){
            return setMessage("Passwords do not match");
        }
        if(newPassword.length < 6){
            return setMessage("Password is too short");
        }

        try{
            const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
               method: "PUT",
               headers: {"Content-Type": "application/json"},
               body: JSON.stringify({newPassword}),
            });
            const data = await response.json();

            if(response.ok){
                setIsSuccess(true);
                setMessage("Success: "+data.message);
            }else{
                setMessage("Error: "+data.message);
            }
        }catch(err){
            setMessage("Network error. Try again later");
        }
    };
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Create New Password</h2>

                {message && (
                    <div className={`p-3 mb-4 text-sm rounded border ${message.startsWith('Error') ? 'bg-red-900/50 text-red-400 border-red-800' : 'bg-green-900/50 text-green-400 border-green-800'}`}>
                        {message}
                    </div>
                )}

                {isSuccess ? (
                    <div className="text-center mt-6">
                        <Link to="/auth" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition">
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength="6"
                                className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength="6"
                                className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition mt-4"
                        >
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}