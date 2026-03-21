export default function Navbar() {
  return (
    <div className="bg-black px-8 py-4 flex justify-between items-center shadow-lg border-b border-blue-500">

      {/* LOGO */}
      <h1 className="text-xl font-bold text-blue-400 tracking-wide">
        🏠 Rent App
      </h1>

      {/* NAV LINKS */}
      <div className="flex gap-10 text-sm font-semibold">

        <a
          href="/"
          className="text-gray-300 hover:text-blue-400 transition duration-300 hover:drop-shadow-[0_0_8px_#3b82f6]"
        >
          Dashboard
        </a>

        <a
          href="/tenants"
          className="text-gray-300 hover:text-green-400 transition duration-300 hover:drop-shadow-[0_0_8px_#22c55e]"
        >
          Tenants
        </a>

        <a
          href="/payments"
          className="text-gray-300 hover:text-yellow-400 transition duration-300 hover:drop-shadow-[0_0_8px_#eab308]"
        >
          Payments
        </a>

      </div>
    </div>
  );
}
