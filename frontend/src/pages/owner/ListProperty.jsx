import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

const ListProperty = () => {
  const { ownerProperties, currency, deleteProperty, loading, getOwnerProperties, propertyServices, isLoggedIn } = useAppContext()
  const [localProperties, setLocalProperties] = useState([])

 useEffect(() => {
   setLocalProperties(ownerProperties)
 }, [ownerProperties])

 const handleDelete = async (propertyId) => {
   const confirmed = window.confirm('Are you sure you want to delete this property?')
   if (confirmed) {
     const success = await deleteProperty(propertyId)
     if (success) {
       setLocalProperties(prev => prev.filter(p => p._id !== propertyId))
       alert('Property deleted successfully')
     } else {
       alert('Failed to delete property')
     }
   }
 }

 const handleAvailabilityToggle = async (propertyId, currentStatus) => {
   try {
     // You can update availability here when the API is ready
     // For now, just toggle in UI
     setLocalProperties(prev => prev.map(p => 
       p._id === propertyId ? {...p, status: currentStatus === 'Available' ? 'Unavailable' : 'Available'} : p
     ))
   } catch (error) {
     console.error('Error updating availability:', error)
   }
 }

  return (
    <div className='md:px-8 py-6 xl:py-8 m-1 sm:m-3 h-[97vh] overflow-y-scroll lg:w-11/12 bg-white shadow rounded-xl'>
   {/*Latest Booking/Sales*/}
   <div>
   <div className='flex justify-between flex-wrap gap-2 sm:grid grid-cols-[2fr_2fr_1fr_1fr_0.5fr] lg:grid-cols-[0.5fr_2fr_2fr_1fr_1fr_0.5fr] px-6 py-3 bg-secondary border-b border-slate-900/15 rounded-t-xl'>
          <h5 className='h5 hidden lg:block'>Index</h5>
          <h5 className='h5'>Name</h5>
          <h5 className='h5'>Address</h5>
          <h5 className='h5'>Price</h5>
          <h5 className='h5'>Status</h5>
          <h5 className='h5 flex justify-center'>Action</h5>
        </div>
        <div>
          {loading ? (
            <div className='flexCenter py-20'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-secondary'></div>
              <p className='ml-4 text-gray-500 medium-14'>Fetching your properties...</p>
            </div>
          ) : localProperties && localProperties.length > 0 ? (
            localProperties.map((property, index) => (
              <div key={property._id} className='flex justify-between items-center flex-wrap gap-2 sm:grid grid-cols-[2fr_2fr_1fr_1fr_0.5fr] lg:grid-cols-[0.5fr_2fr_2fr_1fr_1fr_0.5fr] px-6 py-3 bg-secondary/5 text-gray-50 medium-14 font-semibold border-b border-slate-900/15'>
                <div className='hidden lg:block'>{index + 1}</div>
                <div className='flexStart gap-x-2 rounded-lg'>
                  <div className='overflow-hidden rounded-lg'>
                    <img 
                      src={property.images?.[0]?.url || 'https://via.placeholder.com/64'} 
                      alt={property.title} 
                      className='w-16 h-12 object-cover rounded-lg' 
                    />
                  </div>
                  <div className='line-clamp-2'>{property.title}</div>
                </div>
                <div className='line-clamp-2'>
                  {property.location?.municipality}, {property.location?.district}
                </div>
                <div>
                  {currency}{property.price?.value || 'N/A'}
                </div>
                <div className='text-center bold-14'>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    property.status === 'Available' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {property.status || 'Pending'}
                  </span>
                </div>
                <div className='flex justify-center'>
                  <button 
                    onClick={() => handleDelete(property._id)}
                    className='p-1.5 rounded-lg bg-red-100/50 text-red-500 hover:bg-red-500 hover:text-white transition-all ring-1 ring-red-500/30'
                    title="Delete Property"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='px-6 py-8 text-center text-gray-400'>
              No properties listed yet. <a href="/owner/add-property" className='text-secondary hover:underline'>Add your first property</a>
            </div>
          )}
        </div>
   </div>
    </div>
  )
}

export default ListProperty
