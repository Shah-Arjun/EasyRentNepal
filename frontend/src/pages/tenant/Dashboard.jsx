import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Item from '../../components/Item'
import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  CreditCard,
  Heart,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react'

export default function Dashboard() {
  const { tenantServices, currency, userProfile } = useAppContext()
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBookings: 0, activeBookings: 0, pendingBookings: 0,
      wishlistCount: 0, totalReviews: 0, confirmedPayments: 0, totalSpent: 0,
    },
    recentBookings: [],
    recentPayments: [],
    recentWishlist: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true); setError('')
        const response = await tenantServices.getDashboard()
        if (response?.success) {
          setDashboardData(response)
        } else {
          setError('Could not load tenant dashboard data.')
        }
      } catch (err) {
        setError(err?.message || 'Could not load tenant dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [tenantServices])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary" />
      </div>
    )
  }

  const { totalBookings, activeBookings, wishlistCount, totalSpent } = dashboardData.stats

  return (
    <div className="space-y-6 pb-10">

      {/* ── Welcome banner ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-secondary/30 via-amber-50 to-white border border-secondary/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">
            Tenant Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Welcome back, {userProfile?.name?.split(' ')[0] || 'Tenant'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Overview of your bookings, payments, and saved properties.
          </p>
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<CalendarCheck size={20} className="text-blue-500" />}
          bg="bg-blue-50 border-blue-100"
          label="Total Bookings"
          value={totalBookings}
        />
        <StatCard
          icon={<Clock size={20} className="text-emerald-600" />}
          bg="bg-emerald-50 border-emerald-100"
          label="Active Bookings"
          value={activeBookings}
        />
        <StatCard
          icon={<Heart size={20} className="text-rose-500" />}
          bg="bg-rose-50 border-rose-100"
          label="Watchlist"
          value={wishlistCount}
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-violet-500" />}
          bg="bg-violet-50 border-violet-100"
          label="Total Spent"
          value={`${currency}${totalSpent}`}
        />
      </div>

      {/* ── Bookings + Payments ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Recent Bookings</h2>
            <Link
              to="/tenant/bookings"
              className="text-xs font-semibold text-secondary hover:text-amber-500 flex items-center gap-1 transition"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
            {dashboardData.recentBookings.length > 0 ? (
              dashboardData.recentBookings.map((booking) => (
                <div key={booking._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-slate-700 text-sm line-clamp-1">
                      {booking.property?.title || 'Property'}
                    </p>
                    <StatusChip status={booking.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(booking.startDate).toLocaleDateString()} –{' '}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState icon={<CalendarCheck size={28} />} text="No bookings found." />
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Recent Payments</h2>
            <Link
              to="/tenant/payments"
              className="text-xs font-semibold text-secondary hover:text-amber-500 flex items-center gap-1 transition"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
            {dashboardData.recentPayments.length > 0 ? (
              dashboardData.recentPayments.map((payment) => (
                <div key={payment._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-slate-700 text-sm">
                      {currency}{payment.amount || 0}
                    </p>
                    <StatusChip status={payment.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState icon={<CreditCard size={28} />} text="No payments found." />
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Watchlist ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Recent Watchlist</h2>
          <Link
            to="/tenant/watchlist"
            className="text-xs font-semibold text-secondary hover:text-amber-500 flex items-center gap-1 transition"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="p-4">
          {dashboardData.recentWishlist.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {dashboardData.recentWishlist.map((property) => (
                <Item key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<Heart size={28} />} text="No watchlist properties yet." />
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, bg, label, value }) {
  return (
    <div className={`flex items-center gap-4 p-5 rounded-2xl border ${bg} shadow-sm`}>
      <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shadow-sm flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
      <div className="opacity-30 mb-2">{icon}</div>
      <p className="text-sm italic">{text}</p>
    </div>
  )
}

function StatusChip({ status }) {
  const val = (status || '').toLowerCase()
  const styles = {
    pending:   'bg-amber-100 text-amber-700',
    approved:  'bg-emerald-100 text-emerald-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    rejected:  'bg-red-100 text-red-700',
    cancelled: 'bg-slate-200 text-slate-600',
    completed: 'bg-blue-100 text-blue-700',
    failed:    'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap ${styles[val] || 'bg-slate-100 text-slate-600'}`}>
      {status || 'unknown'}
    </span>
  )
}