import { NavLink, Link } from "react-router-dom";
import { assets } from "../../assets/data";
import { useAppContext } from "../../context/AppContext";
import { getActiveRole, normalizeRoles } from "../../utils/authRole";
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  CreditCard,
  ArrowLeft,
  LogOut,
  UserCircle,
  ArrowRightLeft,
  X,
} from "lucide-react";

const menu = [
  { name: "Dashboard",  path: "/tenant/dashboard", icon: LayoutDashboard },
  { name: "Bookings",   path: "/tenant/bookings",  icon: CalendarCheck },
  { name: "Watchlist",  path: "/tenant/watchlist", icon: Heart },
  { name: "Profile",    path: "/tenant/profile",   icon: UserCircle },
];

export default function TenantSidebar({ onClose }) {
  const { userProfile, logout, toggleRole } = useAppContext();
  const availableRoles = normalizeRoles(userProfile?.role);
  const activeRole = getActiveRole(userProfile);
  const initials = userProfile?.name
    ? userProfile.name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <aside className="h-full w-72 bg-white border-r border-slate-200 flex flex-col shadow-lg overflow-y-auto">
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-3">
          <img src={assets.logoDuplicate} alt="Logo" className="h-9 w-auto object-contain" />
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">EasyRental</p>
            <p className="text-[10px] text-secondary font-semibold uppercase tracking-widest">
              Nepal
            </p>
          </div>
        </Link>
        {/* Close button – mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* User info card */}
      <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-amber-50 border border-secondary/30 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden shadow">
          {userProfile?.profileImage?.url ? (
            <img
              src={userProfile.profileImage.url}
              alt={userProfile?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">
            {userProfile?.name || "User"}
          </p>
          <p className="text-xs text-secondary font-medium capitalize">{activeRole}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-5 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Menu
        </p>
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-secondary text-slate-900 shadow-sm shadow-secondary/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 mt-4 space-y-1 border-t border-slate-100 pt-3">
        {availableRoles.includes("owner") && (
          <button
            onClick={() => { onClose?.(); toggleRole(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <ArrowRightLeft size={18} />
            Switch to Owner
          </button>
        )}
        <Link
          to="/listing"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        >
          <ArrowLeft size={18} />
          Back to Listings
        </Link>
        <button
          onClick={() => { onClose?.(); logout(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}