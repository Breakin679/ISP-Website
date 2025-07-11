import React from "react";
import {
  FaUsers,
  FaClipboardList,
  FaTools,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const stats = { totalUsers: 1284, activeSubs: 867, pendingInstalls: 12 };
  const recentInstalls = [
    {
      id: 1001,
      user: "alice",
      type: "Fiber",
      date: "2025-07-10",
      status: "Pending",
    },
    {
      id: 1000,
      user: "bob",
      type: "Residential",
      date: "2025-07-09",
      status: "Completed",
    },
    {
      id: 999,
      user: "marc",
      type: "Corporate",
      date: "2025-07-08",
      status: "In Progress",
    },
  ];
  const getStatusClasses = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-800";
    if (status === "Completed") return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          className="mt-4 md:mt-0 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
          <FaUsers className="text-4xl text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
          <FaClipboardList className="text-4xl text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Active Subscriptions</p>
            <p className="text-2xl font-semibold">{stats.activeSubs}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
          <FaTools className="text-4xl text-yellow-600" />
          <div>
            <p className="text-sm text-gray-500">Pending Installs</p>
            <p className="text-2xl font-semibold">{stats.pendingInstalls}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center transition"
        >
          <FaUsers className="text-3xl mb-2 text-indigo-600" />
          <p>Manage Users</p>
        </Link>
        <Link
          to="/admin/plans"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center transition"
        >
          <FaChartBar className="text-3xl mb-2 text-green-600" />
          <p>Manage Plans</p>
        </Link>
        <Link
          to="/admin/installs"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center transition"
        >
          <FaClipboardList className="text-3xl mb-2 text-yellow-600" />
          <p>Install Requests</p>
        </Link>
        <Link
          to="/admin/reports"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center transition"
        >
          <FaChartBar className="text-3xl mb-2 text-purple-600" />
          <p>View Reports</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Request ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentInstalls.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap">{r.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.user}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
