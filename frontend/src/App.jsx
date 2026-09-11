import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard
  from "./pages/UserDashboard";

import ReportProblem
  from "./pages/ReportProblem";

import MyReports
  from "./pages/MyReports";

import Notifications
  from "./pages/Notifications";

import WorkerDashboard
  from "./pages/WorkerDashboard";

import AdminDashboard
  from "./pages/AdminDashboard";

import Verification
  from "./pages/Verification";


function ProtectedRoute({ role, children }) {

  const location = useLocation();

  try {

    const session =
      JSON.parse(
        localStorage.getItem("session")
      );

    console.log(
      "Route Guard:",
      role,
      session
    );

    if (
      session &&
      session.role === role
    ) {
      return children;
    }

    return <Navigate to="/" replace state={{ from: location }} />;

  } catch {

    return <Navigate to="/" replace state={{ from: location }} />;
  }
}


export default function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* USER */}

      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/report"
        element={
          <ProtectedRoute role="user">
            <ReportProblem />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-reports"
        element={
          <ProtectedRoute role="user">
            <MyReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute role="user">
            <Notifications />
          </ProtectedRoute>
        }
      />


      {/* WORKER */}

      <Route
        path="/worker"
        element={
          <ProtectedRoute role="worker">
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />


      {/* ADMIN */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verification/:id"
        element={
          <ProtectedRoute role="admin">
            <Verification />
          </ProtectedRoute>
        }
      />


      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}