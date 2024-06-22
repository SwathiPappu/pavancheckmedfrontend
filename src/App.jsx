/* eslint-disable no-unused-vars */
// labby-labs\frontEnd\src\App.jsx
import { api_url } from "../backEndApi.js";
import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import UserDetailsPage from "./components/UserDetailsPage";
import ReportsPage from "./components/ReportsPage";
import AdminPage from "./components/AdminPage";
import AdminDashboardPage from "./components/AdminDashboardPage.jsx";
import "./App.css";
import axios from "axios";
import Dashboard from "./components/AdminDashboardPageComponents/HomeOptions/Dashboard.jsx";
import GenerateQR from "./components/AdminDashboardPageComponents/HomeOptions/GenerateQR";
import GetReports from "./components/AdminDashboardPageComponents/HomeOptions/GetReports";
import Settings from "./components/AdminDashboardPageComponents/HomeOptions/Settings";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handlePhoneNumberSubmit = async (number) => {
    setPhoneNumber(number);
    try {
      const response = await axios.post(`${api_url}/api/user`, {
        phoneNumber: number,
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleAdminLogin = async (username, password) => {
    try {
      const response = await axios.post(`${api_url}/api/admin/login`, {
        username,
        password,
      });
      if (response.status === 200) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AdminPage onAdminLogin={handleAdminLogin} />}
        />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />}>
          <Route index element={<Dashboard />} /> {/* Default route */}
          <Route
            path="generateqr"
            element={
              <GenerateQR
              />
            }
          />
          <Route path="reports" element={<GetReports />} />
          <Route path="forsomeuse" element={<div>For Some Use Content</div>} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route
          path="/home-page/:city/:companyName"
          element={<HomePage onPhoneNumberSubmit={handlePhoneNumberSubmit} />}
        />
        <Route
          path="/user-details/:city/:companyName"
          element={
            <UserDetailsPage phoneNumber={phoneNumber} userData={userData} />
          }
        />
        <Route
          path="/reports"
          element={
            <ReportsPage phoneNumber={phoneNumber} userData={userData} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
