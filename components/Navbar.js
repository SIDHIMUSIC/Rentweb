export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="font-bold text-lg">🏠 Rent App</h1>

      <div className="flex gap-6">
        <a href="/" className="hover:underline">Dashboard</a>
        <a href="/tenants" className="hover:underline">Tenants</a>
        <a href="/payments" className="hover:underline">Payments</a>
      </div>
    </div>
  );
}
