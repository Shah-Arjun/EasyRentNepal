import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Item from '../../components/Item'

export default function Dashboard() {
  const { tenantServices, currency } = useAppContext()
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBookings: 0,
      activeBookings: 0,
      pendingBookings: 0,
      wishlistCount: 0,
      totalReviews: 0,
      confirmedPayments: 0,
      totalSpent: 0,
    },
    recentBookings: [],
    recentPayments: [],
    recentWishlist: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')
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
      <div className='flexCenter h-[70vh] w-full'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-secondary'></div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm p-4 md:p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>Tenant Dashboard</h1>
        <p className='text-slate-500 mt-1'>Overview of your bookings, wishlist, payments, and reviews.</p>
      </div>

      {error && (
        <div className='mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8'>
        <StatCard title='Total Bookings' value={dashboardData.stats.totalBookings} accent='bg-blue-50 border-blue-100' />
        <StatCard title='Active Bookings' value={dashboardData.stats.activeBookings} accent='bg-emerald-50 border-emerald-100' />
        <StatCard title='Watchlist Items' value={dashboardData.stats.wishlistCount} accent='bg-amber-50 border-amber-100' />
        <StatCard title='Total Spent' value={`${currency}${dashboardData.stats.totalSpent}`} accent='bg-violet-50 border-violet-100' />
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        <section className='rounded-2xl border border-slate-100 p-4'>
          <h2 className='text-lg font-semibold text-slate-800 mb-4'>Recent Bookings</h2>
          <div className='space-y-3'>
            {dashboardData.recentBookings.length > 0 ? (
              dashboardData.recentBookings.map((booking) => (
                <div key={booking._id} className='rounded-xl border border-slate-100 p-3'>
                  <div className='flexBetween gap-3'>
                    <p className='font-semibold text-slate-700 line-clamp-1'>
                      {booking.property?.title || 'Property'}
                    </p>
                    <StatusChip status={booking.status} />
                  </div>
                  <p className='text-xs text-slate-500 mt-1'>
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-slate-500 text-sm'>No bookings found.</p>
            )}
          </div>
        </section>

        <section className='rounded-2xl border border-slate-100 p-4'>
          <h2 className='text-lg font-semibold text-slate-800 mb-4'>Recent Payments</h2>
          <div className='space-y-3'>
            {dashboardData.recentPayments.length > 0 ? (
              dashboardData.recentPayments.map((payment) => (
                <div key={payment._id} className='rounded-xl border border-slate-100 p-3'>
                  <div className='flexBetween gap-3'>
                    <p className='font-semibold text-slate-700'>{currency}{payment.amount || 0}</p>
                    <StatusChip status={payment.status} />
                  </div>
                  <p className='text-xs text-slate-500 mt-1'>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-slate-500 text-sm'>No payments found.</p>
            )}
          </div>
        </section>
      </div>

      <section className='mt-8'>
        <h2 className='text-lg font-semibold text-slate-800 mb-4'>Recent Watchlist</h2>
        {dashboardData.recentWishlist.length > 0 ? (
          <div className='grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
            {dashboardData.recentWishlist.map((property) => (
              <Item key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p className='text-slate-500 text-sm'>No watchlist properties yet.</p>
        )}
      </section>
    </div>
  )
}

function StatCard({ title, value, accent }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent}`}>
      <p className='text-sm text-slate-600'>{title}</p>
      <h3 className='text-2xl font-bold text-slate-800 mt-1'>{value}</h3>
    </div>
  )
}

function StatusChip({ status }) {
  const value = (status || '').toLowerCase()
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-emerald-100 text-emerald-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-200 text-slate-700',
    completed: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${styles[value] || 'bg-slate-100 text-slate-700'}`}>
      {status || 'unknown'}
    </span>
  )
}