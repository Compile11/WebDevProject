import {useState, useEffect} from 'react';

export default function CommentsSection({postId}) {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${postId}/comments`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                }
            } catch (err) {
                console.error("Failed to load comments", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!newCommentText.trim()) return;

        // 1. Grab the token and user data from localStorage
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        // Safety check: Make sure they are actually logged in
        if (!token || !userString) {
            alert("You must be logged in to post a comment!");
            return;
        }

        const user = JSON.parse(userString);

        try{
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 2. Attach the token to the Authorization header
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: newCommentText,
                    // 3. Use the real username from local storage!
                    authorName: user.username
                }),
            });

            if(response.ok){
                const savedComment = await response.json();
                setComments([...comments, savedComment]);
                setNewCommentText('');
            } else {
                // 4. STOP FAILING SILENTLY! Show us the error.
                const errorData = await response.json();
                console.error("Server Error:", errorData);
                alert(`Failed to post comment: ${errorData.message || "Unknown error"}`);
            }
        }catch(err){
            console.error("Network error while posting comment", err);
            alert("A network error occurred. Is the backend running?");
        }
    };


    if (isLoading) return <div className="text-gray-400 text-sm mt-4">Loading comments...</div>;

    return (
        <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Discussion ({comments.length})</h3>

            {/* The List of Comments */}
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

            {/* The Add Comment Form */}
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
        </div>);
}
