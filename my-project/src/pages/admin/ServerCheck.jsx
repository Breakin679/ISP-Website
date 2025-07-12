import React, { useState } from "react";
import {
  FaPlus,
  FaServer,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";

export default function CheckServers() {
  const [locations, setLocations] = useState(["Beirut"]);
  const [selected, setSelected] = useState("");
  const [servers, setServers] = useState({
    Beirut: [
      {
        name: "BEY-Server-1",
        bandwidth: "1 Gbps",
        usersCount: 120,
        users: ["alice", "bob"],
      },
      {
        name: "BEY-Server-2",
        bandwidth: "500 Mbps",
        usersCount: 45,
        users: ["marc"],
      },
    ],
  });

  const [newLoc, setNewLoc] = useState("");
  const [editLocIndex, setEditLocIndex] = useState(-1);
  const [editLocValue, setEditLocValue] = useState("");
  const [newServer, setNewServer] = useState({
    name: "",
    bandwidth: "",
    usersCount: 0,
  });
  const [editServerIndex, setEditServerIndex] = useState(-1);
  const [editServerValue, setEditServerValue] = useState({
    name: "",
    bandwidth: "",
    usersCount: 0,
  });
  const [expandedServer, setExpandedServer] = useState(null);

  const addLocation = () => {
    if (newLoc && !locations.includes(newLoc)) {
      setLocations([...locations, newLoc]);
      setServers({ ...servers, [newLoc]: [] });
      setNewLoc("");
    }
  };

  const saveEditedLocation = (idx) => {
    const updated = [...locations];
    const oldName = updated[idx];
    updated[idx] = editLocValue;
    const newServers = { ...servers, [editLocValue]: servers[oldName] };
    delete newServers[oldName];
    setLocations(updated);
    setServers(newServers);
    setEditLocIndex(-1);
    setEditLocValue("");
    if (selected === oldName) setSelected(editLocValue);
  };

  const deleteLocation = (loc) => {
    setLocations(locations.filter((l) => l !== loc));
    const { [loc]: _, ...rest } = servers;
    setServers(rest);
    if (selected === loc) setSelected("");
  };

  const addServer = () => {
    if (newServer.name && selected) {
      setServers({
        ...servers,
        [selected]: [...servers[selected], { ...newServer, users: [] }],
      });
      setNewServer({ name: "", bandwidth: "", usersCount: 0 });
    }
  };

  const saveEditedServer = (idx) => {
    const list = [...servers[selected]];
    list[idx] = { ...list[idx], ...editServerValue };
    setServers({ ...servers, [selected]: list });
    setEditServerIndex(-1);
    setEditServerValue({ name: "", bandwidth: "", usersCount: 0 });
  };

  const deleteServer = (idx) => {
    setServers({
      ...servers,
      [selected]: servers[selected].filter((_, i) => i !== idx),
    });
    if (expandedServer === idx) setExpandedServer(null);
  };

  return (
    <main className="pt-24 px-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold">Server Coverage</h1>
      </div>

      {/* Location Management */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Manage Locations</h2>
        <div className="flex gap-4 items-center mb-4">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Choose Location --</option>
            {locations.map((loc, idx) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <input
            value={newLoc}
            onChange={(e) => setNewLoc(e.target.value)}
            placeholder="Add Location"
            className="border p-2 rounded"
          />
          <button
            onClick={addLocation}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaPlus /> Add
          </button>
        </div>
        <ul className="space-y-2">
          {locations.map((loc, idx) => (
            <li key={loc} className="flex items-center gap-2">
              {editLocIndex === idx ? (
                <>
                  <input
                    value={editLocValue}
                    onChange={(e) => setEditLocValue(e.target.value)}
                    className="border p-1 rounded"
                  />
                  <button onClick={() => saveEditedLocation(idx)}>
                    <FaSave />
                  </button>
                  <button onClick={() => setEditLocIndex(-1)}>
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <span>{loc}</span>
                  <button
                    onClick={() => {
                      setEditLocIndex(idx);
                      setEditLocValue(loc);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteLocation(loc)}>
                    <FaTrash />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Server Management */}
      {selected && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Servers in {selected}</h2>

          {/* Add Server Form */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              value={newServer.name}
              onChange={(e) =>
                setNewServer({ ...newServer, name: e.target.value })
              }
              placeholder="Server Name"
              className="border p-2 rounded w-full"
            />
            <input
              value={newServer.bandwidth}
              onChange={(e) =>
                setNewServer({ ...newServer, bandwidth: e.target.value })
              }
              placeholder="Bandwidth (e.g., 1 Gbps)"
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              value={newServer.usersCount}
              onChange={(e) =>
                setNewServer({
                  ...newServer,
                  usersCount: parseInt(e.target.value),
                })
              }
              placeholder="User Count"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={addServer}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              <FaPlus /> Add Server
            </button>
          </div>

          <ul className="space-y-4">
            {servers[selected]?.length > 0 ? (
              servers[selected].map((srv, idx) => (
                <li key={idx} className="border rounded p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setExpandedServer(expandedServer === idx ? null : idx)
                        }
                      >
                        {expandedServer === idx ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </button>
                      <FaServer className="text-xl text-gray-600" />
                      {editServerIndex === idx ? (
                        <>
                          <input
                            value={editServerValue.name}
                            onChange={(e) =>
                              setEditServerValue({
                                ...editServerValue,
                                name: e.target.value,
                              })
                            }
                            className="border p-1 rounded mr-2"
                          />
                          <input
                            value={editServerValue.bandwidth}
                            onChange={(e) =>
                              setEditServerValue({
                                ...editServerValue,
                                bandwidth: e.target.value,
                              })
                            }
                            className="border p-1 rounded mr-2"
                          />
                          <input
                            type="number"
                            value={editServerValue.usersCount}
                            onChange={(e) =>
                              setEditServerValue({
                                ...editServerValue,
                                usersCount: parseInt(e.target.value),
                              })
                            }
                            className="border p-1 rounded w-20 mr-2"
                          />
                          <button onClick={() => saveEditedServer(idx)}>
                            <FaSave />
                          </button>
                          <button onClick={() => setEditServerIndex(-1)}>
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="font-semibold">{srv.name}</p>
                            <p className="text-sm text-gray-500">
                              {srv.bandwidth} • {srv.usersCount} users
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditServerIndex(idx);
                                setEditServerValue({
                                  name: srv.name,
                                  bandwidth: srv.bandwidth,
                                  usersCount: srv.usersCount,
                                });
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button onClick={() => deleteServer(idx)}>
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded users list */}
                  {expandedServer === idx && (
                    <ul className="mt-4 ml-8 list-disc list-inside text-gray-700">
                      {srv.users.length > 0 ? (
                        srv.users.map((u) => <li key={u}>{u}</li>)
                      ) : (
                        <li>No connected users.</li>
                      )}
                    </ul>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500">
                No servers found in this location.
              </p>
            )}
          </ul>
        </div>
      )}
    </main>
  );
}
