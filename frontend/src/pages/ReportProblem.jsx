import { useState } from "react";
import Navbar from "../components/Navbar";
import { api, API } from "../api";

export default function ReportProblem() {
  const session = JSON.parse(localStorage.getItem("session") || "null");

  // Form states
  const [issue, setIssue] = useState("Streetlight Failure");
  const [loc, setLoc] = useState(null);
  const [ward, setWard] = useState("01");
  const [file, setFile] = useState(null);

  // Message states
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Get current location
  const getLocation = () => {
    setError("");

    navigator.geolocation?.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const baseLocation = {
          latitude,
          longitude,
          location: `${latitude}, ${longitude}`,
          ward: "",
          city: "Mysuru",
        };

        try {
          const data = await api(
            `/api/location/reverse?lat=${latitude}&lon=${longitude}`
          );

          setLoc({
            ...baseLocation,
            ...data,
          });

          // Update ward only if valid
          if (/^\d{1,2}$/.test(data.ward || "")) {
            setWard(data.ward);
          }
        } catch (err) {
          // Use coordinates if reverse geocoding fails
          setLoc(baseLocation);
        }
      },

      () => {
        setError(
          "Location permission is required to report an issue."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  // Submit report
  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMsg("");

    // Validation
    if (!loc) {
      setError("Please get your current location first.");
      return;
    }

    if (!file) {
      setError("Please upload a problem image.");
      return;
    }

    // Prepare form data
    const formData = new FormData();

    const reportData = {
      userid: session.userid,
      issue_name: issue,
      latitude: loc.latitude,
      longitude: loc.longitude,
      location: loc.location,
      ward,
      city: loc.city || "Mysuru",
    };

    Object.entries(reportData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("image", file);

    try {
      const response = await fetch(`${API}/api/reports`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.existing_report_id) {
          throw new Error(
            `${data.error} Existing Report: ${data.existing_report_id}`
          );
        }

        throw new Error(data.error);
      }

      const workerInfo = data.worker
        ? `, Worker: ${data.worker}`
        : "";

      setMsg(
        `Report ${data.report.id} registered successfully. ` +
          `Status: ${data.report.status}${workerInfo}`
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container narrow">
        <h1>Report a Civic Problem</h1>

        <form className="card form" onSubmit={submit}>
          {/* Problem Type */}
          <label>Problem Type</label>

          <select
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          >
            {[
              "Streetlight Failure",
              "Drain Block",
              "Pipe Leak",
            ].map((problem) => (
              <option key={problem} value={problem}>
                {problem}
              </option>
            ))}
          </select>

          {/* Location */}
          <label>Location</label>

          <button
            type="button"
            className="secondary"
            onClick={getLocation}
          >
            Use Current Location
          </button>

          {loc && (
            <div className="location-box">
              <b>Detected:</b> {loc.location}
              <br />

              <b>City:</b> {loc.city || "Mysuru"}
              <br />

              <b>Coordinates:</b>{" "}
              {loc.latitude.toFixed(6)},{" "}
              {loc.longitude.toFixed(6)}
            </div>
          )}

          {/* Ward */}
          <label>Ward Number</label>

          <input
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            placeholder="01"
            maxLength={2}
          />

          <small>
            Ward is auto-filled when available; otherwise use this
            fallback.
          </small>

          {/* Image */}
          <label>Upload Image</label>

          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {/* Error message */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* Success message */}
          {msg && (
            <div className="success">
              {msg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="primary">
            Submit Report
          </button>
        </form>
      </main>
    </>
  );
}