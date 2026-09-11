import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/visitor/Login";
import Register from "./components/visitor/Register";
import ManageProducts from "./components/admin/managereports";
import Report from "./components/user/Report";
import MyReports from "./components/user/myreports";
import UserHeader from "./components/user/userheader";

export const baseUrl = "http://localhost:5002";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
        <Route path="admin" element={<ManageProducts />}>
        </Route>
        <Route path="user" element={<UserHeader />}>
          <Route path="" element={<Report />} />
          <Route path="myreports" element = {<MyReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
