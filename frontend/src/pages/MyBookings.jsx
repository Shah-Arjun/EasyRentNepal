import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/Appcontext'
import { assets, dummyBookingsData } from '../assets/data'

const MyBookings = () => {
    const [bookings, setBookings] = useState()
    const { currency, user } = useAppContext()

    const getUserBooking = ()=>{
        setBookings (dummyBookingsData)
    }

    useEffect(() => {
        if(user){
            getUserBooking()
        }
    },[user])

  return (
    <div className='max-padd-container bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28'>
        {bookings?.map((booking)=>(
            <div key={booking._id} className=''>
                {/* Property List */}
                <div className='flexStart gap-3 mb-3 '>
                    <img src={booking.property.images[0]} alt="propertyImg" className='h-12 w-26 object-cover rounded-lg' />
                    <div>
                        <h5 className="h5 capitalize line-clamp-1">
                            {booking.property.title}
                        </h5>
                        <div className='flex gap-4'>
                            <div className='flex items-center gap-x-2'>
                                <h5 className="medium-14">Tenants:</h5>
                                <p>{booking.guests}</p>
                            </div>
                            <div className='flex items-center gap-x-2'>
                                <h5 className="medium-14">Total:</h5>
                                <p className='text-gray-400 text-sm'>{currency}{booking.totalPrice}</p>
                            </div>
                        </div>
                        <p>
                            <img src={assets.pin} alt="" width={13}/>
                            {booking.property.address}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default MyBookings