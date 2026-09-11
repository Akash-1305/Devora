import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../App";

export default function Registration() {
  const [name, setName] = useState("");
  const [mobileno, setMobileno] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userdata = {
      name,
      mobileno,
      password,
    };

    toast
      .promise(axios.post(baseUrl + `/register`, userdata), {
        pending: "Form submitting....",
        success: "Registered successfully",
      })
      .then((res) => {
        console.log(res);
        ClearFields();
      })
      .catch((err) => {
        toast.error(
          err.response ? err.response.data : "Something went wrong!!"
        );
      });
  };

  function ClearFields() {
    setName("");
    setMobileno("");
    setPassword("");
  }

  return (
    <div className="regbg min-height-100vh d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="bg-white p-4 p-md-5 rounded-3 shadow">  
              <h2 className="text-center mb-4">
                Registration Form
              </h2>

              <form onSubmit={handleSubmit} id="regform">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    pattern="[A-Za-z\s]+"
                    title="Name should contain only alphabets"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">
                    Mobile
                  </label>

                  <input
                    type="tel"
                    id="mobile"
                    className="form-control"
                    value={mobileno}
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
                      pattern="^(?=(?:.*[A-Za-z]){3,})(?=(?:.*\d){3,})(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$"
                      title="Password should contain at least 3 alphabets, 3 digits, and at least 6 characters"
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
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
                  Register
                </button>

                <p className="text-center mt-3 mb-0">
                  Already a member?{" "}
                  <Link
                    to="/"
                    className="text-decoration-none"
                  >
                    Login
                  </Link>
                </p>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
