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
            <div key={booking._id} className='bg-white ring-1 ring-slate-900/5 p-2 pr-4 mt -3 rounded-1g'>
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
                        <p className='flex place-items-baseline gap-1 mt-0.5'>
                            <img src={assets.pin} alt="" width={13}/>
                            {booking.property.address}
                        </p>
                    </div>
                </div>

{/* Booking summary */}

<div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-t border-gray-300 pt-3'>
    <div className='flex gap-2 gap-x-4 flex-wrap'>
    <div className='flex items-center gap-x-2'>
            <h5 className='medium-14'>Booking ID:</h5>
            <p className='text-gray-400 text-xs break-all'>{booking._id}
            </p>
        </div>

        <div className='flex items-center gap-x-2'>
            <h5 className='medium-14'>Check-In:</h5>
            <p className='text-gray-400 text-xs'>{new Date(booking.checkInDate).toDateString()}
            </p>
        </div>

        <div className='flex items-center gap-x-2'>
            <h5 className='medium-14'>Check-Out:</h5>
            <p className='text-gray-400 text-xs'>{new Date(booking.checkOutDate).toDateString()}
            </p>
        </div>
    </div>

    <div className='flex gap-2 gap-x-3'>
        <div className='flex items-center gap-x-2'>
          
          <h5 className='medium-14'>Payment:</h5>
          <div className='flex items-center gap-1'>
            <span className={`min-w-2.5 h-2.5 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-yellow-500"}`}/>
            <p>{booking.isPaid ? "paid" : "unpaid"}</p>
          </div>
        </div>
{!booking.isPaid &&(
    <button className="btn-secondary !py-1 !text-xs rounded-sm">Pay Now</button>
)}

    </div>
</div>

            </div>
        ))}
    </div>
  )
}

export default MyBookings