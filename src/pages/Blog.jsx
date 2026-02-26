import { useEffect, useState } from "react";
import { getPosts, getMyPost, createPost, updatePost } from "../services/posts";
import { useAuth } from "../context/useAuth";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const { username, logout } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const all = await getPosts();
    const mine = await getMyPost();

    const mineArray = Array.isArray(mine.data) ? mine.data : [];
    const mineIds = new Set(mineArray.map((p) => p.id));

    const merged = all.data.map((p) => ({
      ...p,
      mine: mineIds.has(p.id),
    }));

    setPosts(merged);
  }

  async function handleCreate() {
    await createPost({ title, description: content });
    setTitle("");
    setContent("");
    loadPosts();
  }

  async function handleUpdate(id) {
    await updatePost(id, { title: editTitle, description: editText });
    setEditing(null);
    loadPosts();
  }

  return (
    <>
      <header>
        <strong>MiniBlog</strong>
        <div>
          <span>{username}</span>
          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="blog-wrapper">
        <div className="blog-card">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Descripción"
          />
          <button onClick={handleCreate}>Publicar</button>
        </div>

        {posts.map((post) => (
          <div key={post.id} className={`post-card ${post.mine ? "mine" : ""}`}>
            {editing === post.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
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
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                {post.mine && (
                  <>
                    <span className="badge">Tu post</span>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditing(post.id);
                        setEditTitle(post.title);
                        setEditText(post.description);
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
      </main>
    </>
  );
}
