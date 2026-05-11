import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

export default function Bookings() {
  const { tenantServices, currency } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await tenantServices.getBookings()
        setBookings(response?.data || [])
      } catch (err) {
        setError(err?.message || 'Failed to load your bookings.')
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [tenantServices])

  return (
    <div className='bg-white rounded-2xl shadow-sm p-4 md:p-6'>
      <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>My Bookings</h1>
      <p className='text-slate-500 mt-1'>Track booking status, dates, and rent summary.</p>

      {error && (
        <div className='mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm'>
          {error}
        </div>
      )}

      {loading ? (
        <div className='flexCenter h-[50vh]'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-secondary'></div>
        </div>
      ) : bookings.length > 0 ? (
        <div className='mt-6 grid gap-4'>
          {bookings.map((booking) => (
            <div key={booking._id} className='rounded-2xl border border-slate-100 p-4'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                <div>
                  <h3 className='font-semibold text-slate-800'>
                    {booking.property?.title || 'Property'}
                  </h3>
                  <p className='text-sm text-slate-500 mt-1'>
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-bold text-secondary'>{currency}{booking.totalAmount || 0}</p>
                  <p className='text-xs text-slate-500'>
                    Payment: {booking.paymentStatus || 'pending'}
                  </p>
                </div>
              </div>

              <div className='mt-3'>
                <StatusChip status={booking.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-10 text-slate-500 text-center'>No bookings found.</div>
      )}
    </div>
  )
}

function StatusChip({ status }) {
  const value = (status || '').toLowerCase()
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-200 text-slate-700',
    completed: 'bg-blue-100 text-blue-700',
  }

  return (
    <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${styles[value] || 'bg-slate-100 text-slate-700'}`}>
      {status || 'unknown'}
    </span>
  )
}