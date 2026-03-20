export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white p-4 flex gap-6">
      <a href="/">Dashboard</a>
      <a href="/tenants">Tenants</a>
      <a href="/payments">Payments</a>
    </div>
  );
}
