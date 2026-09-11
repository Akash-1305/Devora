import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api, jsonOptions } from "../api";
import ReportCard from "../components/ReportCard";

export default function UserDashboard() {
  const session = JSON.parse(localStorage.getItem("session") || "null");

  const [reports, setReports] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (session?.userid) {
      api(`/api/reports/user/${session.userid}`).then(setReports);

      api(`/api/notifications/${session.userid}`)
        .then((notes) => {
          const unread = notes.filter((note) => !note.is_read);

          if (
            unread.length &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("JanSeva", {
              body: unread[0].message,
            });
          }
        })
        .catch(() => {});
    }

    if (
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }

    if (navigator.geolocation && session?.userid) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          api(
            `/api/nearby-solved?userid=${session.userid}&lat=${latitude}&lon=${longitude}`
          )
            .then((items) => {
              setNearby(items);

              if (
                items.length &&
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                new Notification("JanSeva nearby update", {
                  body: items[0].message,
                });
              }
            })
            .catch(() => {});
        },
        () => {}
      );
    }
  }, []);

  const sendFeedback = async (report) => {
    try {
      const data = await api(
        "/api/feedback",
        jsonOptions("POST", {
          userid: session.userid,
          report_id: report.report_id,
          rating,
          comment,
        })
      );

      setMsg(data.message);
    } catch (error) {
      setMsg(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container">
        <section className="hero">
          <div>
            <h1>Welcome, {session?.name}</h1>
            <p>
              Report and track civic issues in Mysuru through JanSeva.
            </p>
          </div>

          <Link className="primary button" to="/report">
            + Report Problem
          </Link>
        </section>

        {nearby.length > 0 && (
          <div className="notice">
            <b>Nearby solved issue</b>

            <p>{nearby[0].message}</p>

            <p>
              <b>{nearby[0].issue_name}</b> · {nearby[0].location}
            </p>

            <div className="row">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ maxWidth: 120 }}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} ★
                  </option>
                ))}
              </select>

              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment"
              />

              <button
                className="primary"
                onClick={() => sendFeedback(nearby[0])}
              >
                Give Feedback
              </button>
            </div>

            {msg && <small>{msg}</small>}
          </div>
        )}

        <div className="grid3">
          <Link className="card action" to="/report">
            <h3>Report Problem</h3>
            <p>Streetlights, drains and pipe leaks.</p>
          </Link>

          <Link className="card action" to="/my-reports">
            <h3>My Reports</h3>
            <p>Track status and worker assignment.</p>
          </Link>

          <Link className="card action" to="/notifications">
            <h3>Notifications</h3>
            <p>See verification and closure updates.</p>
          </Link>
        </div>

        <h2>Recent Reports</h2>

        <div className="grid2">
          {reports.slice(0, 4).map((report) => (
            <ReportCard key={report.id} r={report} />
          ))}

          {!reports.length && (
            <div className="empty">
              No reports yet.
            </div>
          )}
        </div>
      </main>
    </>
  );
}