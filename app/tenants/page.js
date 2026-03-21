"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    roomNumber: "",
    rentAmount: 3000,
    startDate: "",
  });

  // 🔥 LOAD TENANTS
  const loadData = async () => {
    try {
      const res = await fetch("/api/tenants");
      const data = await res.json();

      setTenants(Array.isArray(data) ? data : []);
    } catch {
      setTenants([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔥 ADD TENANT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.roomNumber) {
      alert("Fill all fields ⚠️");
      return;
    }

    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Tenant Added ✅");

      setForm({
        name: "",
        phone: "",
        roomNumber: "",
        rentAmount: 3000,
        startDate: "",
      });

      loadData();
    } else {
      alert("Error ❌");
    }
  };

  // 🔥 DELETE TENANT
  const deleteTenant = async (id) => {
    const res = await fetch(`/api/tenants/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Deleted ✅");
      loadData();
    } else {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        👥 Tenants
      </h1>

      {/* 🔥 FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-xl shadow-md"
      >
        <input
          placeholder="Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          className="border p-2 rounded"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Room (F1-R1)"
          className="border p-2 rounded"
          value={form.roomNumber}
          onChange={(e) =>
            setForm({ ...form, roomNumber: e.target.value })
          }
        />

        {/* 🔥 START DATE */}
        <input
          type="date"
          className="border p-2 rounded"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition">
          Add
        </button>
      </form>

      {/* 🔥 LIST */}
      {tenants.length === 0 && (
        <p className="text-gray-500">No tenants found</p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {tenants.map((t) => (
          <div
            key={t._id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-lg text-gray-800">
                {t.name}
              </p>

              <p className="text-sm text-gray-500">
                📍 {t.roomNumber}
              </p>

              {t.startDate && (
                <p className="text-xs text-blue-500">
                  📅 {new Date(t.startDate).toDateString()}
                </p>
              )}
            </div>

            <button
              onClick={() => deleteTenant(t._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
