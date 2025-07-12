import React from "react";
import { FaUserEdit, FaUserSlash } from "react-icons/fa";

export default function ManageUsers() {
  // mock
  const users = [
    { id: 1, username: "john", role: "customer" },
    { id: 2, username: "admin", role: "admin" },
  ];

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{u.username}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {u.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                  <button className="hover:text-blue-600">
                    <FaUserEdit />
                  </button>
                  <button className="hover:text-red-600">
                    <FaUserSlash />
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
