// src/pages/ManageSubscription.jsx
import React, { useState, useEffect } from "react";

export default function ManageSubscription() {
  // TODO: replace these hardcoded values with real data from your API
  const [current, setCurrent] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    // TODO: fetch current plan:
    // fetchCurrentPlan().then(data => {
    //   setCurrent(data);
    //   setSelected(data.id);
    // });
    // TODO: fetch list of plans:
    // fetchPlans().then(setPlans);

    // Hardcoded mock:
    const mockCurrent = {
      id: "plan-std",
      title: "Standard Plan",
      price: "$49.99",
    };
    const mockPlans = [
      { id: "plan-basic", title: "Basic Plan", price: "$29.99" },
      { id: "plan-std", title: "Standard Plan", price: "$49.99" },
      { id: "plan-prem", title: "Premium Plan", price: "$79.99" },
    ];
    setCurrent(mockCurrent);
    setPlans(mockPlans);
    setSelected(mockCurrent.id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Updating…");
    try {
      // TODO: call your changePlan API:
      // await changePlan(selected);

      // simulate API delay
      await new Promise((r) => setTimeout(r, 500));

      setStatusMsg("Plan updated successfully!");
      const updated = plans.find((p) => p.id === selected);
      setCurrent(updated);
    } catch {
      setStatusMsg("Update failed. Try again.");
    }
  };

  if (!current) {
    return <p className="p-8 text-center">Loading subscription…</p>;
  }

  return (
    <main className="pt-24 px-4 bg-white min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Manage Subscription
        </h1>

        {/* Current Plan */}
        <div className="bg-gray-100 p-6 rounded-lg shadow mb-8 text-center">
          <p className="mb-2">Your current plan:</p>
          <div className="font-semibold text-xl">{current.title}</div>
          <div className="text-gray-600">{current.price} / month</div>
        </div>

        {/* Change Plan Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-medium">Select a new plan:</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title} — {plan.price}/mo
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Change Plan
          </button>
        </form>

        {statusMsg && (
          <p className="mt-4 text-center text-indigo-600">{statusMsg}</p>
        )}
      </div>
    </main>
  );
}
