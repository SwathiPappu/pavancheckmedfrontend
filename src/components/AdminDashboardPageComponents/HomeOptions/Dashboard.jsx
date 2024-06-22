/* eslint-disable no-unused-vars */
import { api_url } from "../../../../backEndApi"
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    samplesCollected: 0,
    samplesPending: 0,
    maleUnder30: { amt: 0, Done: 0, Pending: 0 },
    femaleUnder30: { amt: 0, Done: 0, Pending: 0 },
    maleOver30: { amt: 0, Done: 0, Pending: 0 },
    femaleOver30: { amt: 0, Done: 0, Pending: 0 },
  });

  useEffect(() => {
    axios.get(`${ api_url }/api/users/dashboard-data`)
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the dashboard data!", error);
      });
  }, []);

  const data = [
    {
      name: "Male (age<30)",
      Done: dashboardData.maleUnder30.Done,
      Pending: dashboardData.maleUnder30.Pending,
      amt: dashboardData.maleUnder30.amt,
    },
    {
      name: "Female (age<30)",
      Done: dashboardData.femaleUnder30.Done,
      Pending: dashboardData.femaleUnder30.Pending,
      amt: dashboardData.femaleUnder30.amt,
    },
    {
      name: "Male (age>30)",
      Done: dashboardData.maleOver30.Done,
      Pending: dashboardData.maleOver30.Pending,
      amt: dashboardData.maleOver30.amt,
    },
    {
      name: "Female (age>30)",
      Done: dashboardData.femaleOver30.Done,
      Pending: dashboardData.femaleOver30.Pending,
      amt: dashboardData.femaleOver30.amt,
    },
  ];

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card ">
          <div className="card-inner">
            <h3>Total Users</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{dashboardData.totalUsers}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Samples Collected</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{dashboardData.samplesCollected}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Samples Pending</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{dashboardData.samplesPending}</h1>
        </div>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pending" fill="#FA7070" />
            <Bar dataKey="Done" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
};

export default Dashboard;
