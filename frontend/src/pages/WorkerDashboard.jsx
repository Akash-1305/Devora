import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api, jsonOptions } from "../api";
import Rating from "../components/Rating";
import StatusBadge from "../components/StatusBadge";

export default function WorkerDashboard() {
  const [worker, setWorker] = useState(null);
  const [works, setWorks] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const session = JSON.parse(
    localStorage.getItem("session") || "null"
  );

  const workerId = session?.worker_id;

  const load = async () => {
    if (!workerId) {
      setMsg(
        "Worker session is missing worker_id. Please login again."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const [workerData, worksData] = await Promise.all([
        api(`/api/workers/${workerId}`),
        api(`/api/workers/${workerId}/works`),
      ]);

      setWorker(workerData);
      setWorks(
        Array.isArray(worksData)
          ? worksData
          : []
      );
    } catch (e) {
      console.error(e);

      setMsg(
        e?.message ||
          "Failed to load worker dashboard."
      );

      setWorker(null);
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async () => {
    if (!worker) return;

    try {
      setMsg("");

      const newStatus =
        worker.status === "Available"
          ? "Unavailable"
          : "Available";

      await api(
        `/api/workers/${workerId}/status`,
        jsonOptions("PUT", {
          status: newStatus,
        })
      );

      await load();
    } catch (e) {
      console.error(e);
      setMsg(
        e?.message ||
          "Failed to update worker status."
      );
    }
  };

  const startWork = async (id) => {
    try {
      setMsg("");

      await api(
        `/api/reports/${id}/start`,
        jsonOptions("PUT", {
          workerid: workerId,
        })
      );

      setMsg("Work started.");

      await load();
    } catch (e) {
      console.error(e);

      setMsg(
        e?.message ||
          "Failed to start work."
      );
    }
  };

  const completeWork = (id) => {
    const sendCompletion = (
      latitude = null,
      longitude = null
    ) => {
      api(
        `/api/reports/${id}/complete`,
        jsonOptions("PUT", {
          workerid: workerId,
          latitude,
          longitude,
        })
      )
        .then(() => {
          setMsg(
            "Work marked completed and forwarded for verification."
          );

          load();
        })
        .catch((e) => {
          console.error(e);

          setMsg(
            e?.message ||
              "Failed to complete work."
          );
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          sendCompletion(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        () => {
          sendCompletion();
        }
      );
    } else {
      sendCompletion();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="container">
          <div className="notice">
            Loading worker dashboard...
          </div>
        </main>
      </>
    );
  }

  if (!worker) {
    return (
      <>
        <Navbar />

        <main className="container">
          <div className="error">
            {msg ||
              "Worker information could not be loaded."}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container">
        <section className="hero">
          <div>
            <h1>Worker Dashboard</h1>

            <p>
              {worker.workerid ||
                worker.worker_id ||
                workerId}
              {" · "}
              {worker.department}
            </p>
          </div>

          <button
            className={
              worker.status === "Available"
                ? "primary"
                : "secondary"
            }
            onClick={toggleStatus}
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
              <Rating
                value={
                  worker.rating ?? 0
                }
              />
            </b>
          </div>

          <div className="stat">
            <span>Active Works</span>

            <b>
              {worker.active_works ?? 0}
            </b>
          </div>

          <div className="stat">
            <span>Completed</span>

            <b>
              {worker.completed_works ?? 0}
            </b>
          </div>
        </div>

        {msg && (
          <div className="notice">
            {msg}
          </div>
        )}

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
              {works.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No works assigned.
                  </td>
                </tr>
              ) : (
                works.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.id}
                    </td>

                    <td>
                      {r.issue_name ||
                        r.issue ||
                        "—"}
                    </td>

                    <td>
                      {r.location ||
                        "—"}
                    </td>

                    <td>
                      <StatusBadge
                        status={r.status}
                      />
                    </td>

                    <td>
                      {r.status === "Assigned" && (
                        <button
                          className="secondary"
                          onClick={() =>
                            startWork(r.id)
                          }
                        >
                          Start Work
                        </button>
                      )}

                      {r.status === "In Progress" && (
                        <button
                          className="primary"
                          onClick={() =>
                            completeWork(r.id)
                          }
                        >
                          Complete Work
                        </button>
                      )}

                      {![
                        "Assigned",
                        "In Progress",
                      ].includes(r.status) && "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}