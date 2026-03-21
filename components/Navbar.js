export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center shadow-md">
      
      <h1 className="font-bold text-lg">🏠 Rent App</h1>

      <div className="flex gap-8 text-sm font-medium">
        <a href="/" className="hover:text-yellow-300 transition">
          Dashboard
        </a>

        <a href="/tenants" className="hover:text-yellow-300 transition">
          Tenants
        </a>

        <a href="/payments" className="hover:text-yellow-300 transition">
          Payments
        </a>
      </div>

    </div>
  );
}
