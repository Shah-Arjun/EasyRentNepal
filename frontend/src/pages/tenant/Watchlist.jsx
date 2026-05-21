import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart, MapPin, Eye, CalendarCheck, Trash2 } from 'lucide-react';

export default function Watchlist() {
  const { wishlist, toggleWishlist, currency } = useAppContext();
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

      {/* HEADER */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-3 bg-rose-50 rounded-xl text-rose-500'>
          <Heart size={24} className="fill-current" />
        </div>
        <div>
          <h1 className='text-2xl font-bold text-slate-800'>My Watchlist</h1>
          <p className='text-slate-500 text-sm'>
            You have {wishlist?.length || 0} saved properties
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {(!wishlist || wishlist.length === 0) ? (
        <div className='flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200'>
          <Heart size={48} className='text-slate-300 mb-4' />
          <h3 className='text-lg font-semibold text-slate-700 mb-1'>
            Your watchlist is empty
          </h3>
          <p className='text-slate-500 mb-6 max-w-sm'>
            Start exploring properties and click the heart icon to save them here for later.
          </p>
          <Link
            to='/listing'
            className='px-6 py-2.5 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98]'
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <>
          {/* ================= MOBILE VIEW ================= */}
          <div className="md:hidden space-y-4">
            {wishlist.map((property) => (
              <div
                key={property._id}
                className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm"
              >
                <div className="flex gap-3">
                  {/* IMAGE */}
                  {property.images?.[0]?.url ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-100" />
                  )}

                  {/* INFO */}
                  <div className="flex-1">
                    <div className="text-xs text-slate-400">
                      {property.propertyId}
                    </div>

                    <Link
                      to={`/listing/${property._id}`}
                      className="font-semibold text-slate-800 line-clamp-1"
                    >
                      {property.title}
                    </Link>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} />
                      {property.location?.municipality},{" "}
                      {property.location?.district}
                    </p>

                    <div className="mt-2 font-bold text-secondary">
                      {currency}
                      {property.price?.value?.toLocaleString() || 'N/A'}
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Link
                        to={`/listing/${property._id}`}
                        className="px-2 py-1 bg-slate-100 rounded-md text-xs"
                      >
                        <Eye size={14} />
                      </Link>

                      <button
                        onClick={() => handleBookNow(property._id)}
                        className="px-2 py-1 bg-secondary text-white rounded-md text-xs"
                      >
                        <CalendarCheck size={14} />
                      </button>

                      <button
                        onClick={() => handleRemove(property._id)}
                        className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm text-left">

              <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="p-4 font-semibold">Property ID</th>
                  <th className="p-4 font-semibold">Property</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {wishlist.map((property) => (
                  <tr key={property._id} className="hover:bg-slate-50 transition">

                    {/* PROPERTY ID COLUMN */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                        {property.propertyId}
                      </span>
                    </td>

                    {/* PROPERTY DETAILS */}
                    <td className="p-4">
                      <div className="flex items-start gap-3">

                        {/* IMAGE */}
                        {property.images?.[0]?.url ? (
                          <img
                            src={property.images[0].url}
                            alt={property.title}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0" />
                        )}

                        {/* TEXT */}
                        <div className="min-w-0">
                          <Link
                            to={`/listing/${property._id}`}
                            className="font-semibold text-slate-800 hover:text-secondary block truncate max-w-[240px]"
                          >
                            {property.title}
                          </Link>

                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin size={12} />
                            <span className="truncate max-w-[220px]">
                              {property.location?.municipality},{" "}
                              {property.location?.district}
                            </span>
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-secondary">
                        {currency}
                        {property.price?.value?.toLocaleString() || "N/A"}
                      </div>

                      {property.price?.perUnit && (
                        <div className="text-xs text-slate-400">
                          /{property.price.perUnit}
                        </div>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-[10px] uppercase font-bold rounded-full ${
                        property.status === "Sold"
                          ? "bg-rose-100 text-rose-700"
                          : property.status === "Rented"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {property.status === "Sold"
                          ? "Sold"
                          : property.status === "Rented"
                          ? "Booked"
                          : "Available"}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">

                        <Link
                          to={`/listing/${property._id}`}
                          className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                        >
                          <Eye size={16} />
                        </Link>

                        <button
                          onClick={() => handleBookNow(property._id)}
                          className="p-2 bg-secondary text-white rounded-lg hover:opacity-90"
                        >
                          <CalendarCheck size={16} />
                        </button>

                        <button
                          onClick={() => handleRemove(property._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}