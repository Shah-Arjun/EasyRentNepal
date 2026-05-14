import React, { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../../context/AppContext'
import { CheckCircle, XCircle, Clock, Eye, User, Home, CalendarDays, CreditCard } from 'lucide-react'

const STATUS_STYLES = {
  pending:   { bg: 'bg-amber-100',  text: 'text-amber-700',   label: 'Pending'   },
  approved:  { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved'  },
  rejected:  { bg: 'bg-red-100',    text: 'text-red-700',     label: 'Rejected'  },
  cancelled: { bg: 'bg-slate-100',  text: 'text-slate-600',   label: 'Cancelled' },
  completed: { bg: 'bg-blue-100',   text: 'text-blue-700',    label: 'Completed' },
}

export default function OwnerBookings() {
  const { bookingServices, currency } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)   // bookingId being processed
  const [proofModal, setProofModal] = useState(null)         // { url }
  const [rejectModal, setRejectModal] = useState(null)       // { bookingId }
  const [rejectReason, setRejectReason] = useState('')
  const [filter, setFilter] = useState('all')

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const res = await bookingServices.getOwnerBookings()
      setBookings(res?.data || [])
    } catch (err) {
      setError(err?.message || 'Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }, [bookingServices])

  useEffect(() => { loadBookings() }, [loadBookings])

  const handleApprove = async (bookingId) => {
    if (!window.confirm('Approve this booking? The property status will be updated to Rented/Sold and all other pending bookings for this property will be rejected.')) return
    try {
      setActionLoading(bookingId)
      await bookingServices.updateBookingStatus(bookingId, 'approve')
      await loadBookings()
    } catch (err) {
      alert(err?.message || 'Failed to approve booking.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectSubmit = async () => {
    if (!rejectModal) return
    try {
      setActionLoading(rejectModal.bookingId)
      await bookingServices.updateBookingStatus(rejectModal.bookingId, 'reject', rejectReason)
      setRejectModal(null)
      setRejectReason('')
      await loadBookings()
    } catch (err) {
      alert(err?.message || 'Failed to reject booking.')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  }

  return (
    <div className='space-y-6'>

      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800'>Booking Requests</h1>
          <p className='text-slate-500 text-sm mt-0.5'>Review and manage incoming booking requests for your properties.</p>
        </div>
        <button onClick={loadBookings} className='text-xs font-semibold text-secondary hover:text-amber-600 transition'>
          ↻ Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className='flex flex-wrap gap-2'>
        {['all', 'pending', 'approved', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition ${
              filter === tab
                ? 'bg-secondary text-slate-900 shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-secondary'
            }`}
          >
            {tab} <span className='ml-1 opacity-70'>({counts[tab]})</span>
          </button>
        ))}
      </div>

      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm'>{error}</div>
      )}

      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-secondary' />
        </div>
      ) : filtered.length === 0 ? (
        <div className='bg-white rounded-2xl border border-slate-100 p-16 text-center'>
          <Clock size={36} className='mx-auto text-slate-300 mb-3' />
          <p className='text-slate-400 text-sm'>No {filter === 'all' ? '' : filter} booking requests found.</p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {filtered.map(booking => {
            const style = STATUS_STYLES[booking.status] || STATUS_STYLES.pending
            const isPending = booking.status === 'pending'
            const isProcessing = actionLoading === booking._id

            return (
              <div
                key={booking._id}
                className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
              >
                {/* Property info bar */}
                <div className='bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-3'>
                    {booking.property?.images?.[0]?.url && (
                      <img
                        src={booking.property.images[0].url}
                        alt={booking.property.title}
                        className='w-10 h-10 rounded-lg object-cover flex-shrink-0'
                      />
                    )}
                    <div className='min-w-0'>
                      <p className='font-semibold text-slate-800 text-sm truncate'>{booking.property?.title || 'Property'}</p>
                      <p className='text-xs text-slate-500'>
                        {booking.property?.location?.municipality}, {booking.property?.location?.district}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text} flex-shrink-0`}>
                    {style.label}
                  </span>
                </div>

                <div className='p-5 grid grid-cols-1 md:grid-cols-2 gap-5'>
                  {/* Tenant info */}
                  <div className='space-y-3'>
                    <h4 className='text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5'>
                      <User size={12} /> Tenant
                    </h4>
                    <div className='flex items-center gap-3'>
                      {booking.tenant?.profileImage?.url ? (
                        <img src={booking.tenant.profileImage.url} alt='' className='w-9 h-9 rounded-full object-cover border border-slate-200' />
                      ) : (
                        <div className='w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm'>
                          {booking.tenant?.name?.[0]?.toUpperCase() || 'T'}
                        </div>
                      )}
                      <div>
                        <p className='font-semibold text-slate-800 text-sm'>{booking.tenant?.name || 'Tenant'}</p>
                        <p className='text-xs text-slate-500'>{booking.tenant?.email}</p>
                        {booking.tenant?.phoneNumber && (
                          <p className='text-xs text-slate-500'>{booking.tenant.phoneNumber}</p>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-slate-600'>
                      <CalendarDays size={14} className='text-slate-400' />
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()} →{' '}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className='flex items-center gap-2 text-sm font-semibold text-secondary'>
                      <CreditCard size={14} />
                      <span>{currency}{booking.totalAmount?.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        Payment: {booking.paymentStatus || 'pending'}
                      </span>
                    </div>

                    <p className='text-xs text-slate-400'>
                      Submitted {new Date(booking.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Payment proof + actions */}
                  <div className='space-y-3'>
                    <h4 className='text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5'>
                      <Eye size={12} /> Payment Proof
                    </h4>

                    {booking.payment?.proofImage?.url ? (
                      <div
                        className='relative rounded-xl overflow-hidden border border-slate-200 cursor-pointer group'
                        onClick={() => setProofModal({ url: booking.payment.proofImage.url })}
                      >
                        <img
                          src={booking.payment.proofImage.url}
                          alt='Payment proof'
                          className='w-full h-32 object-cover group-hover:opacity-90 transition'
                        />
                        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30'>
                          <span className='text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full'>Click to enlarge</span>
                        </div>
                      </div>
                    ) : (
                      <div className='rounded-xl border-2 border-dashed border-slate-200 h-24 flex items-center justify-center'>
                        <p className='text-xs text-slate-400'>No proof uploaded</p>
                      </div>
                    )}

                    {/* Action buttons — only for pending */}
                    {isPending && (
                      <div className='flex gap-2 mt-2'>
                        <button
                          onClick={() => handleApprove(booking._id)}
                          disabled={isProcessing}
                          className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white text-sm font-semibold transition'
                        >
                          <CheckCircle size={15} />
                          {isProcessing ? 'Processing…' : 'Approve'}
                        </button>
                        <button
                          onClick={() => setRejectModal({ bookingId: booking._id })}
                          disabled={isProcessing}
                          className='flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-slate-200 text-white text-sm font-semibold transition'
                        >
                          <XCircle size={15} />
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Approved message */}
                    {booking.status === 'approved' && (
                      <p className='text-xs text-emerald-600 font-medium flex items-center gap-1'>
                        <CheckCircle size={12} /> Approved on {new Date(booking.approvedAt).toLocaleDateString()}
                      </p>
                    )}

                    {/* Rejected message */}
                    {booking.status === 'rejected' && (
                      <div className='text-xs text-red-600 space-y-0.5'>
                        <p className='font-medium flex items-center gap-1'><XCircle size={12} /> Rejected</p>
                        {booking.rejectionReason && (
                          <p className='text-slate-500'>Reason: {booking.rejectionReason}</p>
                        )}
                      </div>
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
          <div className='relative max-w-2xl w-full' onClick={e => e.stopPropagation()}>
            <img src={proofModal.url} alt='Payment proof' className='w-full rounded-2xl shadow-2xl' />
            <button
              onClick={() => setProofModal(null)}
              className='absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-lg hover:bg-slate-100 transition text-lg'
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Reject reason modal */}
      {rejectModal && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4'>
            <h3 className='font-bold text-slate-800 text-lg'>Reject Booking</h3>
            <p className='text-sm text-slate-500'>Optionally provide a reason for rejection. The property will be set back to Available.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder='Reason for rejection (optional)…'
              rows={3}
              className='w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-300 outline-none resize-none'
            />
            <div className='flex gap-3'>
              <button
                onClick={() => { setRejectModal(null); setRejectReason('') }}
                className='flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition'
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={actionLoading === rejectModal?.bookingId}
                className='flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:bg-slate-200'
              >
                {actionLoading === rejectModal?.bookingId ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
