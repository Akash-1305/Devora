import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../App";

const Login = () => {
  const [moblineno, setMobileno] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const obj = {
      mobileno: moblineno,
      password: password,
    };

    axios
      .post(baseUrl + `/LoginVerify`, obj)
      .then((res) => {
        if (res.data === "admin") {
          sessionStorage.setItem("admin", moblineno);
          navigate("/AdminDashboard");
          toast.success("Login successfully");
        } else {
          navigate("/userdashboard");
          sessionStorage.setItem("user", moblineno);
          toast.success("Login successfully");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data || "Something went wrong!");
      });
  };

  return (
    <div className="loginbg mt-10">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">

            <div className="card shadow border-0 rounded-3">

              <div className="card-header bg-white border-0 text-center pt-4">
                <h1 className="mb-0">Login</h1>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label htmlFor="mobile" className="form-label">
                      Mobile No
                    </label>

                    <input
                      type="number"
                      id="mobile"
                      className="form-control"
                      value={moblineno}
                      onChange={(e) => setMobileno(e.target.value)}
                      pattern="[0-9]{10}"
                      title="Mobile number should contain exactly 10 digits"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>

                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        <i
                          className={`bi ${
                            showPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                  >
                    Login
                  </button>

                  <p className="text-center mt-3 mb-0">
                    Not a member?{" "}
                    <Link
                      to="/register"
                      className="text-decoration-none"
                    >
                      Register
                    </Link>
                  </p>

                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Login;
