import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

export default function Payments() {
  const { tenantServices, currency } = useAppContext()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await tenantServices.getPayments()
        setPayments(response?.data || [])
      } catch (err) {
        setError(err?.message || 'Failed to load payments.')
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [tenantServices])

  return (
    <div className='bg-white rounded-2xl shadow-sm p-4 md:p-6'>
      <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>Payments</h1>
      <p className='text-slate-500 mt-1'>Review all payment records and current status.</p>

      {error && (
        <div className='mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm'>
          {error}
        </div>
      )}

      {loading ? (
        <div className='flexCenter h-[50vh]'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-secondary'></div>
        </div>
      ) : payments.length > 0 ? (
        <div className='mt-6 overflow-x-auto rounded-xl border border-slate-200'>
          <table className='w-full text-left'>
            <thead className='bg-slate-50'>
              <tr>
                <th className='px-4 py-3 text-sm font-semibold text-slate-600'>Date</th>
                <th className='px-4 py-3 text-sm font-semibold text-slate-600'>Owner</th>
                <th className='px-4 py-3 text-sm font-semibold text-slate-600'>Method</th>
                <th className='px-4 py-3 text-sm font-semibold text-slate-600'>Amount</th>
                <th className='px-4 py-3 text-sm font-semibold text-slate-600'>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className='border-t border-slate-100'>
                  <td className='px-4 py-3 text-sm text-slate-700'>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3 text-sm text-slate-700'>
                    {payment.ownerId?.name || 'Owner'}
                  </td>
                  <td className='px-4 py-3 text-sm text-slate-700'>
                    {payment.method || '-'}
                  </td>
                  <td className='px-4 py-3 text-sm font-semibold text-slate-800'>
                    {currency}{payment.amount || 0}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    <StatusChip status={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='text-slate-500 text-center py-16'>No payment records found.</div>
      )}
    </div>
  )
}

function StatusChip({ status }) {
  const value = (status || '').toLowerCase()
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    'not received': 'bg-slate-200 text-slate-700',
  }

  return (
    <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${styles[value] || 'bg-slate-100 text-slate-700'}`}>
      {status || 'unknown'}
    </span>
  )
}
