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
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track all your booking requests and their current status.
        </p>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-100 shadow-sm">

        <table className="min-w-full text-sm text-left">

          {/* TABLE HEADER */}
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
            <tr>
              <th className="p-3">Property ID</th>
              <th className="p-3">Property</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Proof</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>

            {bookings.map((booking) => {
              const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
              const StatusIcon = cfg.icon
              const pStatus = PAYMENT_STATUS[booking.payment?.status || booking.paymentStatus] || PAYMENT_STATUS.pending

              return (
                <tr key={booking._id} className="border-t hover:bg-slate-50 transition">

                  {/* Property ID */}
                  <td className="p-3 font-medium text-md text-slate-500 whitespace-nowrap">
                    {booking.property?.propertyId}
                  </td>

                  {/* Property */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {booking.property?.images?.[0]?.url && (
                        <img
                          src={booking.property.images[0].url}
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {booking.property?.title || "Property"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.property?.location?.municipality},{" "}
                          {booking.property?.location?.district}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Start Date */}
                  <td className="p-3 text-xs text-slate-600 whitespace-nowrap font-medium">
                    {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}
                  </td>

                  {/* Amount */}
                  <td className="p-3 font-semibold text-secondary whitespace-nowrap">
                    {currency}{booking.totalAmount?.toLocaleString()}
                  </td>

                  {/* Payment */}
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${pStatus.bg} ${pStatus.text}`}>
                      {pStatus.label}
                    </span>
                  </td>

                  {/* Booking Status */}
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon size={12} />
                      {cfg.label}
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="p-3 text-xs text-slate-600">
                    {booking.owner?.name || booking.property.owner.name}
                    {booking.property?.owner?.contact && (
                      <div className="text-slate-400">{booking.property.owner.contact}</div>
                    )}
                  </td>

                  {/* Proof */}
                  <td className="p-3">
                    {booking.payment?.proofImage?.url ? (
                      <img
                        src={booking.payment.proofImage.url}
                        className="w-10 h-10 rounded-md object-cover cursor-pointer border"
                        onClick={() =>
                          setProofModal({ url: booking.payment.proofImage.url })
                        }
                      />
                    ) : (
                      <span className="text-xs text-slate-400">No proof</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="p-3">
                    {booking.property?._id && (
                      <Link
                        to={`/listing/${booking.property._id}`}
                        className="text-xs font-semibold text-secondary hover:text-amber-600"
                      >
                        View →
                      </Link>
                    )}
                  </td>

                </tr>
              )
            })}

          </tbody>
        </table>



        {/* on ckick image --> show */}
        {proofModal && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setProofModal(null)}
          >
            <div
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <img
                src={proofModal.url}
                alt="Payment Proof"
                className="w-full max-h-[95vh] object-contain rounded-xl shadow-2xl"
              />

              {/* Close Button */}
              <button
                onClick={() => setProofModal(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black shadow-md hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>



      {/* Empty state  */}
      {bookings.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          No bookings found
        </div>
      )}

    </div>
  )
}