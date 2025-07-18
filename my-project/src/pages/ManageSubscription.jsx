// src/pages/ManageSubscription.jsx
import React, { useState, useEffect } from "react";
import RequestInstallationModal from "../components/Installation";

export default function ManageSubscription({ locData = {}, subsOptions = {} }) {
  const [current, setCurrent] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [mode, setMode] = useState("change"); // 'change', 'add', etc.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        const res = await fetch(
          `https://localhost:44325/active/${user.user_id}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        const data = await res.json();
        setCurrent(data.active[0] || null); // If only one active is allowed
        setPlans([...data.active, ...data.inactive]);
      } catch (err) {
        console.error("Failed to fetch subscriptions", err);
      }
    };

    fetchSubscriptions();
  }, []);

  const openModal = (type) => {
    setInstallType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleModalSubmit = (data) => {
    console.log("Modal data submitted:", data);
    setStatusMsg("Request submitted successfully!");
    closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const planObj = plans.find((p) => p.id === selected);
    if (!planObj) return;

    if (mode === "add") {
      return openModal(planObj.type);
    }

    if (planObj.type !== current?.type) {
      return openModal(planObj.type);
    }

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

  const availablePlans = plans.filter((p) =>
    mode === "change" ? p.type === current?.type : p.type !== current?.type
  );

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

  return (
    <main className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Manage Your Subscription
        </h1>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {["add", "change", "activate", "deactivate"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg shadow capitalize ${
                mode === m
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {m} Subscription
            </button>
          ))}
        </div>

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
