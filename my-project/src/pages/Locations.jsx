import React, { useState } from "react";
import RequestInstallationModal from "../components/Installation";
import { FaHome, FaBuilding, FaNetworkWired } from "react-icons/fa";

const Locations = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");

  const locData = {
    Residential: ["----", "----", "----"],
    Corporate: ["----", "----", "----"],
    Fiber: ["Beirut"],
  };
  const subsOptions = {
    Residential: ["Basic Plan", "Standard Plan", "Premium Plan"],
    Corporate: ["Corporate Plan A", "Corporate Plan B"],
    Fiber: ["Fiber 500", "Fiber 1G", "Fiber 2G"],
  };

  const openModal = (type) => {
    setInstallType(type);
    setModalOpen(true);
  };

  const handleSubmit = (data) => {
    console.log(data);
    setModalOpen(false);
    alert("Installation request sent!");
  };

  const typeIcon = {
    Residential: <FaHome className="text-4xl text-indigo-600" />,
    Corporate: <FaBuilding className="text-4xl text-indigo-600" />,
    Fiber: <FaNetworkWired className="text-4xl text-indigo-600" />,
  };

  return (
    <main className="pt-24 px-6 pb-16 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Our Locations & Installations
        </h1>

        <div className="w-full h-64 rounded-lg overflow-hidden mb-12 shadow-xl">
          <img
            src="/src/assets/map-placeholder.jpg"
            alt="Service Coverage Map"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.keys(locData).map((type) => (
            <div
              key={type}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                {typeIcon[type]}
                <h2 className="text-xl font-semibold">{type}</h2>
              </div>

              <ul className="list-disc list-inside mb-6 space-y-1 text-gray-600">
                {locData[type].map((loc, i) => (
                  <li key={i} className="italic">
                    {loc}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(type)}
                className="mt-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
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
