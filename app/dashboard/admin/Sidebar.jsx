import Link from "next/link";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <div
      className={`fixed left-0 h-[calc(100vh-8rem)] bg-gray-700 text-white p-5 transition-transform duration-300 ${
        isOpen ? "translate-x-0 w-64 top-32" : "-translate-x-full w-64 top-32"
      }`}
    >
      {/* Title stays in position */}
      <h2 className="text-xl font-bold mb-6 pt-18">Admin Dashboard</h2>

      <ul className="space-y-4">
        <li>
          <Link
            href="/dashboard/admin/manageUsers"
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Manage Users
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/admin/manageProducts"
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Manage Products
          </Link>
        </li>
      </ul>
    </div>
  );
}
