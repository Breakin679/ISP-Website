// src/pages/Status.jsx
import React from "react";

export default function Status() {
  // TODO: replace these hardcoded values with real data from your API
  const isOnline = true;
  const serverStatus = "up"; // or "down"
  const signalStrength = 82; // 0–100 (%)
  const latencyMs = 23; // in ms
  const downloadMbps = 150; // in Mbps
  const uploadMbps = 20; // in Mbps
  const lastChecked = new Date().toISOString();

  return (
    <main className="pt-24 px-4 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Connection Status
        </h1>

        {/* Summary Cards */}
        <div className="bg-gray-100 p-6 rounded-lg shadow mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Client Connection */}
          <div className="text-center">
            <p className="text-lg">Client Connection</p>
            <p
              className={`text-2xl font-semibold ${
                isOnline ? "text-green-600" : "text-red-600"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
          {/* Server Health */}
          <div className="text-center">
            <p className="text-lg">Server Health</p>
            <p
              className={`text-2xl font-semibold ${
                serverStatus === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {serverStatus === "up" ? "Operational" : "Issue Detected"}
            </p>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Signal Strength */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="font-medium mb-2">Signal Strength</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-indigo-600 h-4 rounded-full"
                style={{ width: `${signalStrength}%` }}
              />
            </div>
            <p>{signalStrength}%</p>
          </div>

          {/* Latency */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="font-medium mb-2">Latency (Ping)</p>
            <p className="text-3xl font-semibold">{latencyMs} ms</p>
          </div>

          {/* Download Speed */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="font-medium mb-2">Download Speed</p>
            <p className="text-3xl font-semibold">{downloadMbps} Mbps</p>
          </div>

          {/* Upload Speed */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="font-medium mb-2">Upload Speed</p>
            <p className="text-3xl font-semibold">{uploadMbps} Mbps</p>
          </div>
        </div>

        {/* Last Checked */}
        <p className="text-sm text-center text-gray-500">
          Last checked: {new Date(lastChecked).toLocaleString()}
        </p>

        {/* TODO: Add a Refresh button that re-fetches the status */}
        {/* <div className="text-center mt-4">
             <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
               Refresh Status
             </button>
           </div> */}
      </div>
    </main>
  );
}
