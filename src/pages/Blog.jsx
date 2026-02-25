import { useEffect, useState } from "react";
import { getPosts, getMyPost, createPost, updatePost } from "../services/posts";
import { useAuth } from "../context/useAuth";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const { username, logout } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const all = await getPosts();
    const mine = await getMyPost();

    const mineIds = new Set(mine.data.map((p) => p.id));
    const merged = all.data.map((p) => ({
      ...p,
      mine: mineIds.has(p.id),
    }));

    setPosts(merged);
  }

  async function handleCreate() {
    await createPost({ content });
    setContent("");
    loadPosts();
  }

  async function handleUpdate(id) {
    await updatePost(id, { content: editText });
    setEditing(null);
    loadPosts();
  }

  return (
    <div>
      <h2>Bienvenido {username}</h2>
      <button onClick={logout}>Cerrar sesión</button>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe algo..."
      />
      <button onClick={handleCreate}>Publicar</button>

      {posts.map((post) => (
        <div key={post.id} className={`post-card ${post.mine ? "mine" : ""}`}>
          {editing === post.id ? (
            <>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="post-actions">
                <button onClick={() => handleUpdate(post.id)}>Guardar</button>
                <button className="cancel" onClick={() => setEditing(null)}>
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{post.content}</p>
              {post.mine && (
                <>
                  <span className="badge">Tu post</span>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditing(post.id);
                      setEditText(post.content);
                    }}
                  >
                    Editar
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
