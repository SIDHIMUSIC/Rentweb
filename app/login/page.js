"use client";
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("token", data.token);

      // 🔥 redirect back
      const redirect =
        localStorage.getItem("redirect") || "/tenants";

      localStorage.removeItem("redirect");

      window.location.href = redirect;
    } else {
      alert("Wrong login ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="p-10 border border-cyan-400 rounded shadow-[0_0_30px_#00f7ff]">
        <h1 className="text-2xl mb-4 text-cyan-400">
          🔐 Login
        </h1>

        <input
          placeholder="Username"
          className="block mb-3 p-2 bg-transparent border border-cyan-400"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="block mb-4 p-2 bg-transparent border border-cyan-400"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="bg-cyan-400 text-black px-4 py-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}
