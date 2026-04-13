import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Importing your teammate's context!

export default function CommentsSection({ postId }) {
    // 1. All hooks must live right here at the top of the component!
    const { currentUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // 2. The GET Request: Fetches comments when the page loads
    useEffect(() => {
        const fetchComments = async () => {
            try {
                // NO MORE GITHUB! Pointing directly to your local database
                const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`);
                if(response.ok){
                    const data = await response.json();
                    setComments(data);
                }
            } catch(err) {
                console.error("Failed to load comments", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    // 3. The POST Request: Sends your new comment to the server
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!newCommentText.trim()) return;

        if (!currentUser) {
            alert("You must be logged in to post a comment!");
            return;
        }

        const token = localStorage.getItem('token');

        try {
            // NO MORE GITHUB! Pointing directly to your local database
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: newCommentText,
                    // Pulling directly from your secure AuthContext
                    authorName: currentUser.username || currentUser.email
                }),
            });

            if(response.ok){
                const savedComment = await response.json();
                setComments([...comments, savedComment]); // Update UI
                setNewCommentText(''); // Clear the box
            } else {
                const errorData = await response.json();
                console.error("Server Error:", errorData);
                alert(`Failed to post comment: ${errorData.message || "Unknown error"}`);
            }
        } catch(err) {
            console.error("Network error while posting comment", err);
            alert("A network error occurred. Is the backend running?");
        }
    };

    if(isLoading) return <div className="text-gray-400 text-sm mt-4">Loading comments...</div>;

    return(
        <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Discussion ({comments.length})</h3>

            <div className="space-y-4 mb-6">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No comments yet. Start the conversation!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                            <span className="text-blue-400 font-bold text-sm mr-2">{comment.authorName}</span>
                            <span className="text-gray-500 text-xs">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            <p className="text-gray-300 mt-1 text-sm">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add to the discussion..."
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                    required
                />
                <button
                    type="submit"
                    className="self-end bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition"
                >
                    Post Reply
                </button>
            </form>
        </div>
    );
}