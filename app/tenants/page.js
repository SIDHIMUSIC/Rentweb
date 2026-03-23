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

  // 🔐 PROTECT
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("redirect", "/tenants");
      window.location.href = "/login";
    } else {
      loadData(token);
    }
  }, []);

  const loadData = async (token) => {
    const res = await fetch("/api/tenants", {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setTenants(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Added ✅");
      loadData(token);
    }
  };

  return (
    <div className="p-6">
      <h1>Tenants</h1>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input placeholder="Room"
          onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
        />
        <button>Add</button>
      </form>

      {tenants.map((t) => (
        <div key={t._id}>{t.name}</div>
      ))}
    </div>
  );
}
