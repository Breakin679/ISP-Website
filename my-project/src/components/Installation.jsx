import React, { useState, useEffect } from "react";

export default function RequestInstallationModal({
  isOpen,
  onClose,
  installType,
  locData = {}, // now an object map
  subsOptions = {}, // now an object map
  onSubmit,
}) {
  const [form, setForm] = useState({
    location: "",
    subscription: "",
    contact: "",
  });

  // Reset form when modal opens or installType changes
  useEffect(() => {
    if (isOpen) {
      setForm({ location: "", subscription: "", contact: "" });
    }
  }, [isOpen, installType]); // ≤ only these two

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
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <form
          onSubmit={handleSend}
          className="bg-slate-700 rounded-lg shadow-lg w-full max-w-md p-6"
        >
          <h3 className="text-xl text-white font-semibold mb-4">
            {installType} Installation
          </h3>

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
              className="mt-1 text-white w-full px-3 py-2 border rounded"
            >
              <option value="">Select a location</option>
              {(locData[installType] || []).map((loc, idx) => (
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
              className="mt-1 text-white w-full px-3 py-2 border rounded"
            >
              <option value="">Select a plan</option>
              {(subsOptions[installType] || []).map((plan, idx) => (
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
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
