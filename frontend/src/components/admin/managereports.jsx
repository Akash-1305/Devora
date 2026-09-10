import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { baseUrl } from "../../App";

export default function ManageProducts() {
  const [reportedList, setReportedList] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  const [wards, setWards] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedWard, setSelectedWard] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    getReports();
    getFilters();
  }, []);

  useEffect(() => {
    filterAndSortReports();
  }, [
    reportedList,
    selectedWard,
    selectedLocation,
    sortBy,
  ]);

  const getReports = () => {
    axios
      .get(baseUrl + "/api/reports")
      .then((res) => {
        setReportedList(res.data.reports || res.data || []);
      })
      .catch((err) => {
        console.log("Error fetching reports:", err);
      });
  };

  const getFilters = () => {
    axios
      .get(baseUrl + "/api/reports/filters")
      .then((res) => {
        setWards(res.data.wards || []);
        setLocations(res.data.locations || []);
      })
      .catch((err) => {
        console.log("Error fetching filters:", err);
      });
  };

  const filterAndSortReports = () => {
    let reports = [...reportedList];

    if (selectedWard) {
      reports = reports.filter(
        (report) =>
          String(report.ward) === String(selectedWard)
      );
    }

    if (selectedLocation) {
      reports = reports.filter(
        (report) =>
          report.location === selectedLocation
      );
    }

    if (sortBy === "wardAsc") {
      reports.sort(
        (a, b) =>
          Number(a.ward || 0) -
          Number(b.ward || 0)
      );
    }

    if (sortBy === "wardDesc") {
      reports.sort(
        (a, b) =>
          Number(b.ward || 0) -
          Number(a.ward || 0)
      );
    }

    if (sortBy === "locationAsc") {
      reports.sort((a, b) =>
        (a.location || "").localeCompare(
          b.location || ""
        )
      );
    }

    if (sortBy === "locationDesc") {
      reports.sort((a, b) =>
        (b.location || "").localeCompare(
          a.location || ""
        )
      );
    }

    setFilteredReports(reports);
  };

  const clearFilters = () => {
    setSelectedWard("");
    setSelectedLocation("");
    setSortBy("");
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
    <div>
      <div className="container py-4">

        <h2 className="text-center mb-4">
          Reported Issues
        </h2>

        <div className="card shadow-sm mb-4">
          <div className="card-body">

            <h5 className="mb-3">
              Filter and Sort Reports
            </h5>

            <Row>

              <Col md={4} className="mb-3">
                <label className="form-label">
                  Ward Number
                </label>

                <select
                  className="form-select"
                  value={selectedWard}
                  onChange={(e) =>
                    setSelectedWard(e.target.value)
                  }
                >
                  <option value="">
                    All Wards
                  </option>

                  {wards.map((ward) => (
                    <option
                      key={ward}
                      value={ward}
                    >
                      Ward {ward}
                    </option>
                  ))}
                </select>
              </Col>

              <Col md={4} className="mb-3">
                <label className="form-label">
                  Location
                </label>

                <select
                  className="form-select"
                  value={selectedLocation}
                  onChange={(e) =>
                    setSelectedLocation(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    All Locations
                  </option>

                  {locations.map((location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  ))}
                </select>
              </Col>

              <Col md={4} className="mb-3">
                <label className="form-label">
                  Sort By
                </label>

                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                >
                  <option value="">
                    Default
                  </option>

                  <option value="wardAsc">
                    Ward Number: Low to High
                  </option>

                  <option value="wardDesc">
                    Ward Number: High to Low
                  </option>

                  <option value="locationAsc">
                    Location: A to Z
                  </option>

                  <option value="locationDesc">
                    Location: Z to A
                  </option>
                </select>
              </Col>

            </Row>

            <button
              className="btn btn-secondary"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        </div>

        <div className="mb-3">
          <strong>
            Showing {filteredReports.length} of{" "}
            {reportedList.length} reports
          </strong>
        </div>

        {filteredReports.length === 0 ? (
          <div className="alert alert-info text-center">
            No reports found.
          </div>
        ) : (
          <Row>
            {filteredReports.map((report) => (
              <Col
                md={6}
                lg={4}
                key={report.id}
              >
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
                        height: "230px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-start mb-3">

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

                    <p className="card-text">
                      <strong>Report ID:</strong>{" "}
                      {report.id}
                    </p>

                    <p className="card-text">
                      <strong>Category:</strong>{" "}
                      {report.category}
                    </p>

                    <p className="card-text">
                      <strong>Location:</strong>{" "}
                      {report.location}
                    </p>

                    <p className="card-text">
                      <strong>Ward:</strong>{" "}
                      {report.ward}
                    </p>

                    <p className="card-text">
                      <strong>City:</strong>{" "}
                      {report.city}
                    </p>

                    <p className="card-text">
                      <strong>Department:</strong>{" "}
                      {report.department}
                    </p>

                    <p className="card-text">
                      <strong>Latitude:</strong>{" "}
                      {report.latitude}
                    </p>

                    <p className="card-text">
                      <strong>Longitude:</strong>{" "}
                      {report.longitude}
                    </p>

                    <p className="card-text">
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

                    <p className="card-text">
                      <strong>User ID:</strong>{" "}
                      {report.userid}
                    </p>

                    <p className="card-text">
                      <strong>Worker ID:</strong>{" "}
                      {report.workerid ||
                        "Not Assigned"}
                    </p>

                    {report.created_at && (
                      <p className="card-text text-muted">
                        <strong>Reported On:</strong>{" "}
                        {new Date(
                          report.created_at
                        ).toLocaleString()}
                      </p>
                    )}

                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

      </div>
    </div>
  );
}
