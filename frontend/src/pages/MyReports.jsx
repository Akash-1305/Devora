import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import MapView from "../components/Map";
import { api, API, jsonOptions } from "../api";
export default function MyReports() {
  const s = JSON.parse(localStorage.getItem("session") || "null");
  const [reports, setReports] = useState([]),
    [selected, setSelected] = useState(null),
    [rating, setRating] = useState(5),
    [comment, setComment] = useState(""),
    [msg, setMsg] = useState("");
  const load = () => api("/api/reports/user/" + s.userid).then(setReports);
  useEffect(() => {
    load();
  }, []);
  const feedback = async () => {
    try {
      const d = await api(
        "/api/feedback",
        jsonOptions("POST", {
          userid: s.userid,
          report_id: selected.id,
          rating,
          comment,
        }),
      );
      setMsg(d.message);
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };
  return (
    <>
      <Navbar />
      <main className="container">
        <h1>My Reports</h1>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Worker</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => {
                    setSelected(r);
                    setMsg("");
                  }}
                >
                  <td>{r.id}</td>
                  <td>{r.issue_name}</td>
                  <td>{r.location}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>{r.workerid || "Pending"}</td>
                  <td>{r.flag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!reports.length && <div className="empty">No reports found.</div>}
        {selected && (
          <div className="modal-back" onClick={() => setSelected(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="close" onClick={() => setSelected(null)}>
                ×
              </button>
              <h2>{selected.issue_name}</h2>
              <p>
                <b>{selected.id}</b> · <StatusBadge status={selected.status} />
              </p>
              <img className="issue-img" src={API + selected.image_url} />
              <p>{selected.location}</p>
              <MapView lat={selected.latitude} lon={selected.longitude} />
              <div className="details">
                <span>Ward: {selected.ward}</span>
                <span>Department: {selected.department}</span>
                <span>Worker: {selected.workerid || "Not assigned"}</span>
                <span>Flag: {selected.flag}</span>
              </div>
              {selected.status === "Closed" && (
                <div className="feedback-box">
                  <h3>Was the issue resolved successfully?</h3>
                  <select
                    value={rating}
                    onChange={(e) => setRating(+e.target.value)}
                  >
                    {[5, 4, 3, 2, 1].map((x) => (
                      <option key={x} value={x}>
                        {"★".repeat(x)} {x}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Optional comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="primary" onClick={feedback}>
                    Submit Feedback
                  </button>
                  {msg && <p>{msg}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
