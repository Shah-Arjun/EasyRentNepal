import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart, MapPin, Eye, CalendarCheck, Trash2 } from 'lucide-react';

export default function Watchlist() {
  const { wishlist, toggleWishlist, currency, isLoggedIn } = useAppContext();
  const navigate = useNavigate();

  const handleRemove = async (propertyId) => {
    try {
      await toggleWishlist(propertyId);
      toast.success("Removed from watchlist");
    } catch (error) {
      toast.error("Failed to remove from watchlist");
    }
  };

  const handleBookNow = (propertyId) => {
    navigate(`/listing/${propertyId}`);
  };

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 min-h-[500px]'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-3 bg-rose-50 rounded-xl text-rose-500'>
          <Heart size={24} className="fill-current" />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-slate-800'>My Watchlist</h1>
          <p className='text-slate-500 text-sm'>You have {wishlist?.length || 0} saved properties</p>
        </div>
      </div>

      {(!wishlist || wishlist.length === 0) ? (
        <div className='flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200'>
          <Heart size={48} className='text-slate-300 mb-4' />
          <h3 className='text-lg font-semibold text-slate-700 mb-1'>Your watchlist is empty</h3>
          <p className='text-slate-500 mb-6 max-w-sm'>Start exploring properties and click the heart icon to save them here for later.</p>
          <Link
            to='/listing'
            className='px-6 py-2.5 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98]'
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
              <tr>
                <th className="p-4 font-semibold">Property</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wishlist.map((property) => (
                <tr key={property._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {property.images?.[0]?.url ? (
                        <img
                          src={property.images[0].url}
                          alt={property.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex-shrink-0"></div>
                      )}
                      <div className="min-w-[200px] whitespace-normal">
                        <Link to={`/listing/${property._id}`} className="font-semibold text-slate-800 hover:text-secondary transition-colors line-clamp-1 text-base">
                          {property.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin size={12} />
                          {property.location?.municipality}, {property.location?.district}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="font-bold text-secondary text-base">
                      {currency}{property.price?.value?.toLocaleString() || 'N/A'}
                    </div>
                    {property.price?.perUnit && (
                      <div className="text-xs text-slate-400 font-medium">/{property.price.perUnit}</div>
                    )}
                  </td>
                  
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${
                      property.status === 'Sold' ? 'bg-rose-100 text-rose-700' :
                      property.status === 'Rented' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {property.status === 'Sold' ? 'Sold' : property.status === 'Rented' ? 'Booked' : 'Available'}
                    </span>
                  </td>
                  
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/listing/${property._id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
                      >
                        <Eye size={18} className='text-black'/>
                      </Link>
                      
                      <button
                        onClick={() => handleBookNow(property._id)}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium hover:opacity-90 transition"
                        title='Book Now'
                      > 
                        <CalendarCheck size={18} />
                      </button>
                      
                      <button
                        onClick={() => handleRemove(property._id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition"
                        title='Remove from Wishlist'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}