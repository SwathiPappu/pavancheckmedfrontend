/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import Dashboard from "./HomeOptions/Dashboard";
import GenerateQR from "./HomeOptions/GenerateQR";
import GetReports from "./HomeOptions/GetReports";
import Settings from "./HomeOptions/Settings";
const AdminDashboardHome = ({
  onCityChange,
  onCompanyNameChange,
  selectedOption,
}) => {
  const renderComponent = () => {
    switch (selectedOption) {
      case "Dashboard":
        return <Dashboard />;
      case "GenerateQR":
        return (
          <GenerateQR
            onCityChange={onCityChange}
            onCompanyNameChange={onCompanyNameChange}
          />
        );
      case "Reports":
        return <GetReports />;
      case "Settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return <>{renderComponent()}</>;
};

export default AdminDashboardHome;
