/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// labby-labs\frontEnd\src\components\AdminPageComponents\AdminBody.jsx
import { api_url } from "../../../backEndApi";
import { BiLogIn } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLockOpen } from "react-icons/md";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminBody = ({ onAdminLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${api_url}/api/admin/login`, {
        username,
        password,
      });
      if (response.status === 200) {
        await onAdminLogin();
        navigate("/admin-dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please try again later.");
    }
  };
  return (
    <>
      <div className="form-signin px-5 py-5">
        <form>
          <div className="d-flex mx-3">
            <h1 className="h3 mb-2">Admin Login</h1>
            <BiLogIn className="mb-3" style={{ fontSize: "30px" }} />
          </div>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="floatingInput">
              <FaRegUser className="mx-2 mb-1" />
              <span>Username</span>
            </label>
          </div>
          <div className="form-floating mt-2">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">
              <MdOutlineLockOpen
                className="mx-2 mb-1"
                style={{ fontSize: "18px" }}
              />
              <span>Password</span>
            </label>
          </div>

          <button
            className="btn btn-primary w-100 py-2 mt-3"
            type="button"
            onClick={handleLogin}
          >
            Sign in
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminBody;
