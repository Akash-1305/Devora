import { Link, useNavigate } from "react-router-dom";
export default function Navbar() {
  const nav = useNavigate();
  const s = JSON.parse(localStorage.getItem("session") || "null");
  const logout = () => {
    localStorage.removeItem("session");
    nav("/");
  };
  const home =
    s?.role === "user"
      ? "/user"
      : s?.role === "worker"
        ? "/worker"
        : s?.role === "admin"
          ? "/admin"
          : "/";
  return (
    <header className="nav">
      <Link className="brand" to={home}>
        JanSeva
      </Link>
      <div className="navlinks">
        {s?.role === "user" && (
          <>
            <Link to={home}>Home</Link>
            <Link to="/report">Report Problem</Link>
            <Link to="/my-reports">My Reports</Link>
            <Link to="/notifications">Notifications</Link>
          </>
        )}
        {s?.role === "worker" && (
          <>
            <Link to={home}>Home</Link>
          </>
        )}
        {s?.role === "admin" && (
          <>
            <Link to={home}>Home</Link>
          </>
        )}
        {s && (
          <button className="linkbtn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
