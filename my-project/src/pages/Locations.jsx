import React, { useEffect, useState } from "react";
import RequestInstallationModal from "../components/Installation";
import { FaHome, FaBuilding, FaNetworkWired } from "react-icons/fa";

const Locations = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");
  const [loading, setLoading] = useState(true);
  const [locData, setLocData] = useState({
    Residential: [],
    Fiber: [],
    Corporate: [],
  });

  const subsOptions = {
    Residential: ["Basic Plan", "Standard Plan", "Premium Plan"],
    Corporate: ["Corporate Plan A", "Corporate Plan B"],
    Fiber: ["Fiber 500", "Fiber 1G", "Fiber 2G"],
  };

  useEffect(() => {
    fetch("https://localhost:44325/coverage/locations")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        // map the camelCase JSON into PascalCase keys
        setLocData({
          Residential: data.residential || [],
          Fiber: data.fiber || [],
          Corporate: data.corporate || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch locations:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="pt-24 px-6 pb-16 text-center">
        <p className="text-lg text-gray-600">Loading locations…</p>
      </main>
    );
  }

  const typeIcon = {
    Residential: <FaHome className="w-8 h-8 text-indigo-600" />,
    Corporate: <FaBuilding className="w-8 h-8 text-indigo-600" />,
    Fiber: <FaNetworkWired className="w-8 h-8 text-indigo-600" />,
  };

  const openModal = (type) => {
    setInstallType(type);
    setModalOpen(true);
  };

  const handleSubmit = (data) => {
    console.log("Install request:", data);
    setModalOpen(false);
    alert("Installation request sent!");
  };

  return (
    <main className="pt-24 px-6 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">
          Our Locations & Installations
        </h1>

        {/* card grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {["Residential", "Corporate", "Fiber"].map((type) => (
            <div
              key={type}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <div className="mr-3">{typeIcon[type]}</div>
                <h2 className="text-xl font-semibold">{type}</h2>
              </div>

              <ul className="flex-1 mb-6 space-y-2 text-gray-700 list-disc list-inside">
                {locData[type].length > 0 ? (
                  locData[type].map((loc, i) => (
                    <li key={i} className="italic">
                      {loc}
                    </li>
                  ))
                ) : (
                  <li className="italic text-gray-400">No locations</li>
                )}
              </ul>

              <button
                onClick={() => openModal(type)}
                className="mt-auto bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Request {type} Installation
              </button>
            </div>
          ))}
        </div>
      </div>

      <RequestInstallationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        installType={installType}
        locations={locData[installType] || []}
        subscriptionOptions={subsOptions[installType] || []}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default Locations;
