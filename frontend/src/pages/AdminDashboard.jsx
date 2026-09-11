import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";
import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const s = JSON.parse(localStorage.getItem("session") || "null");
  const [data, setData] = useState(null);
  const nav = useNavigate();
  const load = () => api("/api/admin/reports?admin_id=" + s.id).then(setData);
  useEffect(() => {
    load();
  }, []);
  if (!data)
    return (
      <>
        <Navbar />
        <main className="container">Loading...</main>
      </>
    );
  const cards = [
    ["Total Reports", data.stats.total],
    ["Pending Verification", data.stats.pending_verification],
    ["Completed", data.stats.completed],
    ["Verified", data.stats.verified],
    ["Flagged", data.stats.flagged],
    ["DC Approval", data.stats.dc_required],
  ];
  return (
    <>
      <Navbar />
      <main className="container">
        <section className="hero">
          <div>
            <h1>
              {s.designation === "DC"
                ? "DC Approval Dashboard"
                : "Admin Dashboard"}
            </h1>
            <p>
              {s.name} · {s.designation}
            </p>
          </div>
        </section>
        <div className="grid3">
          {cards.map(([k, v]) => (
            <div className="stat" key={k}>
              <span>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
        <h2>
          {s.designation === "DC"
            ? "Flagged Reports Requiring Approval"
            : "Department Reports"}
        </h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Worker</th>
                <th>Flag</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.reports
                .filter(
                  (r) =>
                    s.designation !== "DC" ||
                    r.status === "DC Approval Required",
                )
                .map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.issue_name}</td>
                    <td>{r.location}</td>
                    <td>{r.workerid || "—"}</td>
                    <td>{r.flag}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td>
                      <button
                        className="secondary"
                        onClick={() => nav("/verification/" + r.id)}
                      >
                        View
                      </button>
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
