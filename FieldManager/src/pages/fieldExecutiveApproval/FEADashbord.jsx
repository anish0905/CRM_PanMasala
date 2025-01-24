import React, { useEffect, useState } from "react";
import FEASidebar from "../../components/Sidebar/FEASidebar";
import { Line } from "react-chartjs-2"; // Import Line chart from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FEADashbord = () => {
  const [userdata, setUserData] = useState([]);
  const [ActiveUser, setActiveUserData] = useState([]);
  const email = localStorage.getItem("email");
  const BASE_URL = import.meta.env.VITE_API_URL;
  const fieldManager_Id = localStorage.getItem("fieldManager_Id");

  console.log(ActiveUser);

  const fetchData = async () => {
    try {
      const resp = await axios.get(
        `${BASE_URL}/api/fieldManager/getFieldManager/${fieldManager_Id}`
      );
      setUserData(resp.data);
      const activeUser = resp?.data?.filter((user) => user.status === "Active");
      setActiveUserData(activeUser);
    } catch (error) {
      console.error("Error fetching data:", error);
      setUserData([]);
      setActiveUserData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fieldManager_Id]);

  // Chart Data
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"], // Example months
    datasets: [
      {
        label: "Project Progress",
        data: [65, 59, 80, 81, 56, 55], // Example data points
        borderColor: "rgba(42, 108, 194, 1)",
        backgroundColor: "rgba(42, 108, 194, 0.2)",
        tension: 0.4, // Smoother line
        fill: true,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Project Progress",
      },
    },
  };

  return (
    <div className="min-h-screen bg-blue-100 flex">
      <div className="h-screen lg:fixed  top-0 left-0  lg:w-64">
        <FEASidebar />
      </div>
      <div className="flex-1 p-6 lg:ml-80 overflow-y-auto">
        <header className="bg-[#93c5fd] rounded-md shadow p-4 flex justify-between items-center gap-2 ">
          <h1 className="lg:text-xl md:text-base text-xs font-bold text-gray-800 pl-12">
            Field Executive Approval Dashboard
          </h1>
          <div className="lg:text-2xl md:text-xl text-xs text-white font-bold border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out mr-4">
            {email}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Statistic Cards */}
          <div className="bg-white shadow p-6 rounded-lg flex flex-col items-center">
            <h2 className="text-gray-600 text-lg">Total Users</h2>
            <p className="text-2xl font-bold text-gray-800">
              {userdata.length || "0"}
            </p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg flex flex-col items-center">
            <h2 className="text-gray-600 text-lg">Active Projects</h2>
            <p className="text-2xl font-bold text-gray-800">56</p>
          </div>
          <div className="bg-white shadow p-6 rounded-lg flex flex-col items-center">
            <h2 className="text-gray-600 text-lg">Pending Tasks</h2>
            <p className="text-2xl font-bold text-gray-800">14</p>
          </div>

          {/* Chart Section */}
          <div className="col-span-1 lg:col-span-2 bg-white shadow p-6 rounded-lg">
            <h2 className="text-gray-800 text-lg font-bold">
              Project Progress
            </h2>
            <div className="mt-4">
              {/* Line Chart */}
              <Line data={data} options={options} />
            </div>
          </div>

          {/* Recent Activities */}
          <div className="col-span-1 bg-gray-50 shadow-md p-6 rounded-lg border border-gray-200">
            <h2 className="text-gray-900 text-xl font-semibold mb-4 border-b pb-2">
              Recent Activities ({ActiveUser.length || "0"})
            </h2>
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <ul className="space-y-3">
                {ActiveUser.map((user) => (
                  <li
                    key={user.id}
                    className="text-gray-700 flex flex-col bg-white p-3 rounded-md shadow-sm border border-gray-100 hover:bg-gray-100 transition"
                  >
                    <span className="font-medium text-gray-800">
                      - {user.name}
                    </span>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Table */}
          <div className="col-span-1 lg:col-span-3 bg-white shadow p-6 rounded-lg">
            <h2 className="text-gray-800 text-lg font-bold">Task Overview</h2>
            <table className="table-auto w-full mt-4">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2">Task</th>
                  <th className="py-2">Assignee</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-2">Task A</td>
                  <td className="py-2">John</td>
                  <td className="py-2 text-green-500">Completed</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2">Task B</td>
                  <td className="py-2">Jane</td>
                  <td className="py-2 text-yellow-500">In Progress</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2">Task C</td>
                  <td className="py-2">Doe</td>
                  <td className="py-2 text-red-500">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FEADashbord;
