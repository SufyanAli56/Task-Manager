import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col shadow-lg">
        <div className="p-6 text-2xl font-bold border-b border-blue-500">
          Task Manager
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <a
            href="/dashboard"
            className="block py-2 px-4 rounded-lg hover:bg-blue-500 transition"
          >
            Dashboard
          </a>
          <a
            href="/projects"
            className="block py-2 px-4 rounded-lg hover:bg-blue-500 transition"
          >
            Projects
          </a>
          <a
            href="/tasks"
            className="block py-2 px-4 rounded-lg hover:bg-blue-500 transition"
          >
            Tasks
          </a>
        </nav>
        <button
          onClick={logout}
          className="m-4 py-2 px-4 bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

        {/* Project Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Total Projects
            </h2>
            <p className="text-4xl font-bold text-blue-600">5</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Pending Tasks
            </h2>
            <p className="text-4xl font-bold text-yellow-500">12</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Completed Tasks
            </h2>
            <p className="text-4xl font-bold text-green-600">7</p>
          </div>
        </section>

        {/* Recent Tasks */}
        <section className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Tasks
          </h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-3 flex justify-between">
              <span>Design Landing Page</span>
              <span className="text-green-600 font-medium">Completed</span>
            </li>
            <li className="py-3 flex justify-between">
              <span>Setup Database</span>
              <span className="text-yellow-500 font-medium">Pending</span>
            </li>
            <li className="py-3 flex justify-between">
              <span>API Integration</span>
              <span className="text-red-500 font-medium">Overdue</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
