import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api, jsonOptions } from "../api";
export default function Notifications() {
  const s = JSON.parse(localStorage.getItem("session") || "null");
  const [notes, setNotes] = useState([]);
  const load = () => api("/api/notifications/" + s.userid).then(setNotes);
  useEffect(() => {
    load();
  }, []);
  const read = async (id) => {
    await api(`/api/notifications/${id}/read`, jsonOptions("PUT", {}));
    load();
  };
  return (
    <>
      <Navbar />
      <main className="container narrow">
        <h1>Notifications</h1>
        {notes.map((n) => (
          <div
            key={n.id}
            className={"card notification " + (!n.is_read ? "unread" : "")}
          >
            <div>
              <b>{n.report_id || "JanSeva"}</b>
              <p>{n.message}</p>
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </div>
            {!n.is_read && (
              <button className="secondary" onClick={() => read(n.id)}>
                Mark read
              </button>
            )}
          </div>
        ))}
        {!notes.length && <div className="empty">No notifications yet.</div>}
      </main>
    </>
  );
}
