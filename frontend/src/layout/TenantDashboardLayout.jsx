import { useState } from "react";
import { Outlet } from "react-router-dom";
import TenantSidebar from "../components/tenant/TenantSidebar";
import { Menu, X } from "lucide-react";

export default function TenantDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <TenantSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content — scrollable */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Mobile topbar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-white border-b border-slate-200 px-4 py-3 md:hidden shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-slate-800 text-sm">Tenant Dashboard</span>
        </div>

        <div className="p-4 md:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}