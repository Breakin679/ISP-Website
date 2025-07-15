// src/pages/ManageSubscription.jsx
import React, { useState, useEffect } from "react";
import RequestInstallationModal from "../components/Installation";

export default function ManageSubscription({ locData = {}, subsOptions = {} }) {
  const [current, setCurrent] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [mode, setMode] = useState("change"); // 'change' or 'add'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");

  useEffect(() => {
    // Mock fetch data; replace with real API calls
    const mockCurrent = {
      id: "plan-res-std",
      title: "Residential Standard",
      price: "$49.99",
      type: "Residential",
    };
    const mockPlans = [
      {
        id: "plan-res-basic",
        title: "Residential Basic",
        price: "$29.99",
        type: "Residential",
      },
      {
        id: "plan-res-std",
        title: "Residential Standard",
        price: "$49.99",
        type: "Residential",
      },
      {
        id: "plan-res-prem",
        title: "Residential Premium",
        price: "$79.99",
        type: "Residential",
      },
      {
        id: "plan-fib-basic",
        title: "Fiber Basic",
        price: "$39.99",
        type: "Fiber",
      },
      {
        id: "plan-fib-pro",
        title: "Fiber Pro",
        price: "$59.99",
        type: "Fiber",
      },
    ];
    setCurrent(mockCurrent);
    setPlans(mockPlans);
    setSelected(mockCurrent.id);
  }, []);

  const openModal = (type) => {
    setInstallType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleModalSubmit = (data) => {
    console.log("Modal data", data);
    // TODO: actually handle installation or plan-type change
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ADD mode: always requests a new installation
    if (mode === "add") {
      const planType = plans.find((p) => p.id === selected)?.type;
      return openModal(planType);
    }

    // CHANGE mode
    const planObj = plans.find((p) => p.id === selected);
    if (!planObj) return;

    // If type differs, request a type-change via modal
    if (planObj.type !== current?.type) {
      return openModal(planObj.type);
    }

    // Otherwise update within same type
    setStatusMsg("Updating your plan...");
    await new Promise((r) => setTimeout(r, 500));
    setCurrent(planObj);
    setStatusMsg("Plan updated successfully!");
  };

  const handleUnsubscribe = () => {
    setCurrent(null);
    setStatusMsg("You have successfully unsubscribed.");
    setMode("add");
  };

  // Filter out plans based on mode
  const availablePlans = plans.filter((p) =>
    mode === "change" ? p.type === current?.type : p.type !== current?.type
  );

  // If no subscription, force add mode
  if (!current) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
            You have no active subscription
          </h1>
          <p className="mb-8 text-gray-600">
            Click below to add a new subscription.
          </p>
          <button
            onClick={() => setMode("add")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Add Subscription
          </button>

          {/* Plan Selection UI */}
          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <label
                  key={plan.id}
                  htmlFor={plan.id}
                  className={`cursor-pointer block p-4 rounded-lg border-2 transition-shadow hover:shadow-lg bg-white ${
                    selected === plan.id
                      ? "border-indigo-500 shadow"
                      : "border-transparent"
                  }`}
                >
                  <input
                    id={plan.id}
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selected === plan.id}
                    onChange={() => setSelected(plan.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {plan.title}
                      </h3>
                      <p className="text-gray-600">{plan.price}/mo</p>
                    </div>
                    {selected === plan.id && (
                      <span className="text-indigo-500 font-bold">✓</span>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Request New {plans.find((p) => p.id === selected)?.type}{" "}
              Subscription
            </button>
          </form>
          {statusMsg && (
            <p className="mt-4 text-indigo-600 font-medium">{statusMsg}</p>
          )}
        </div>

        {/* Installation Modal */}
        <RequestInstallationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          installType={installType}
          locData={locData}
          subsOptions={subsOptions}
          onSubmit={handleModalSubmit}
        />
      </main>
    );
  }

  // Normal UI with current subscription
  return (
    <main className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Manage Your Subscription
        </h1>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("change")}
            className={`px-4 py-2 rounded-lg shadow ${
              mode === "change"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Change Plan
          </button>
          <button
            onClick={() => setMode("add")}
            className={`px-4 py-2 rounded-lg shadow ${
              mode === "add"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Add Subscription
          </button>
        </div>

        {/* Current Plan (Change Mode) */}
        {mode === "change" && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-4 border-l-4 border-indigo-500 relative">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Current {current.type} Plan
            </h2>
            <p className="text-gray-900 text-2xl font-bold">{current.title}</p>
            <p className="text-indigo-600">{current.price}/mo</p>
            <button
              onClick={handleUnsubscribe}
              className="absolute top-4 right-4 text-sm text-red-500 hover:underline"
            >
              Unsubscribe
            </button>
          </div>
        )}

        {/* Plan Selection */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {availablePlans.map((plan) => (
              <label
                key={plan.id}
                htmlFor={plan.id}
                className={`cursor-pointer block p-4 rounded-lg border-2 transition-shadow hover:shadow-lg bg-white ${
                  selected === plan.id
                    ? "border-indigo-500 shadow"
                    : "border-transparent"
                }`}
              >
                <input
                  id={plan.id}
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={selected === plan.id}
                  onChange={() => setSelected(plan.id)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {plan.title}
                    </h3>
                    <p className="text-gray-600">{plan.price}/mo</p>
                  </div>
                  {selected === plan.id && (
                    <span className="text-indigo-500 font-bold">✓</span>
                  )}
                </div>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            {mode === "change"
              ? plans.find((p) => p.id === selected)?.type === current?.type
                ? `Change to Selected ${current.type} Plan`
                : `Request ${
                    plans.find((p) => p.id === selected)?.type
                  } Plan Change`
              : `Request New ${
                  plans.find((p) => p.id === selected)?.type
                } Subscription`}
          </button>
        </form>

        {statusMsg && (
          <p className="mt-4 text-center text-indigo-600 font-medium">
            {statusMsg}
          </p>
        )}
      </div>

      {/* Installation Modal */}
      <RequestInstallationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        installType={installType}
        locData={locData}
        subsOptions={subsOptions}
        onSubmit={handleModalSubmit}
      />
    </main>
  );
}
