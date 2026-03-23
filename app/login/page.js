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
      alert("Login success ✅");
      window.location.href = "/payments";
    } else {
      alert("Wrong login ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black animate-pulse">

      {/* 🔥 CARD */}
      <div className="bg-black/40 backdrop-blur-xl p-10 rounded-2xl 
        shadow-[0_0_40px_#00f7ff] w-[320px] border border-cyan-400">

        {/* 🔥 TITLE */}
        <h1 className="text-3xl text-center text-cyan-400 mb-6 font-bold tracking-wide animate-pulse">
          ⚡ Admin Login
        </h1>

        {/* USERNAME */}
        <input
          placeholder="Username"
          className="w-full mb-4 p-2 bg-transparent border border-cyan-400 
          rounded text-white outline-none 
          focus:shadow-[0_0_15px_#00f7ff] transition"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 bg-transparent border border-cyan-400 
          rounded text-white outline-none 
          focus:shadow-[0_0_15px_#00f7ff] transition"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-cyan-400 text-black font-bold rounded 
          hover:bg-cyan-300 transition 
          shadow-[0_0_20px_#00f7ff] hover:shadow-[0_0_40px_#00f7ff]"
        >
          LOGIN 🚀
        </button>

      </div>
    </div>
  );
}
