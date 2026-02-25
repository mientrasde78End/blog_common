import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, getMyPost, createPost, updatePost } from "../services/posts";
import { useAuth } from "../context/useAuth";

export default function Blog() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [myPost, setMyPost] = useState(null);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const myPostRef = useRef(null);

  useEffect(() => {
    async function load() {
      const all = await getPosts();
      setPosts(all.data);

      try {
        const mine = await getMyPost();
        setMyPost(mine.data);
        setTitle(mine.data.title);
        setContent(mine.data.content);
      } catch {
        setMyPost(null);
      }
    }

    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await createPost({ title, content });
    window.location.reload();
  }

  async function handleUpdate() {
    await updatePost(myPost.id, { title, content });
    setEditing(false);
    window.location.reload();
  }

  function goToMyPost() {
    myPostRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* HEADER */}
      <header>
        <strong>MiniBlog</strong>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>{username}</span>

          {myPost && (
            <button className="edit-btn" onClick={goToMyPost}>
              Ir a mi post
            </button>
          )}

          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* POSTS */}
      <section>
        {posts.map((p) => {
          const isMine = myPost && p.id === myPost.id;

          return (
            <div
              key={p.id}
              ref={isMine ? myPostRef : null}
              className={`post-card ${isMine ? "mine" : ""}`}
            >
              {isMine && editing ? (
                <>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <div className="post-actions">
                    <button onClick={handleUpdate}>Guardar</button>
                    <button
                      className="cancel"
                      onClick={() => {
                        setEditing(false);
                        setTitle(myPost.title);
                        setContent(myPost.content);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{p.title}</h3>
                  <p>{p.content}</p>
                  <small>@{p.username}</small>

                  {isMine && (
                    <>
                      <div className="badge">Tu post</div>
                      <button
                        className="edit-btn"
                        onClick={() => setEditing(true)}
                      >
                        Editar
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </section>

      {/* MODAL PRIMER POST */}
      {!myPost && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={handleCreate}>
            <h2>Publica tu primer post</h2>

            <input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Descripción"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <button>Publicar</button>
          </form>
        </div>
      )}
    </>
  );
}
