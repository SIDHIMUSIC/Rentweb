"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    fetch("/api/tenants").then(r => r.json()).then(setTenants);
  }, []);

  const deleteTenant = async (id) => {
    await fetch(`/api/tenants/${id}`, {
      method: "DELETE"
    });

    alert("Deleted");
    location.reload();
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">Tenants</h1>

      {tenants.map((t) => (
        <div key={t._id} className="bg-white p-3 mb-2 rounded shadow flex justify-between">

          <div>
            <p>{t.name}</p>
            <p className="text-sm">{t.roomNumber}</p>
          </div>

          <button
            onClick={() => deleteTenant(t._id)}
            className="bg-red-500 text-white px-3 rounded"
          >
            Delete
          </button>

        </div>
      ))}
    </div>
  );
}
