import React, { useState, useEffect } from "react";
import authFetch from "../../utils/authFetch";

export default function ManagePlans() {
  const [plans, setPlans] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    typeId: 4, // start empty so user must choose 1,2,3
  });
  const [loading, setLoading] = useState(false);

  // 1) Fetch all plans
  const fetchPlans = async () => {
    try {
      const res = await authFetch("https://localhost:44325/plans/types");
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      setPlans(await res.json());
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  // 2) Fetch plan types
  const fetchPlanTypes = async () => {
    try {
      const res = await authFetch("https://localhost:44325/plan-types");
      if (!res.ok) throw new Error(`Fetch types error: ${res.status}`);
      setPlanTypes(await res.json());
    } catch (err) {
      console.error("Error fetching plan types:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchPlanTypes();
  }, []);

  // 3) Handle inputs, parse typeId to int
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "typeId" ? parseInt(value, 10) : value,
    }));
  };

  // 4) Submit new plan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // guard: ensure typeId is 1,2,or 3
    if (![1, 2, 3].includes(form.typeId)) {
      alert("Please select a valid Plan Type.");
      setLoading(false);
      return;
    }

    try {
      const res = await authFetch("https://localhost:44325/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Post error: ${res.status}`);
      setForm({ name: "", price: "", description: "", typeId: "" });
      setShowForm(false);
      fetchPlans();
    } catch (err) {
      console.error("Error adding plan:", err);
    } finally {
      setLoading(false);
    }
  };

  // 5) Delete plan
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await authFetch(`https://localhost:44325/plans/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete error: ${res.status}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Plans</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cancel" : "Add Plan"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plan Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="text"
                placeholder="$0.00"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Plan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plan Type
              </label>
              <select
                name="typeId"
                value={form.typeId}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select type</option>
                {planTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="self-end bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Plan"}
            </button>
          </form>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Plan Name", "Price", "Description", "Type ID", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {plans.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.typeId}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                  {/* TODO: Edit flow */}
                  <button>{/* ✏️ */}</button>
                  <button onClick={() => handleDelete(p.id)}>{/* 🗑️ */}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
