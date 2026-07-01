import React, { useState, useEffect } from "react";
import RequestInstallationModal from "../components/Installation";

export default function ManageSubscription({ locData = {}, subsOptions = {} }) {
  const [subs, setSubs] = useState([]); // SubscriptionView[]
  const [plans, setPlans] = useState([]); // Plan[]
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [mode, setMode] = useState("view"); // view | add | change
  const [statusMsg, setStatusMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [installType, setInstallType] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.id;
  const token = localStorage.getItem("token") || "";

  // Fetch active subscriptions
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        // const res = await fetch(
        //   `https://localhost:44325/subscriptions/active/${userId}`,
        const res = await fetch(
          `http://localhost:30112/subscriptions/active/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 404) {
          setSubs([]);
          setMode("add");
        } else {
          const data = await res.json();
          setSubs(data);
          setMode("view");
        }
      } catch (err) {
        console.error(err);
        setStatusMsg("Could not load your subscriptions.");
      }
    })();
  }, [userId, token]);

  // Fetch all plans
  useEffect(() => {
    (async () => {
      try {
        // const res = await fetch("https://localhost:44325/plans/available", {
        const res = await fetch("http://localhost:30112/plans/available", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(res.statusText);
        setPlans(await res.json());
      } catch (err) {
        console.error(err);
        setStatusMsg("Could not load plans.");
      }
    })();
  }, [token]);

  // Whenever mode changes, clear selection
  useEffect(() => {
    setSelectedPlanId(null);
    setStatusMsg("");
  }, [mode]);

  // Open/close modal
  const openModal = (planType) => {
    setInstallType(planType);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Add a brand‑new subscription
  const handleAdd = async (planId, installData) => {
    try {
      // const res = await fetch("https://localhost:44325/subscriptions", {
      const res = await fetch("http://localhost:30112/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.statusText);
      const newSub = await res.json(); // SubscriptionView
      setSubs((prev) => [...prev, newSub]); // append
      setMode("view");
      setStatusMsg("Subscription added!");
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to add subscription.");
    }
  };

  // Replace an existing subscription
  const handleChange = async (oldSubId, newPlanId, installData) => {
    try {
      // 1) end old subscription
      // let res = await fetch(
      //   `https://localhost:44325/subscriptions/${oldSubId}`,
      let res = await fetch(
        `http://localhost:30112/subscriptions/${oldSubId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to end old subscription");

      // 2) create new subscription
      await handleAdd(newPlanId, installData);
      // 3) remove old from local state
      setSubs((prev) => prev.filter((s) => s.subscriptionId !== oldSubId));
      setStatusMsg("Subscription changed!");
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to change subscription.");
    }
  };

  // Unsubscribe button
  const handleUnsubscribe = async (subscriptionId) => {
    try {
      // const res = await fetch(
      //   `https://localhost:44325/subscriptions/${subscriptionId}`,
      const res = await fetch(
        `http://localhost:30112/subscriptions/${subscriptionId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      setSubs((prev) =>
        prev.filter((s) => s.subscriptionId !== subscriptionId)
      );
      if (subs.length <= 1) setMode("add");
      setStatusMsg("Unsubscribed.");
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to unsubscribe.");
    }
  };

  // Form submit → show modal
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlanId) return;
    const plan = plans.find((p) => p.id === selectedPlanId);
    openModal(
      plan.plan_type_id === 1
        ? "Fiber"
        : plan.plan_type_id === 2
        ? "Residential"
        : "Corporate"
    );
  };

  // Which plans to show?
  const currentType = subs[0]?.plan_type_id;
  const available = plans.filter((p) =>
    mode === "change"
      ? p.plan_type_id === currentType
      : p.plan_type_id !== currentType
  );

  return (
    <main className="pt-24 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Manage Subscription
        </h1>

        {/* Active Subs */}
        {subs.length > 0 && (
          <ul className="space-y-4 mb-8">
            {subs.map((s) => (
              <li
                key={s.subscriptionId}
                className="bg-white p-4 rounded shadow flex justify-between"
              >
                <div>
                  <div className="font-semibold">{s.planName}</div>
                  <div className="text-gray-500 text-sm">
                    {s.location} &middot; Started{" "}
                    {new Date(s.startDate).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleUnsubscribe(s.subscriptionId)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Unsubscribe
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Mode buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("add")}
            className={`px-4 py-2 rounded ${
              mode === "add"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Add Subscription
          </button>
          {subs.length > 0 && (
            <button
              onClick={() => setMode("change")}
              className={`px-4 py-2 rounded ${
                mode === "change"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Change Plan
            </button>
          )}
        </div>

        {/* Plan form */}
        {(mode === "add" || mode === "change") && (
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {available.map((plan) => (
                <label
                  key={plan.id}
                  className={`p-4 border-2 rounded cursor-pointer ${
                    selectedPlanId === plan.id
                      ? "border-indigo-500 bg-white shadow"
                      : "border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selectedPlanId === plan.id}
                    onChange={() => setSelectedPlanId(plan.id)}
                    className="sr-only"
                  />
                  <div>
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-gray-600">${plan.price}</div>
                  </div>
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              {mode === "add"
                ? "Request New Subscription"
                : "Change Subscription"}
            </button>
          </form>
        )}

        {statusMsg && (
          <p className="text-center text-indigo-600">{statusMsg}</p>
        )}

        {/* Installation Modal */}
        <RequestInstallationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          installType={installType}
          locData={locData}
          subsOptions={subsOptions}
          onSubmit={(installData) => {
            if (mode === "add") {
              handleAdd(selectedPlanId, installData);
            } else {
              // for change, end the first sub and add new
              handleChange(subs[0].subscriptionId, selectedPlanId, installData);
            }
            closeModal();
          }}
        />
      </div>
    </main>
  );
}
