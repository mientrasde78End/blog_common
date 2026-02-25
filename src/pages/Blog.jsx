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

  return (
    <>
      <header>
        <strong>MiniBlog</strong>
        <div>
          <span>{username}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section>
        {posts.map((p) => {
          const isMine = myPost && p.id === myPost.id;

          return (
            <div key={p.id} ref={isMine ? myPostRef : null}>
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
                  <button onClick={handleUpdate}>Guardar</button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setTitle(myPost.title);
                      setContent(myPost.content);
                    }}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <h3>{p.title}</h3>
                  <p>{p.content}</p>
                  <small>@{p.username}</small>
                  {isMine && (
                    <button onClick={() => setEditing(true)}>Editar</button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </section>

      {!myPost && (
        <form onSubmit={handleCreate}>
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
      )}
    </>
  );
}
