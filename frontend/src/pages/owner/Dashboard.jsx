import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/data'

const Dashboard = () => {
  const { user, currency } = useAppContext()

  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
  })

  const getDashboardData = async () => {
    setDashboardData(dummyDashboardData)
  }

  useEffect(() => {
    getDashboardData();
  }, [user]);

  return (
    <div className='md:px-8 py-6 xl:py-8 m-1 sm:m-3 h-[97vh] overflow-y-scroll lg:w-11/12 bg-white shadow rounded-xl'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flexStart gap-7 p-5 bg-[#fff4d2] lg:min-w-56 rounded-xl'>
          <img src={assets.house} alt="" className='hidden sm:flex w-8' />
          <div>
            <h4 className='h4'>{dashboardData.totalBookings.toString().padStart(2, "0")}</h4>
            <h5 className='h5 text-secondary'>Total Sales</h5>
          </div>
        </div>
        <div className='flexStart gap-7 p-5 bg-[#d1e8ff] lg:min-w-56 rounded-xl'>
          <img src={assets.dollar} alt=""
            className='hidden sm:flex w-8' />
          <div>
            <h4 className='h4'>{currency}{dashboardData.totalRevenue}</h4>
            <h5 className='h5 text-secondary'>Total Earnings</h5>
          </div>
        </div>
      </div>
      {/*  Latest Booking/Sales  */}
      <div className='mt-4'>
        <div className='flex justify-between flex-wrap gap-2 sm:grid grid-cols-[2fr_2fr_1fr_1fr] lg:grid-cols-[0.5fr_2fr_2fr_1fr_1fr] px-6 py-3 bg-secondary border-b-1 border-slate-900/15 rounded-t-xl'>
          <h5 className='h5 hidden lg:block'>Index</h5>
          <h5 className='h5'>Property</h5>
          <h5 className='h5'>Booking dates</h5>
          <h5 className='h5'>Amount</h5>
          <h5 className='h5'>Status</h5>

        </div>
        <div>
          {dashboardData.bookings?.map((booking, index) => (
            <div key={index} className='flex justify-between items-center flex-wrap gap-2 sm:grid grid-cols-[2fr_2fr_1fr_1fr] lg:grid-cols-[0.5fr_2fr_2fr_1fr_1fr] px-6 py-3 bg-secondary/5 text-gray-50 medium-14 border-b-1 border-slate-900/15'>
              <div className='hidden lg:block'>{index + 1}</div>
              <div className='flexStart-hidden rounded-lg'>
                <div className='overflow-hidden rounded-lg'>
                  <img src={booking.property.images[0]} alt={booking.property.title} className='w-16 rounded-lg' />

                </div>
                <div className='line-clamp-2'>{booking.property.title}</div>
              </div>
              <div>{new Date(booking.checkInDate).toLocaleDateString()}</div>
              <div>{currency}{booking.totalPrice}</div>
              <button className={`${booking.isPaid ? "bg-green-400/80 text-white" : "bg-secondary/10 text-red-500"
                } w-22 py-0.5 rounded-full text-xs border border-green-500/30`}>
                {booking.isPaid ? "completed" : "Pending"}
              </button>
            </div>
          ))}
        </div>      
      </div>
    </div>
  );
};

export default Dashboard
