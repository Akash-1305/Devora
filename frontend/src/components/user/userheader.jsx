import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function UserHeader() {

  const navigate = useNavigate()

  const admin = sessionStorage.getItem("admin")

  function  handleLogout(e) {
    e.preventDefault();
    sessionStorage.clear();
    navigate("/")
  }


  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark" className="shadow">
        <Container fluid>
          <Navbar.Brand as={Link} to={"/userdashboard"}>
            Jeevan Seva
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to={"/userdashboard"}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="myreports">
              MyReports
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div>
        <Outlet />
      </div>
    </div>
  );
}