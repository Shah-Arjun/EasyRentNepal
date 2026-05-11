import { Outlet } from "react-router-dom";
import TenantSidebar from "../components/tenant/TenantSidebar";

export default function TenantDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <TenantSidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}