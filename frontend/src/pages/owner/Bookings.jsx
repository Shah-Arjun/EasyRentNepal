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

  const handleStatusUpdate = async (bookingId, field, value) => {
    let updates = {};
    if (field === 'bookingStatus') {
      if (value === 'approved') {
        if (!window.confirm('Approve this booking? This will update the property status to Rented/Sold and reject other pending bookings.')) return;
      }
      if (value === 'rejected') {
        const reason = window.prompt('Reason for rejection (optional):');
        if (reason === null) return; // User cancelled prompt
        updates.reason = reason;
      }
      updates.bookingStatus = value;
    } else if (field === 'paymentStatus') {
      updates.paymentStatus = value;
    } else if (field === 'propertyStatus') {
      updates.propertyStatus = value;
    }

    try {
      setActionLoading(bookingId);
      await bookingServices.updateBookingStatus(bookingId, updates);
      await loadBookings();
    } catch (err) {
      alert(err?.message || 'Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

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
                <div className="overflow-x-auto rounded-xl border border-slate-200">

                  <table className="min-w-full text-sm text-left">

                    {/* HEADER */}
                    <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                      <tr>
                        <th className="p-3">Property ID</th>
                        <th className="p-3">Property</th>
                        <th className="p-3">Tenant</th>
                        <th className="p-3">Booking Dates</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Proof</th>
                        <th className="p-3">Booking Status</th>
                        <th className="p-3">Payment Status</th>
                        <th className="p-3">Property Status</th>
                      </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>

                      <tr className="border-t">

                        {/* Property ID */}
                        <td className="p-3 font-semibold text-slate-700">
                          ERN-01
                        </td>

                        {/* Property */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {booking.property?.images?.[0]?.url && (
                              <img
                                src={booking.property.images[0].url}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-slate-800">
                                {booking.property?.title || "Property"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {booking.property?.location?.municipality},{" "}
                                {booking.property?.location?.district}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tenant */}
                        <td className="p-3">
                          <div>
                            <p className="font-semibold">{booking.tenant?.name}</p>
                            <p className="text-xs text-slate-500">
                              {booking.tenant?.email}
                            </p>
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="p-3 text-xs text-slate-600">
                          {new Date(booking.startDate).toLocaleDateString()} →{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </td>

                        {/* Amount */}
                        <td className="p-3 font-semibold text-secondary">
                          {currency}{booking.totalAmount?.toLocaleString()}
                        </td>

                        {/* Payment */}
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            booking.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {booking.paymentStatus || "pending"}
                          </span>
                        </td>

                        {/* Proof */}
                        <td className="p-3">
                          {booking.payment?.proofImage?.url ? (
                            <img
                              src={booking.payment.proofImage.url}
                              className="w-12 h-12 rounded-md object-cover cursor-pointer"
                              onClick={() =>
                                setProofModal({
                                  url: booking.payment.proofImage.url,
                                })
                              }
                            />
                          ) : (
                            <span className="text-xs text-slate-400">
                              No proof
                            </span>
                          )}
                        </td>

                        {/* Booking Status */}
                        <td className="p-3">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                booking._id,
                                "bookingStatus",
                                e.target.value
                              )
                            }
                            className="border p-1 rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>

                        {/* Payment Status */}
                        <td className="p-3">
                          <select
                            value={booking.paymentStatus || "pending"}
                            onChange={(e) =>
                              handleStatusUpdate(
                                booking._id,
                                "paymentStatus",
                                e.target.value
                              )
                            }
                            className="border p-1 rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                          </select>
                        </td>

                        {/* Property Status */}
                        <td className="p-3">
                          <select
                            value={booking.property?.status || "Available"}
                            onChange={(e) =>
                              handleStatusUpdate(
                                booking._id,
                                "propertyStatus",
                                e.target.value
                              )
                            }
                            className="border p-1 rounded"
                          >
                            <option value="Available">Available</option>
                            <option value="Rented">Rented</option>
                            <option value="Sold">Sold</option>
                          </select>
                        </td>

                      </tr>

                    </tbody>
                  </table>
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
