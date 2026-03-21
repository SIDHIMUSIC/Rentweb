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

  // LOAD DATA
  const loadData = async () => {
    const res = await fetch("/api/tenants");
    const data = await res.json();
    setTenants(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ADD TENANT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Added ✅");
      setForm({
        name: "",
        phone: "",
        roomNumber: "",
        rentAmount: 3000,
        startDate: "",
      });
      loadData();
    }
  };

  // DELETE
  const deleteTenant = async (id) => {
    const res = await fetch(`/api/tenants/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Deleted ✅");
      loadData();
    }
  };

  // EDIT (🔥 FULL FIX)
  const editTenant = async (t) => {
    const name = prompt("Name", t.name);
    const phone = prompt("Phone", t.phone);
    const rent = prompt("Rent", t.rentAmount);

    const res = await fetch(`/api/tenants/${t._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        rentAmount: Number(rent),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Updated ✅");
      loadData();
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        👥 Tenants
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded shadow"
      >
        <input
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          className="border p-2"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Room (F1-R1)"
          className="border p-2"
          value={form.roomNumber}
          onChange={(e) =>
            setForm({ ...form, roomNumber: e.target.value })
          }
        />

        {/* 🔥 RENT INPUT */}
        <input
          type="number"
          placeholder="Rent"
          className="border p-2"
          value={form.rentAmount}
          onChange={(e) =>
            setForm({
              ...form,
              rentAmount: Number(e.target.value),
            })
          }
        />

        {/* START DATE */}
        <input
          type="date"
          className="border p-2"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white px-4">
          Add
        </button>
      </form>

      {/* LIST */}
      <div className="grid md:grid-cols-3 gap-4">
        {tenants.map((t) => (
          <div
            key={t._id}
            className="bg-white p-4 rounded shadow"
          >
            <p className="font-bold">{t.name}</p>
            <p>{t.roomNumber}</p>
            <p className="text-blue-500">
              ₹{t.rentAmount}
            </p>

            {t.startDate && (
              <p className="text-xs text-gray-500">
                {new Date(t.startDate).toDateString()}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => editTenant(t)}
                className="bg-yellow-500 text-white px-2"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTenant(t._id)}
                className="bg-red-500 text-white px-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
