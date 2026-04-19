import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../api/posts";
import CommentsSection from "../components/CommentsSection"

export default function PostDetailPage({ setTitle }) {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      const res = await getPostById(postId);

      if (res.error) {
        console.error(res.error);
        setError(res.error);
        return;
      }

      console.log(res);

      const post = res.data;

      setPost(post);
      setTitle(post.title);
    }

    fetchPost();

    return () => setTitle(null);
  }, [postId, setTitle]);

  if (error) return <p>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div>
      {post.body}
      <CommentsSection postId={post?._id}/>
    </div>
  );
}
