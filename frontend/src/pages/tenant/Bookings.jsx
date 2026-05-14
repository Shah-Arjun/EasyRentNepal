import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import { CalendarDays, Home, CreditCard, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

const STATUS_CONFIG = {
  pending:   { icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200', label: 'Pending Approval' },
  approved:  { icon: CheckCircle,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Approved' },
  rejected:  { icon: XCircle,       color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200',   label: 'Rejected' },
  cancelled: { icon: AlertCircle,   color: 'text-slate-500',   bg: 'bg-slate-50',   border: 'border-slate-200', label: 'Cancelled' },
  completed: { icon: CheckCircle,   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200',  label: 'Completed' },
}

const PAYMENT_STATUS = {
  pending:   { label: 'Awaiting Confirmation', bg: 'bg-amber-100',   text: 'text-amber-700'   },
  paid:      { label: 'Confirmed',             bg: 'bg-emerald-100', text: 'text-emerald-700' },
  confirmed: { label: 'Confirmed',             bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected:  { label: 'Rejected',              bg: 'bg-red-100',     text: 'text-red-700'     },
  failed:    { label: 'Failed',                bg: 'bg-red-100',     text: 'text-red-700'     },
  refunded:  { label: 'Refunded',              bg: 'bg-slate-100',   text: 'text-slate-600'   },
}

export default function Bookings() {
  const { bookingServices, currency } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [proofModal, setProofModal] = useState(null)

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await bookingServices.getMyBookings()
      setBookings(response?.data || [])
    } catch (err) {
      setError(err?.message || 'Failed to load your bookings.')
    } finally {
      setLoading(false)
    }
  }, [bookingServices])

  useEffect(() => { loadBookings() }, [loadBookings])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[60vh]'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-secondary' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>

      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-slate-800'>My Bookings</h1>
        <p className='text-slate-500 text-sm mt-1'>Track all your booking requests and their current status.</p>
      </div>

      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm'>{error}</div>
      )}

      {bookings.length === 0 ? (
        <div className='bg-white rounded-2xl border border-slate-100 p-16 text-center'>
          <Home size={40} className='mx-auto text-slate-200 mb-4' />
          <p className='font-semibold text-slate-600 mb-1'>No bookings yet</p>
          <p className='text-slate-400 text-sm mb-6'>Find a property and submit a booking request to get started.</p>
          <Link
            to='/listing'
            className='inline-block px-6 py-2.5 bg-secondary text-slate-900 font-semibold rounded-xl text-sm hover:bg-amber-400 transition'
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className='grid gap-4'>
          {bookings.map((booking) => {
            const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
            const StatusIcon = cfg.icon
            const pStatus = PAYMENT_STATUS[booking.payment?.status || booking.paymentStatus] || PAYMENT_STATUS.pending

            return (
              <div
                key={booking._id}
                className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${cfg.border}`}
              >
                {/* Top color bar */}
                <div className={`h-1 ${cfg.bg}`} />

                <div className='p-5'>
                  <div className='flex flex-col md:flex-row gap-4'>

                    {/* Property image */}
                    {booking.property?.images?.[0]?.url && (
                      <div className='flex-shrink-0'>
                        <img
                          src={booking.property.images[0].url}
                          alt={booking.property.title}
                          className='w-full md:w-28 h-28 object-cover rounded-xl border border-slate-100'
                        />
                      </div>
                    )}

                    {/* Main info */}
                    <div className='flex-1 min-w-0 space-y-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <h3 className='font-bold text-slate-800 text-base leading-tight line-clamp-1'>
                            {booking.property?.title || 'Property'}
                          </h3>
                          <p className='text-xs text-slate-500 mt-0.5'>
                            {booking.property?.location?.municipality}, {booking.property?.location?.district}
                            {booking.property?.category && ` · ${booking.property.category}`}
                          </p>
                        </div>

                        {/* Status badge */}
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon size={11} />
                          {cfg.label}
                        </span>
                      </div>

                      {/* Dates */}
                      <div className='flex items-center gap-2 text-sm text-slate-600'>
                        <CalendarDays size={14} className='text-slate-400' />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' → '}
                          {new Date(booking.endDate).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Amount + payment status */}
                      <div className='flex flex-wrap items-center gap-2'>
                        <div className='flex items-center gap-1.5 text-sm font-bold text-secondary'>
                          <CreditCard size={14} />
                          {currency}{booking.totalAmount?.toLocaleString()}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pStatus.bg} ${pStatus.text}`}>
                          {pStatus.label}
                        </span>
                      </div>

                      {/* Owner info */}
                      {booking.owner?.name && (
                        <p className='text-xs text-slate-400'>
                          Owner: <span className='font-medium text-slate-600'>{booking.owner.name}</span>
                          {booking.owner.phoneNumber && ` · ${booking.owner.phoneNumber}`}
                        </p>
                      )}

                      {/* Rejection reason */}
                      {booking.status === 'rejected' && booking.rejectionReason && (
                        <div className='rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700'>
                          <span className='font-semibold'>Reason: </span>{booking.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Proof image */}
                    {booking.payment?.proofImage?.url && (
                      <div
                        className='flex-shrink-0 cursor-pointer group'
                        onClick={() => setProofModal({ url: booking.payment.proofImage.url })}
                        title='View payment proof'
                      >
                        <div className='relative w-full md:w-20 h-20 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 group-hover:border-secondary transition'>
                          <img
                            src={booking.payment.proofImage.url}
                            alt='Payment proof'
                            className='w-full h-full object-cover'
                          />
                          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center'>
                            <span className='text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition'>View</span>
                          </div>
                        </div>
                        <p className='text-[10px] text-center text-slate-400 mt-1'>Proof</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className='mt-3 pt-3 border-t border-slate-50 flex items-center justify-between'>
                    <p className='text-[11px] text-slate-400'>
                      Submitted {new Date(booking.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {booking.property?._id && (
                      <Link
                        to={`/listing/${booking.property._id}`}
                        className='text-xs font-semibold text-secondary hover:text-amber-600 transition'
                      >
                        View Property →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Proof image lightbox */}
      {proofModal && (
        <div
          className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => setProofModal(null)}
        >
          <div className='relative max-w-lg w-full' onClick={e => e.stopPropagation()}>
            <img src={proofModal.url} alt='Payment proof' className='w-full rounded-2xl shadow-2xl' />
            <button
              onClick={() => setProofModal(null)}
              className='absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-lg text-lg hover:bg-slate-100 transition'
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}