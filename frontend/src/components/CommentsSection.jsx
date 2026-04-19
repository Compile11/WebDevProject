import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getComments, createComment } from "../api/comments";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as dark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CommentsSection({ postId }) {
  // 1. All hooks must live right here at the top of the component
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 2. The GET Request: Fetches comments when the page loads
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await getComments(postId)
        setComments(data)
      } catch (err) {
        console.error("Failed to load comments:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadComments()
  }, [postId]);

  // 3. The POST Request: Sends new comment to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCommentText.trim()) return;

    if (!currentUser) {
      alert("You must be logged in to post a comment!");
      return;
    }

    try {
      const savedComment = await createComment({
        postId,
        text: newCommentText
      })

      setComments((prev) => [...prev, savedComment])
      setNewCommentText("")
    } catch (err) {
      console.error("Failed to post comment:", err)
      alert(err.message || "Failed to post comment")
    }

  };

  if (isLoading)
    return (
      <div className="text-gray-400 text-sm mt-4">Loading comments...</div>
    );

  return (
    <div className="mt-6 border-t border-gray-700 pt-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">
        Discussion ({comments.length})
      </h3>

      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-800 p-3 rounded-lg border border-gray-700"
            >
              <span className="text-blue-400 font-bold text-sm mr-2">
                {comment.userId?.username}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              <div className="text-gray-300 mt-1 text-sm">
                <Markdown
                  components={{
                    code(props) {
                      const {children, inline, className, ...rest} = props
                      const isLangBlock = className && className.startsWith('language-');
                      const language = isLangBlock ? className.replace('language-', '') : '';

                      // return if ```{language}
                      if(!inline && isLangBlock) {
                        return (
                          <div className="relative my-3 rounded-md overflow-hidden border border-gray-700">
                          <div className="flex justify-between items-center bg-gray-900 px-3 py-1 text-[10px] text-white-700 font-mono border-b border-gray-700">
                            <span className="text-[12px]">{language}</span>
                            <button 
                              type="button"
                              onClick={() => navigator.clipboard.writeText(String(children))}
                              className="hover:text-white transition-colors border rounded-full px-1 py-0.5"
                            >
                              Copy
                            </button>
                          </div>
                          <SyntaxHighlighter
                            {...rest}
                              PreTag="div"
                              language={language}
                              style={dark}
                              customStyle={{
                                margin: 0,
                                padding: '1rem',
                                fontSize: '13px',
                                lineHeight: '1.5',
                                overflowX: 'auto',
                                backgroundColor: 'transparent'
                              }}
                              codeTagProps={{
                                className: "!whitespace-pre !block",
                                style: {
                                  backgroundColor: 'transparent',
                                  whiteSpace: 'pre'
                                }
                              }}
                          >
                            {String(children).trimEnd()}
                          </SyntaxHighlighter>
                          </div>
                        );
                      }
                      
                      // Return the rest normally
                      return (
                        <code {...rest} className={className}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {comment.text}
                </Markdown>
              </div>
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
          className="self-end bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          Post Reply
        </button>
      </form>
    </div>
  );
}
