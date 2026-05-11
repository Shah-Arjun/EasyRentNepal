import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Item from '../../components/Item'
import ItemSkeleton from '../../components/ItemSkeleton'

export default function Watchlist() {
  const { wishlistServices } = useAppContext()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await wishlistServices.getMyWishlist()
        setItems(response?.data || [])
      } catch (err) {
        const message = err?.message || ''
        if (message.toLowerCase().includes('empty')) {
          setItems([])
        } else {
          setError(message || 'Failed to load watchlist.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadWatchlist()
  }, [wishlistServices])

  return (
    <div className='bg-white rounded-2xl shadow-sm p-4 md:p-6'>
      <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>Watchlist</h1>
      <p className='text-slate-500 mt-1'>Your saved properties, ready to compare.</p>

      {error && (
        <div className='mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm'>
          {error}
        </div>
      )}

      <div className='grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-6'>
        {loading
          ? Array(6).fill(null).map((_, index) => <ItemSkeleton key={index} />)
          : items.map((property) => <Item key={property._id} property={property} />)
        }
      </div>

      {!loading && items.length === 0 && !error && (
        <div className='text-slate-500 text-center py-16'>
          Your watchlist is empty.
        </div>
      )}
    </div>
  )
}