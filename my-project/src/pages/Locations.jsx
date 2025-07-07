import React, { useState } from "react";
import RequestInstallationModal from "../components/Installation";

const Locations = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");
  const [form, setForm] = useState({
    location: "",
    subscription: "",
    contact: "",
  });

  // Define placeholder locations and subscription options
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

  // Open modal and preset type
  const openModal = (type) => {
    setInstallType(type);
    setForm({ location: "", subscription: "", contact: "" });
    setModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = (data) => {
    console.log(data);
    setModalOpen(false);
    alert("Installation request sent!");
  };

  return (
    <main className="pt-24 px-6 pb-16 max-w-4xl mx-auto">
      {["Residential", "Corporate", "Fiber"].map((type) => (
        <section key={type} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{type} Locations</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            {locData[type].map((loc, i) => (
              <li key={i} className="italic text-gray-400">
                {loc}
              </li>
            ))}
          </ul>
          <button
            onClick={() => openModal(type)}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Request {type} Installation
          </button>
        </section>
      ))}

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
