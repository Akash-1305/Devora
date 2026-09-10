import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { baseUrl } from "../../App";

export default function Report() {
  const [issueName, setIssueName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [reportList, setReportList] = useState([]);

  const userid = localStorage.getItem("userid");

  const issueTypes = [
    "Pothole",
    "Garbage",
    "Street Light",
    "Water Leakage",
    "Drainage",
    "Road Damage",
    "Broken Footpath",
    "Traffic Signal",
    "Other",
  ];

  const categories = [
    "Road",
    "Waste Management",
    "Water Supply",
    "Drainage",
    "Street Light",
    "Traffic",
    "Public Infrastructure",
    "Other",
  ];

  useEffect(() => {
    getReports();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lon);
        setLocation(`${lat}, ${lon}`);
      },
      (error) => {
        console.log("Location error:", error);
        alert("Unable to get your current location.");
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImage(null);
      setImagePreview("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG and PNG images are allowed.");
      e.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userid) {
      alert("User ID not found. Please login again.");
      return;
    }

    if (!image) {
      alert("Please upload an image of the problem.");
      return;
    }

    if (!latitude || !longitude) {
      alert("Please provide a valid location.");
      return;
    }

    const formData = new FormData();

    formData.append("issue_name", issueName);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("ward", ward);
    formData.append("city", city);
    formData.append("userid", userid);
    formData.append("image", image);

    try {
      const response = await axios.post(
        baseUrl + "/api/reports",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      clearFields();
      getReports();
    } catch (error) {
      console.log("Error creating report:", error);

      if (error.response?.status === 409) {
        alert(
          error.response.data.error ||
            "This issue has already been registered."
        );
      } else {
        alert(
          error.response?.data?.error ||
            "Failed to register the report."
        );
      }
    }
  };

  const getReports = async () => {
    try {
      if (!userid) return;

      const response = await axios.get(
        `${baseUrl}/api/reports?userid=${userid}`
      );

      setReportList(response.data.reports || response.data || []);
    } catch (error) {
      console.log("Error fetching reports:", error);
    }
  };

  const clearFields = () => {
    setIssueName("");
    setCategory("");
    setLocation("");
    setLatitude("");
    setLongitude("");
    setWard("01");
    setCity("Mysuru");
    setImage(null);
    setImagePreview("");

    const imageInput = document.getElementById("image");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Registered":
        return "bg-primary";
      case "Assigned":
        return "bg-info text-dark";
      case "Started":
        return "bg-warning text-dark";
      case "Completed":
        return "bg-success";
      case "Verified":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-success text-white">
          <h2 className="mb-0">Report a Civic Issue</h2>
          <small>
            Help us identify and resolve problems in your area.
          </small>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label className="form-label fw-bold">
              Problem Type
            </label>

            <select
              className="form-select mb-3"
              value={issueName}
              onChange={(e) => setIssueName(e.target.value)}
              required
            >
              <option value="">
                --- Select Problem Type ---
              </option>

              {issueTypes.map((issue) => (
                <option key={issue} value={issue}>
                  {issue}
                </option>
              ))}
            </select>

            <label className="form-label fw-bold">
              Category
            </label>

            <select
              className="form-select mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">
                --- Select Category ---
              </option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label className="form-label fw-bold">
              Location
            </label>

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter problem location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <button
                type="button"
                className="btn btn-outline-success"
                onClick={getCurrentLocation}
              >
                Use Current Location
              </button>
            </div>

            <Row>
              <Col md={6}>
                <label className="form-label fw-bold">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  className="form-control mb-3"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Latitude"
                  required
                />
              </Col>

              <Col md={6}>
                <label className="form-label fw-bold">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  className="form-control mb-3"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Longitude"
                  required
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <label className="form-label fw-bold">
                  Ward
                </label>

                <input
                  type="text"
                  className="form-control mb-3"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="Ward number"
                  required
                />
              </Col>

              <Col md={6}>
                <label className="form-label fw-bold">
                  City
                </label>

                <input
                  type="text"
                  className="form-control mb-3"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Col>
            </Row>

            <label className="form-label fw-bold">
              Problem Image
            </label>

            <input
              type="file"
              id="image"
              className="form-control mb-3"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
              required
            />

            {imagePreview && (
              <div className="mb-3">
                <p className="fw-bold mb-2">
                  Image Preview:
                </p>

                <img
                  src={imagePreview}
                  alt="Problem preview"
                  className="img-thumbnail"
                  style={{
                    width: "250px",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-success"
              >
                Submit Report
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFields}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <h2 className="mb-4">My Reports</h2>

      {reportList.length === 0 ? (
        <div className="alert alert-info">
          You have not submitted any reports yet.
        </div>
      ) : (
        <Row>
          {reportList.map((report) => (
            <Col md={6} lg={4} key={report.id}>
              <div className="card shadow-sm mb-4 h-100">
                {report.image && (
                  <img
                    src={
                      report.image.startsWith("http")
                        ? report.image
                        : `${baseUrl}/uploads/${report.image}`
                    }
                    alt={report.issue_name}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="card-title">
                      {report.issue_name}
                    </h4>

                    <span
                      className={`badge ${getStatusClass(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="mb-2">
                    <strong>Report ID:</strong> {report.id}
                  </p>

                  <p className="mb-2">
                    <strong>Category:</strong> {report.category}
                  </p>

                  <p className="mb-2">
                    <strong>Location:</strong> {report.location}
                  </p>

                  <p className="mb-2">
                    <strong>Ward:</strong> {report.ward}
                  </p>

                  <p className="mb-2">
                    <strong>Department:</strong>{" "}
                    {report.department}
                  </p>

                  <p className="mb-2">
                    <strong>Flag:</strong>{" "}
                    <span
                      className={
                        report.flag === "YES"
                          ? "text-danger fw-bold"
                          : "text-success"
                      }
                    >
                      {report.flag}
                    </span>
                  </p>

                  {report.created_at && (
                    <p className="text-muted small">
                      Submitted:{" "}
                      {new Date(
                        report.created_at
                      ).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="card-footer bg-white">
                  <div className="d-flex justify-content-between">
                    <span>
                      {report.latitude},{" "}
                      {report.longitude}
                    </span>

                    {report.workerid && (
                      <span className="text-success">
                        Worker Assigned
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
