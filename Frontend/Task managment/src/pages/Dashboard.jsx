import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-500">
          Task Manager
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <a href="/dashboard" className="block py-2 px-3 rounded hover:bg-blue-500">
            Dashboard
          </a>
          <a href="/projects" className="block py-2 px-3 rounded hover:bg-blue-500">
            Projects
          </a>
          <a href="/tasks" className="block py-2 px-3 rounded hover:bg-blue-500">
            Tasks
          </a>
        </nav>
        <button
          onClick={logout}
          className="m-4 py-2 px-3 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Project Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
            <p className="text-3xl font-bold text-blue-600">5</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Pending Tasks</h2>
            <p className="text-3xl font-bold text-yellow-500">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
            <p className="text-3xl font-bold text-green-600">7</p>
          </div>
        </section>

        {/* Recent Tasks */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
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
