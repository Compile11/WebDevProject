import React, {useState} from "react";
import {Link} from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try{
            const response = await fetch(`http://localhost:5000/api/users/reset-password/${token}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if(response.ok){
                setMessage(`Successfully sent ${data.message}`);
            }else{
                setMessage(`Error: ${data.message}`);
            }

        }catch(err){
            setMessage("Network error, try again later");
        }finally{
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Reset Password</h2>

                {message && (
                    <div className={`p-3 mb-4 text-sm rounded border ${message.startsWith('Error') ? 'bg-red-900/50 text-red-400 border-red-800' : 'bg-green-900/50 text-green-400 border-green-800'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your registered email"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/auth" className="text-sm text-blue-400 hover:text-blue-300">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}