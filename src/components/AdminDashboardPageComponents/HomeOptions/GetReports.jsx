/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { api_url } from "../../../../backEndApi";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";

const GetReports = () => {
  const [users, setUsers] = useState([]);
  const [qrReports, setQRReports] = useState([]);
  const [activeTab, setActiveTab] = useState("user");
  const [filters, setFilters] = useState({
    searchCriteria: "phoneNumber",
    searchText: "",
    city: "",
    companyName: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${ api_url }/api/users/filter`,
        {
          params: {
            [filters.searchCriteria]: filters.searchText,
            reportsPending:
              filters.searchCriteria === "reportsPending"
                ? filters.searchText
                : undefined,
            city: filters.city,
            companyName: filters.companyName,
          },
        }
      );
      if (response.data.length === 0) {
        setErrorMessage("No user found with the specified filter criteria");
      } else {
        setErrorMessage("");
      }
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    }
  };

  const fetchQRReports = async () => {
    try {
      const response = await axios.get(`${ api_url }/api/qr-reports`, {
        params: {
          city: filters.city,
          companyName: filters.companyName,
        },
      });
      if (response.data.length === 0) {
        setErrorMessage("No QR reports found with the specified filter criteria");
      } else {
        setErrorMessage("");
      }
      setQRReports(response.data);
    } catch (error) {
      console.error("Error fetching QR reports:", error);
    }
  };

  const handleFilter = async () => {
    try {
      if (activeTab === "user") {
        await fetchUsers();
      } else {
        await fetchQRReports();
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const handleClear = async () => {
    setFilters({
      searchCriteria: "phoneNumber",
      searchText: "",
      city: "",
      companyName: "",
    });

    try {
      if (activeTab === "user") {
        const response = await axios.get(`${ api_url }/api/users`);
        setUsers(response.data);
      } else {
        const response = await axios.get(`${ api_url }/api/qr-reports`);
        setQRReports(response.data);
      }
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === "qr") {
      fetchQRReports();
    }
  };

  const toggleCollapse = () => {
    setIsCollapseOpen(!isCollapseOpen);
  };

  const downloadExcel = () => {
    const data = activeTab === "user" ? users : qrReports;
    const headers = Object.keys(data[0]);

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "reports.xlsx");
  };

  return (
    <div className="container">
      <div className="d-flex mb-3 mt-5">
        <button
          className={`btn ${
            activeTab === "user" ? "btn-secondary" : "btn-outline-primary"
          } mr-2`}
          onClick={() => switchTab("user")}
          style={{ marginRight: "20px" }}
        >
          User Reports
        </button>
        <button
          className={`btn ${
            activeTab === "qr" ? "btn-secondary" : "btn-outline-primary"
          }`}
          onClick={() => switchTab("qr")}
        >
          QR Reports
        </button>
      </div>
      <button className="btn btn-primary mb-3" onClick={toggleCollapse}>
        Filter
      </button>
      <div className={`collapse ${isCollapseOpen ? "show" : ""}`}>
        <div className="card card-body">
          {activeTab === "user" && (
            <div className="row mb-3">
              <div className="col">
                <select
                  className="form-select"
                  name="searchCriteria"
                  value={filters.searchCriteria}
                  onChange={handleInputChange}
                >
                  <option value="employeeId">Employee ID</option>
                  <option value="patientName">Patient Name</option>
                  <option value="phoneNumber">Phone Number</option>
                  <option value="reportsPending">Reports Status</option>
                </select>
              </div>
              <div className="col">
                {filters.searchCriteria === "reportsPending" ? (
                  <select
                    className="form-select"
                    name="searchText"
                    value={filters.searchText}
                    onChange={handleInputChange}
                  >
                    <option value="">Select One</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                ) : (
                  <input
                    type={
                      filters.searchCriteria === "employeeId" ? "number" : "text"
                    }
                    className="form-control"
                    placeholder={`Enter ${
                      filters.searchCriteria === "employeeId"
                        ? "Employee ID"
                        : "Search Text"
                    }`}
                    name="searchText"
                    value={filters.searchText}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            </div>
          )}
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                name="city"
                value={filters.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Company Name"
                name="companyName"
                value={filters.companyName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-12">
            <button
              className="btn btn-primary mr-2 col-5 mx-4"
              onClick={handleFilter}
            >
              Search
            </button>
            <button
              className="btn btn-secondary col-5 mx-4"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      <br />
      <a
        className="downloadLink"
        style={{ color: "black", cursor: "pointer" }}
        onClick={downloadExcel}
      >
        Download Excel
      </a>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            {activeTab === "user" && (
              <React.Fragment>
                <th>ID</th>
                <th>Phone Number</th>
                <th>Patient Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Package</th>
                <th>Booking Id</th>
                <th>Reports Taken</th>
                <th>Additional Info</th>
                <th>City</th>
                <th>Company Name</th>
              </React.Fragment>
            )}
            {activeTab === "qr" && (
              <React.Fragment>
                <th>ID</th>
                <th>City</th>
                <th>Company Name</th>
                <th>Package1</th>
                <th>Package2</th>
                <th>Package3</th>
                <th>Package4</th>
              </React.Fragment>
            )}
          </tr>
        </thead>
        <tbody>
          {activeTab === "user" &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.patientName}</td>
                <td>{user.employeeId}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.package}</td>
                <td>{user.bookingId}</td>
                <td>{user.reportsTaken}</td>
                <td>{user.additionalInfo}</td>
                <td>{user.city}</td>
                <td>{user.companyName}</td>
              </tr>
            ))}
          {activeTab === "qr" &&
            qrReports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.city}</td>
                <td>{report.companyName}</td>
                <td>{report.package1}</td>
                <td>{report.package2}</td>
                <td>{report.package3}</td>
                <td>{report.package4}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetReports;
