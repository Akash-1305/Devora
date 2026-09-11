import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapView from "../components/Map";
import StatusBadge from "../components/StatusBadge";
import Rating from "../components/Rating";
import { api, API, jsonOptions } from "../api";
export default function Verification() {
  const { id } = useParams(),
    nav = useNavigate(),
    s = JSON.parse(localStorage.getItem("session") || "null");
  const [r, setR] = useState(null),
    [msg, setMsg] = useState("");
  const load = () => api("/api/reports/" + id).then(setR);
  useEffect(() => {
    load();
  }, [id]);
  const act = async (action) => {
    try {
      const d = await api(
        `/api/admin/reports/${id}/${action}`,
        jsonOptions("PUT", { admin_id: s.id }),
      );
      setMsg(d.message);
      setR(d.report);
    } catch (e) {
      setMsg(e.message);
    }
  };
  if (!r)
    return (
      <>
        <Navbar />
        <main className="container">Loading...</main>
      </>
    );
  return (
    <>
      <Navbar />
      <main className="container narrow">
        <button className="linkbtn dark" onClick={() => nav("/admin")}>
          ← Back
        </button>
        <div className="card detail">
          <div className="row between">
            <h1>{r.issue_name}</h1>
            <StatusBadge status={r.status} />
          </div>
          <p>
            <b>Report ID:</b> {r.id}
          </p>
          <img className="issue-img" src={API + r.image_url} />
          <div className="details">
            <span>Location: {r.location}</span>
            <span>Ward: {r.ward}</span>
            <span>City: {r.city}</span>
            <span>Worker: {r.workerid || "—"}</span>
            <span>
              Worker Rating: <Rating value={r.worker_rating || 0} />
            </span>
            <span>Flag: {r.flag}</span>
            <span>
              Completed:{" "}
              {r.completed_at ? new Date(r.completed_at).toLocaleString() : "—"}
            </span>
          </div>
          <h3>Complaint Location</h3>
          <MapView lat={r.latitude} lon={r.longitude} />
          {r.worker_completion_latitude && (
            <>
              <h3>Worker Completion Location</h3>
              <MapView
                lat={r.worker_completion_latitude}
                lon={r.worker_completion_longitude}
                label="Worker completion location"
              />
            </>
          )}
          <div className="actions">
            {r.status === "Completed" && s.designation !== "DC" && (
              <>
                <button className="primary" onClick={() => act("verify")}>
                  Verify Issue
                </button>
                <button className="danger" onClick={() => act("reject")}>
                  Reject Work
                </button>
              </>
            )}
            {r.status === "DC Approval Required" && s.designation === "DC" && (
              <button className="primary" onClick={() => act("dc-approve")}>
                DC Approve
              </button>
            )}
          </div>
          {msg && <div className="notice">{msg}</div>}
        </div>
      </main>
    </>
  );
}
