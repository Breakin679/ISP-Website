import React, { useEffect, useState } from "react";
import { FaTimes, FaEdit, FaPlus, FaSave, FaSpinner } from "react-icons/fa";

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [servers, setServers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editId, setEditId] = useState(null);
  const emptyForm = {
    planId: "",
    serverId: "",
    userIds: [],
    primaryUserId: null,
    ipAddresses: [{ address: "", isPublic: false }],
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const [subsRes, plansRes, srvRes, usrRes] = await Promise.all([
          fetch("https://localhost:44325/subscriptions/details"),
          fetch("https://localhost:44325/plans/available"),
          fetch("https://localhost:44325/servers"),
          fetch("https://localhost:44325/users"),
        ]);
        if (!subsRes.ok || !plansRes.ok || !srvRes.ok || !usrRes.ok) {
          throw new Error("Load failed");
        }
        setSubs(await subsRes.json());
        setPlans(await plansRes.json());
        setServers(await srvRes.json());
        setUsers(await usrRes.json());
      } catch (e) {
        console.error(e);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const saveFormField = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleUser = (uid) => {
    setForm((f) => {
      const exists = f.userIds.includes(uid);
      const next = exists
        ? f.userIds.filter((x) => x !== uid)
        : [...f.userIds, uid];
      // if you removed the primary, clear it
      const primary =
        exists && f.primaryUserId === uid ? null : f.primaryUserId;
      return { ...f, userIds: next, primaryUserId: primary };
    });
  };

  const updateIp = (idx, key, val) => {
    setForm((f) => {
      const ips = [...f.ipAddresses];
      ips[idx] = { ...ips[idx], [key]: val };
      return { ...f, ipAddresses: ips };
    });
  };

  const addIpRow = () =>
    setForm((f) => ({
      ...f,
      ipAddresses: [...f.ipAddresses, { address: "", isPublic: false }],
    }));

  const removeIpRow = (idx) =>
    setForm((f) => ({
      ...f,
      ipAddresses: f.ipAddresses.filter((_, i) => i !== idx),
    }));

  const handleSubmit = async () => {
    const url = editId
      ? `https://localhost:44325/subscriptions/full/${editId}`
      : "https://localhost:44325/subscriptions/full";
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      // reset & reload
      setForm(emptyForm);
      setEditId(null);
      const subsRes = await fetch(
        "https://localhost:44325/subscriptions/details"
      );
      setSubs(await subsRes.json());
    } catch {
      alert("Error saving subscription");
    }
  };

  const startEdit = (sub) => {
    setEditId(sub.subscriptionId);
    setForm({
      planId: sub.planId,
      serverId: sub.serverId,
      userIds: sub.users.map((u) => u.userId),
      primaryUserId: sub.users.length && sub.users[0].userId, // or find primary by flag if you add it
      ipAddresses: sub.ips.map((ip) => ({
        address: ip,
        isPublic: false,
      })),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete subscription?")) return;
    try {
      await fetch(`https://localhost:44325/subscriptions/${id}`, {
        method: "DELETE",
      });
      setSubs((s) => s.filter((x) => x.subscriptionId !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="pt-24 text-center">
        <FaSpinner className="animate-spin mx-auto" />
      </div>
    );
  if (error)
    return <div className="pt-24 text-center text-red-500">{error}</div>;

  return (
    <main className="pt-24 px-6 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Manage Subscriptions</h1>

        {/* Add/Edit Form */}
        <div className="space-y-4 mb-8">
          <div className="flex gap-2">
            <select
              value={form.planId}
              onChange={(e) => saveFormField("planId", +e.target.value)}
              className="border p-2 rounded flex-1"
            >
              <option value="">Plan…</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={form.serverId}
              onChange={(e) => saveFormField("serverId", +e.target.value)}
              className="border p-2 rounded flex-1"
            >
              <option value="">Server…</option>
              {servers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Users multi‐select */}
          <div className="border p-2 rounded">
            <p className="font-medium mb-2">Users</p>
            <div className="grid grid-cols-2 gap-2">
              {users.map((u) => (
                <label key={u.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.userIds.includes(u.id)}
                    onChange={() => toggleUser(u.id)}
                    className="mr-2"
                  />
                  {u.fn} {u.ln}
                </label>
              ))}
            </div>
          </div>

          {/* Primary */}
          {form.userIds.length > 0 && (
            <div>
              <p className="font-medium mb-1">Primary User</p>
              <select
                value={form.primaryUserId}
                onChange={(e) =>
                  saveFormField("primaryUserId", +e.target.value)
                }
                className="border p-2 rounded w-full"
              >
                {form.userIds.map((uid) => {
                  const u = users.find((x) => x.id === uid);
                  return (
                    <option key={uid} value={uid}>
                      {u.fn} {u.ln}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* IP addresses */}
          <div className="space-y-2">
            <p className="font-medium">IP Addresses</p>
            {form.ipAddresses.map((ip, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="x.x.x.x"
                  value={ip.address}
                  onChange={(e) => updateIp(i, "address", e.target.value)}
                  className="border p-2 rounded flex-1"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={ip.isPublic}
                    onChange={(e) => updateIp(i, "isPublic", e.target.checked)}
                    className="mr-1"
                  />
                  Public
                </label>
                {i > 0 && (
                  <button
                    onClick={() => removeIpRow(i)}
                    className="text-red-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addIpRow}
              className="flex items-center gap-1 text-blue-600"
            >
              <FaPlus /> Add IP
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
            >
              {editId ? (
                <>
                  <FaSave className="mr-2" /> Save
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" /> Add
                </>
              )}
            </button>
            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setForm(emptyForm);
                }}
                className="bg-gray-300 px-4 py-2 rounded flex-1 hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Subscriptions Table */}
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th>Plan</th>
              <th>Server</th>
              <th>Users</th>
              <th>IPs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub) => (
              <tr
                key={sub.subscriptionId}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-2">{sub.subscriptionId}</td>
                <td className="p-2">
                  {plans.find((p) => p.id === sub.planId)?.name}
                </td>
                <td className="p-2">
                  {servers.find((s) => s.id === sub.serverId)?.name}
                </td>
                <td className="p-2">
                  {sub.users.map((u) => u.fullName).join(", ")}
                </td>
                <td className="p-2">{sub.ips.join(", ")}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => startEdit(sub)}
                    className="text-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(sub.subscriptionId)}
                    className="text-red-600"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
