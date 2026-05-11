import { NavLink } from "react-router-dom";
import { assets } from "../../assets/data";
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  CreditCard,
  Home,
  ArrowLeft,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/tenant/dashboard", icon: LayoutDashboard },
  { name: "Bookings", path: "/tenant/bookings", icon: CalendarCheck },
  { name: "Watchlist", path: "/tenant/watchlist", icon: Heart },
  { name: "Payments", path: "/tenant/payments", icon: CreditCard },
];

export default function TenantSidebar() {
  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 p-4 flex flex-col">
      
      {/* Logo Section */}
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 p-4 text-white shadow mb-6">
        <img
          src={assets.logoDuplicate}
          alt="EasyRental Logo"
          className="w-18 h-10 object-contain"
        />
        <h1 className="text-xl font-bold text-blue-100">
          EasyRental
        </h1>
      </div>

      {/* Menu */}
      <div className="space-y-2 flex-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition font-medium ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </div>

      {/* Tip Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 mb-4">
        <p className="font-semibold flex items-center gap-2 mb-1">
          <Home size={15} />
          Tip
        </p>
        <p>
          Use Watchlist to keep your favorite properties and track them quickly.
        </p>
      </div>

      {/* Back Button */}
      <NavLink
        to="/listing"
        className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
      >
        <ArrowLeft size={18} />
        Back To Listings
      </NavLink>
    </aside>
  );
}