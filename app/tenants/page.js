"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [tenants, setTenants] = useState([]);
  const [token, setToken] = useState(""); // 🔥 FIX

  const [form, setForm] = useState({
    name: "",
    phone: "",
    roomNumber: "",
    rentAmount: 3000,
    startDate: "",
  });

  // 🔐 TOKEN CHECK + PROTECT
  useEffect(() => {
    const t = localStorage.getItem("token");

    if (!t) {
      router.push("/login"); // 🔥 redirect
    } else {
      setToken(t);
    }
  }, []);

  // LOAD DATA
  const loadData = async (tkn) => {
    try {
      const res = await fetch("/api/tenants", {
        headers: {
          Authorization: tkn,
        },
      });
      const data = await res.json();
      setTenants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOAD AFTER TOKEN
  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  // ADD TENANT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.roomNumber) {
      alert("Fill all fields ❌");
      return;
    }

    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // 🔥 FIX
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

      loadData(token);
    } else {
      alert(data.message || "Error ❌");
    }
  };

  // DELETE
  const deleteTenant = async (id) => {
    const ok = confirm("Delete?");
    if (!ok) return;

    const res = await fetch(`/api/tenants/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token, // 🔥 FIX
      },
    });

    const data = await res.json();

    if (data.success) {
      alert("Deleted ✅");
      loadData(token);
    }
  };

  // EDIT
  const editTenant = async (t) => {
    const name = prompt("Name", t.name);
    const phone = prompt("Phone", t.phone);
    const rent = prompt("Rent", t.rentAmount);

    const res = await fetch(`/api/tenants/${t._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // 🔥 FIX
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
      loadData(token);
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

        <input
          type="date"
          className="border p-2"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
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
            <p className="text-blue-500">₹{t.rentAmount}</p>

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
