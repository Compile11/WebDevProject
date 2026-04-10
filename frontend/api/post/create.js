import {useState} from 'react';
export default function Form(){
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagArray = tags.split(',').map(tag => tag.trim());

        const newPost = {
            title,
            body,
            author: author || "Anonymous Student",
            tags: tagArray
        };

        try{
            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            });
            if(response.ok){
                setTitle('');
                setBody('');
                setAuthor('');
                setTags('');
                alert("Posts added successfully, refresh page to see it");
            }
        }catch(err){
            console.error(err);
        }
    };
    return (
        <form onSubmit={handleSubmit} style={{ border: '2px dashed #007bff', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
            <h3>Ask a Question</h3>

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
        <textarea
            placeholder="What do you need help with?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows="4"
            style={{ width: '100%', padding: '8px' }}
        />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ flex: 1, padding: '8px' }}
                />
                <input
                    type="text"
                    placeholder="Tags (e.g. Java, Help, Final)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    style={{ flex: 1, padding: '8px' }}
                />
            </div>

            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Submit Post
            </button>
        </form>
    );
}
