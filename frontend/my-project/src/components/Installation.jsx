import React, { useState, useEffect } from "react";
import authFetch from "../utils/authFetch";

export default function RequestInstallationModal({
  isOpen,
  onClose,
  installType,
  onSubmit,
}) {
  // form state
  const [form, setForm] = useState({
    location: "",
    subscription: "",
    contact: "",
  });

  // options pulled from backend
  const [locOptions, setLocOptions] = useState([]);
  const [planOptions, setPlanOptions] = useState([]);

  // loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // map installType string to plan_type_id
  const typeMap = {
    Fiber: 1,
    Residential: 2,
    Corporate: 3,
  };
  const typeId = typeMap[installType];

  // Reset form & fetch options when modal opens or installType changes
  useEffect(() => {
    if (!isOpen) return;
    setForm({ location: "", subscription: "", contact: "" });
    setLoading(true);
    setError("");
    setLocOptions([]);
    setPlanOptions([]);

    // 1️⃣ fetch coverage locations
    // 2️⃣ fetch plans of that type
    async function loadOptions() {
      try {
        // fetch all coverage, then filter by plan_type_id
        const covResp = await fetch(
          `https://localhost:44325/coverage/type/${typeId}`
        ); // public endpoint, keep as fetch
        if (!covResp.ok) throw new Error(`Coverage HTTP ${covResp.status}`);
        const locList = await covResp.json();
        setLocOptions(locList.map((c) => c.location));

        // fetch plans for this type
        const planResp = await fetch(
          `https://localhost:44325/plans/type/${typeId}`
        ); // public endpoint, keep as fetch
        if (!planResp.ok) throw new Error(`Plans HTTP ${planResp.status}`);
        const plans = await planResp.json();
        // map to whatever display string you need, here plan.name
        setPlanOptions(plans.map((p) => p.name));
      } catch (err) {
        console.error("Failed to load options:", err);
        setError("Unable to load form options. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, [isOpen, installType, typeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    onSubmit({ installType, ...form });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <form
          onSubmit={handleSend}
          className="bg-slate-700 rounded-lg shadow-lg w-full max-w-md p-6"
        >
          <h3 className="text-xl text-white font-semibold mb-4">
            {installType} Installation
          </h3>

          {loading && (
            <p className="text-center text-white mb-4">Loading options…</p>
          )}
          {error && <p className="text-center text-red-400 mb-4">{error}</p>}

          {/* Type (read-only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Type of Install
            </label>
            <input
              type="text"
              value={installType}
              readOnly
              className="mt-1 text-white w-full px-3 py-2 border rounded bg-slate-700"
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Location
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              disabled={loading || !!error}
              className="mt-1 text-white w-full px-3 py-2 border rounded"
            >
              <option value="">Select a location</option>
              {locOptions.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Subscription */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Subscription
            </label>
            <select
              name="subscription"
              value={form.subscription}
              onChange={handleChange}
              required
              disabled={loading || !!error}
              className="mt-1 text-white w-full px-3 py-2 border rounded"
            >
              <option value="">Select a plan</option>
              {planOptions.map((plan, idx) => (
                <option key={idx} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white">
              Email or Phone
            </label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
              className="text-white mt-1 w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-500 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!error}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
