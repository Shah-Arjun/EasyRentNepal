import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/data'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { getActiveRole, normalizeRoles } from '../../utils/authRole'
import {
  LayoutDashboard,
  PlusSquare,
  List,
  Map,
  UserCircle,
  Menu,
  X,
  LogOut,
  ArrowRightLeft,
  Home,
  ClipboardList,
} from 'lucide-react'

const navItems = [
  { path: '/owner',                label: 'Dashboard',       icon: LayoutDashboard, end: true  },
  { path: '/owner/add-property',  label: 'Add Property',    icon: PlusSquare,      end: false },
  { path: '/owner/list-property', label: 'My Properties',   icon: List,            end: false },
  { path: '/owner/bookings',      label: 'Booking Requests',icon: ClipboardList,   end: false },
  { path: '/owner/profile',       label: 'Profile',         icon: UserCircle,      end: false },
]

const Sidebar = () => {
  const { userProfile, toggleRole, logout } = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const availableRoles = normalizeRoles(userProfile?.role)
  const activeRole = getActiveRole(userProfile)

  const initials = userProfile?.name
    ? userProfile.name.trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleSwitchToTenant = async () => {
    setSidebarOpen(false)
    await toggleRole()
  }

  const handleLogout = async () => {
    setSidebarOpen(false)
    await logout()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar panel ─────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200
          flex flex-col overflow-y-auto shadow-lg
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
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
          <button
            onClick={() => setSidebarOpen(false)}
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
              {userProfile?.name || 'User'}
            </p>
            <p className="text-xs text-secondary font-medium capitalize">{activeRole}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 mt-5 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-secondary text-slate-900 shadow-sm shadow-secondary/30'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-5 mt-4 border-t border-slate-100 pt-3 space-y-1">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Home size={18} />
            Back to Home
          </Link>
          {availableRoles.includes('tenant') && (
            <button
              onClick={handleSwitchToTenant}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <ArrowRightLeft size={18} />
              Switch to Tenant
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content — scrollable ──────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-white border-b border-slate-200 px-4 py-3 md:hidden shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-slate-800 text-sm">Owner Dashboard</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Sidebar