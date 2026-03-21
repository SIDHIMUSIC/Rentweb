"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("isAdmin", "true");
      router.push("/");
    } else {
      alert("Wrong password ❌");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-black text-white">

      <div className="bg-gray-800 p-6 rounded shadow">

        <h2 className="text-xl mb-4">🔐 Admin Login</h2>

        <input
          type="password"
          placeholder="Enter password"
          className="border p-2 text-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-green-500 px-4 py-2 ml-2"
        >
          Login
        </button>

      </div>

    </div>
  );
}
