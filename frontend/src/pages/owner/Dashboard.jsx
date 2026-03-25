import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/data'

const Dashboard = () => {
  const { currency, propertyServices } = useAppContext()

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProperties: 0,
       totalReviews: 0,
       averageRating: 0
    },
    latestReviews: [],
    properties: []
  })
  const [loading, setLoading] = useState(true)

  const getDashboardData = async () => {
    try {
      setLoading(true)
      const response = await propertyServices.getOwnerDashboardData()
      if (response.success) {
        setDashboardData(response)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className='flexCenter h-[80vh] w-full'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-secondary'></div>
      </div>
    )
  }

  return (
    <div className='md:px-8 py-6 xl:py-8 m-1 sm:m-3 h-[97vh] overflow-y-scroll lg:w-11/12 bg-white shadow rounded-xl'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='flexStart gap-7 p-6 bg-[#fff4d2] rounded-2xl border border-[#fef08a] shadow-sm'>
          <div className='bg-white/50 p-3 rounded-xl'>
            <img src={assets.house} alt="" className='w-8' />
          </div>
          <div>
            <h4 className='h4 text-slate-800'>{dashboardData.stats.totalProperties.toString().padStart(2, "0")}</h4>
            <h5 className='medium-16 text-slate-500'>Properties</h5>
          </div>
        </div>
        <div className='flexStart gap-7 p-6 bg-[#d1e8ff] rounded-2xl border border-[#bae6fd] shadow-sm'>
          <div className='bg-white/50 p-3 rounded-xl'>
            <img src={assets.star} alt="" className='w-8' />
          </div>
          <div>
            <h4 className='h4 text-slate-800'>{dashboardData.stats.averageRating} / 5.0</h4>
            <h5 className='medium-16 text-slate-500'>Avg Rating</h5>
          </div>
        </div>
        <div className='flexStart gap-7 p-6 bg-green-50 rounded-2xl border border-green-100 shadow-sm'>
          <div className='bg-white/50 p-3 rounded-xl'>
            <img src={assets.calendar} alt="" className='w-8' />
          </div>
          <div>
            <h4 className='h4 text-slate-800'>{dashboardData.stats.totalReviews.toString().padStart(2, "0")}</h4>
            <h5 className='medium-16 text-slate-500'>Total Reviews</h5>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
        {/* Latest Reviews */}
        <div className='p-6 rounded-2xl border border-slate-100 bg-slate-50/30'>
          <h3 className='h3 mb-6'>Latest Reviews</h3>
          <div className='space-y-4'>
            {dashboardData.latestReviews.length > 0 ? (
              dashboardData.latestReviews.map((rev) => (
                <div key={rev._id} className='bg-white p-4 rounded-xl shadow-sm border border-slate-100'>
                  <div className='flexBetween mb-2'>
                    <div className='flexStart gap-3'>
                      <img src={rev.userId?.profileImage || assets.user} alt="" className='w-8 h-8 rounded-full border' />
                      <h5 className='bold-15'>{rev.userId?.name || 'User'}</h5>
                    </div>
                    <div className='flex gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src={assets.star} alt="" width={12} className={i < rev.rating ? "" : "opacity-20"} />
                      ))}
                    </div>
                  </div>
                  <p className='text-xs font-semibold text-secondary mb-1'>on {rev.propertyId?.title}</p>
                  <p className='text-sm text-slate-600 italic'>"{rev.comment}"</p>
                  <p className='text-[10px] text-slate-400 mt-2'>{new Date(rev.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className='text-slate-500 italic text-center py-10'>No reviews yet for your properties.</p>
            )}
          </div>
        </div>

        {/* My Properties Summary */}
        <div className='p-6 rounded-2xl border border-slate-100 bg-slate-50/30'>
          <h3 className='h3 mb-6'>My Properties</h3>
          <div className='bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-slate-50 border-b border-slate-100'>
                  <th className='px-4 py-3 text-sm font-bold text-slate-600'>Property</th>
                  <th className='px-4 py-3 text-sm font-bold text-slate-600'>Price</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-50'>
                {dashboardData.properties.length > 0 ? (
                  dashboardData.properties.map((property) => (
                    <tr key={property._id} className='hover:bg-slate-50/50 transition-colors'>
                      <td className='px-4 py-3'>
                        <div className='flexStart gap-3'>
                          {property.images?.[0] && (
                            <img src={property.images[0].url} alt="" className='w-10 h-10 rounded shadow-sm object-cover' />
                          )}
                          <p className='text-sm font-medium text-slate-700 line-clamp-1'>{property.title}</p>
                        </div>
                      </td>
                      <td className='px-4 py-3 text-sm font-bold text-secondary'>
                        {currency}{property.price?.value}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className='px-4 py-10 text-center text-slate-500 italic'>No properties added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard
