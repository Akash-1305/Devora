import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { baseUrl } from "../../App";

export default function MyReports() {
  const [reportList, setReportList] = useState([]);

  const userid = localStorage.getItem("userid");

  useEffect(() => {
    getReports();
  }, []);

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
                    <strong>City:</strong> {report.city}
                  </p>

                  <p className="mb-2">
                    <strong>Department:</strong>{" "}
                    {report.department || "Not Assigned"}
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
                      {report.flag || "NO"}
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
                      {report.latitude}, {report.longitude}
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
