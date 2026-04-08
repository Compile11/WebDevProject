import { useState } from "react";

const Create = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [author, setAuthor] = useState("");
    const [tags, setTags] = useState("");
    
    const tagsArray = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);

    const handleSubmit = (e) => {
        e.preventDefault();
        const post = { title, body, author, 
            tags: tagsArray
        };

        fetch('http://localhost:5000/api/posts', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post)
        }).then(() => {console.log("New post added");})
    }

return (
    <form onSubmit={handleSubmit}>
    <label>Title</label>
    <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
    />
    <label>Body</label>
    <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
    />
    <label>Author</label>
    <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
    />
    <label>Tags</label>
    <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
    />
    <button type="submit">Submit</button>

    </form>
);
}



export default Create;
