import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";


import HomeHeader from "./components/visitor/HomeHeader";
import Login from "./components/visitor/Login";
import Register from "./components/visitor/Register";
import ManageProducts from "./components/admin/managereports";
import Report from "./components/user/Report";

export const baseUrl = "http://localhost:5002";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeHeader />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="AdminDashboard" element={<ManageProducts />}>
        </Route>
        <Route path="UserDashboard" element={<Report />}>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
