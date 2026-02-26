import { useEffect, useState } from "react";
import { getPosts, getMyPost, createPost, updatePost } from "../services/posts";
import { useAuth } from "../context/useAuth";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { username, logout } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const all = await getPosts();
    const mine = await getMyPost();

    const mineIds = new Set(
      Array.isArray(mine.data) ? mine.data.map((p) => p.id) : [],
    );

    const merged = Array.isArray(all.data)
      ? all.data.map((p) => ({
          ...p,
          mine: mineIds.has(p.id),
        }))
      : [];

    setPosts(merged);
  }

  async function handleCreate() {
    if (!title || !description) return;

    await createPost({ title, description });
    setTitle("");
    setDescription("");
    loadPosts();
  }

  async function handleUpdate(id) {
    await updatePost(id, {
      title: editTitle,
      description: editDescription,
    });
    setEditing(null);
    loadPosts();
  }

  return (
    <>
      <header className="blog-header">
        <strong>MiniBlog</strong>
        <div>
          <span>{username}</span>
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="blog-wrapper">
        <div className="blog-card">
          <h2>Nuevo Post</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
          />
          <button onClick={handleCreate}>Publicar</button>
        </div>

        {posts.length === 0 ? (
          <div className="empty-card">
            <h2>No hay posts</h2>
            <p>Publica el primero ✨</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={`post-card ${post.mine ? "mine" : ""}`}
            >
              {editing === post.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <div className="actions">
                    <button onClick={() => handleUpdate(post.id)}>
                      Guardar
                    </button>
                    <button onClick={() => setEditing(null)} className="cancel">
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  {post.mine && (
                    <button
                      className="edit"
                      onClick={() => {
                        setEditing(post.id);
                        setEditTitle(post.title);
                        setEditDescription(post.description);
                      }}
                    >
                      Editar
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </main>
    </>
  );
}
