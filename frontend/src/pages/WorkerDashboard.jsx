import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api, jsonOptions } from "../api";
import Rating from "../components/Rating";
import StatusBadge from "../components/StatusBadge";

export default function WorkerDashboard() {

  const s = JSON.parse(localStorage.getItem("session") || "null");
  
  const [worker, setWorker] = useState(null),
    [works, setWorks] = useState([]),
    [msg, setMsg] = useState("");

  const load = () =>
    Promise.all([
      api("/api/workers/" + s.workerid),
      api("/api/workers/" + s.workerid + "/works"),
    ]).then(([w, x]) => {
      setWorker(w);
      setWorks(x);
    });

  useEffect(() => {
    load();
  }, []);
  const status = async () => {
    await api(
      `/api/workers/${s.workerid}/status`,
      jsonOptions("PUT", {
        status: worker.status === "Available" ? "Unavailable" : "Available",
      }),
    );
    load();
  };

  const start = async (id) => {
    try {
      await api(
        `/api/reports/${id}/start`,
        jsonOptions("PUT", { workerid: s.workerid }),
      );
      setMsg("Work started.");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };
  
  const complete = (id) => {
    const send = (latitude = null, longitude = null) =>
      api(
        `/api/reports/${id}/complete`,
        jsonOptions("PUT", { workerid: s.workerid, latitude, longitude }),
      )
        .then(() => {
          setMsg("Work marked completed and forwarded for verification.");
          load();
        })
        .catch((e) => setMsg(e.message));
    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(
          (p) => send(p.coords.latitude, p.coords.longitude),
          () => send(),
        )
      : send();
  };
  if (!worker)
    return (
      <>
        <Navbar />
        <main className="container">Loading...</main>
      </>
    );
  return (
    <>
      <Navbar />
      <main className="container">
        <section className="hero">
          <div>
            <h1>Worker Dashboard</h1>
            <p>
              {worker.workerid} · {worker.department}
            </p>
          </div>
          <button
            className={worker.status === "Available" ? "primary" : "secondary"}
            onClick={status}
          >
            {worker.status === "Available"
              ? "Available for Work"
              : "Unavailable for Work"}
          </button>
        </section>
        <div className="grid3">
          <div className="stat">
            <span>Rating</span>
            <b>
              <Rating value={worker.rating} />
            </b>
          </div>
          <div className="stat">
            <span>Active Works</span>
            <b>{worker.active_works}</b>
          </div>
          <div className="stat">
            <span>Completed</span>
            <b>{worker.completed_works}</b>
          </div>
        </div>
        {msg && <div className="notice">{msg}</div>}
        <h2>Assigned Works</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {works.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.issue_name}</td>
                  <td>{r.location}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>
                    {r.status === "Assigned" && (
                      <button className="secondary" onClick={() => start(r.id)}>
                        Start Work
                      </button>
                    )}
                    {r.status === "In Progress" && (
                      <button
                        className="primary"
                        onClick={() => complete(r.id)}
                      >
                        Complete Work
                      </button>
                    )}
                    {!["Assigned", "In Progress"].includes(r.status) && "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
