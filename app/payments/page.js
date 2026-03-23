"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [token, setToken] = useState("");

  const [form, setForm] = useState({
    tenant: "",
    month: "",
    paidAmount: 0,
  });

  // 🔐 PROTECT
  useEffect(() => {
    const t = localStorage.getItem("token");

    if (!t) {
      localStorage.setItem("redirect", "/payments");
      window.location.href = "/login";
    } else {
      setToken(t);
    }
  }, []);

  // LOAD
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      const t = await fetch("/api/tenants", {
        headers: { Authorization: token },
      }).then(r => r.json());

      const p = await fetch("/api/payments", {
        headers: { Authorization: token },
      }).then(r => r.json());

      setTenants(t || []);
      setPayments(p || []);
    };

    load();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Saved ✅");
    }
  };

  return (
    <div className="p-6">
      <h1>Payments</h1>

      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setForm({ ...form, tenant: e.target.value })}>
          <option>Select</option>
          {tenants.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        <input type="number"
          onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })}
        />

        <button>Save</button>
      </form>

      {payments.map(p => (
        <div key={p._id}>{p.month}</div>
      ))}
    </div>
  );
}
