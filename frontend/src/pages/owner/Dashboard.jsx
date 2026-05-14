import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/data'
import { Link } from 'react-router-dom'
import { Home, Star, MessageSquare, ArrowRight, ClipboardList, Bell } from 'lucide-react'

const Dashboard = () => {
  const { currency, propertyServices, bookingServices, userProfile } = useAppContext()

  const [dashboardData, setDashboardData] = useState({
    stats: { totalProperties: 0, totalReviews: 0, averageRating: 0 },
    latestReviews: [],
    properties: [],
  })
  const [loading, setLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)

  const getDashboardData = async () => {
    try {
      setLoading(true)
      const [propRes, bookingRes] = await Promise.all([
        propertyServices.getOwnerDashboardData(),
        bookingServices.getOwnerBookings().catch(() => ({ data: [] })),
      ])
      if (propRes.success) setDashboardData(propRes)
      const pending = (bookingRes?.data || []).filter(b => b.status === 'pending').length
      setPendingCount(pending)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getDashboardData() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary" />
      </div>
    )
  }

  const { totalProperties, totalReviews, averageRating } = dashboardData.stats

  return (
    <div className="space-y-6 pb-10">

      {/* ── Welcome banner ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-secondary/30 via-amber-50 to-white border border-secondary/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Owner Dashboard</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Welcome back, {userProfile?.name?.split(' ')[0] || 'Owner'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's an overview of your properties and reviews.
          </p>
        </div>
      </div>

      {/* ── Pending booking alert ────────────────────────────────── */}
      {pendingCount > 0 && (
        <Link
          to="/owner/bookings"
          className="flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-2xl px-5 py-4 hover:bg-amber-100 transition group"
        >
          <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bell size={18} className="text-amber-800" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-amber-900 text-sm">
              {pendingCount} pending booking request{pendingCount > 1 ? 's' : ''} awaiting your review
            </p>
            <p className="text-amber-700 text-xs mt-0.5">Review payment proofs and approve or reject bookings.</p>
          </div>
          <ArrowRight size={16} className="text-amber-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </Link>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Home size={20} className="text-amber-600" />}
          bg="bg-amber-50 border-amber-100"
          label="Total Properties"
          value={totalProperties.toString().padStart(2, '0')}
        />
        <StatCard
          icon={<Star size={20} className="text-blue-500" />}
          bg="bg-blue-50 border-blue-100"
          label="Avg Rating"
          value={`${averageRating} / 5.0`}
        />
        <StatCard
          icon={<MessageSquare size={20} className="text-emerald-600" />}
          bg="bg-emerald-50 border-emerald-100"
          label="Total Reviews"
          value={totalReviews.toString().padStart(2, '0')}
        />
        <Link to="/owner/bookings" className="block">
          <StatCard
            icon={<ClipboardList size={20} className="text-violet-600" />}
            bg="bg-violet-50 border-violet-100"
            label="Pending Bookings"
            value={pendingCount.toString().padStart(2, '0')}
          />
        </Link>
      </div>

      {/* ── Content grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Latest Reviews */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Latest Reviews</h3>
            <span className="text-xs text-slate-400">{dashboardData.latestReviews.length} total</span>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {dashboardData.latestReviews.length > 0 ? (
              dashboardData.latestReviews.map((rev) => (
                <div key={rev._id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.userId?.profileImage?.url || assets.user}
                        alt=""
                        className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                      />
                      <span className="font-semibold text-slate-700 text-sm">
                        {rev.userId?.name || 'User'}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <img
                          key={i} src={assets.star} alt="" width={11}
                          className={i < rev.rating ? '' : 'opacity-20'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-secondary mb-1">
                    on {rev.propertyId?.title}
                  </p>
                  <p className="text-sm text-slate-600 italic">"{rev.comment}"</p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <MessageSquare size={32} className="mb-2 opacity-30" />
                <p className="text-sm italic">No reviews yet for your properties.</p>
              </div>
            )}
          </div>
        </div>

        {/* My Properties */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">My Properties</h3>
            <Link
              to="/owner/list-property"
              className="text-xs font-semibold text-secondary hover:text-amber-500 flex items-center gap-1 transition"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0">
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Property
                  </th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide text-right">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dashboardData.properties.length > 0 ? (
                  dashboardData.properties.map((property) => (
                    <tr key={property._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {property.images?.[0] && (
                            <img
                              src={property.images[0].url}
                              alt=""
                              className="w-9 h-9 rounded-lg shadow-sm object-cover flex-shrink-0"
                            />
                          )}
                          <p className="text-sm font-medium text-slate-700 line-clamp-1">
                            {property.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm font-bold text-secondary">
                          {currency}{property.price?.value}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-5 py-10 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <Home size={32} className="mb-2 opacity-30" />
                        <p className="text-sm italic">No properties added yet.</p>
                        <Link
                          to="/owner/add-property"
                          className="mt-3 text-xs font-semibold text-secondary hover:text-amber-500 transition"
                        >
                          Add your first property →
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, bg, label, value }) {
  return (
    <div className={`flex items-center gap-4 p-5 rounded-2xl border ${bg} shadow-sm`}>
      <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shadow-sm flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default Dashboard
