import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/data'
import { useAppContext } from "../context/AppContext";

const Item = ({ property }) => {
  const { currency, wishlist, toggleWishlist, isLoggedIn } = useAppContext()
  return (
    <Link to={`/listing/` + property._id}
      className='block rounded-lg bg-white ring-1 ring-slate-900/5'
    >
      {/* Image */}
      <div className='relative'>
        <img src={property.images[0]?.url || property?.images[0] || "https://propertynepal.com/images/properties/1026/168405890059.jpg"} alt={property.title}
          className='h-[13rem] w-full aspect-square object-cover rounded-t-xl'/>
        
        {/* Similarity Match Badge */}
        {property.similarityScore !== undefined && (
          property.isTrendingFallback ? (
            <div className='absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[11px] font-extrabold shadow-lg flex items-center gap-1.5 backdrop-blur-sm bg-opacity-95 border border-white/20 transition-all duration-300 hover:scale-105'>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-100"></span>
              </span>
              <span>Trending</span>
            </div>
          ) : (
            <div className='absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[11px] font-extrabold shadow-lg flex items-center gap-1 backdrop-blur-sm bg-opacity-95 border border-white/20 transition-all duration-300 hover:scale-105'>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
              </span>
              <span>{Math.round(property.similarityScore * 100)}% Match</span>
            </div>
          )
        )}
        
        {/* Watchlist Toggle Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLoggedIn) {
              import('react-toastify').then(({ toast }) => {
                toast.info("Please login first to keep properties in your Watchlist.");
              });
              return;
            }
            toggleWishlist(property._id);
            const isWished = wishlist.some(item => item._id === property._id);
            import('react-toastify').then(({ toast }) => {
              toast.success(isWished ? 'Removed from Watchlist' : 'Added to Watchlist');
            });
          }}
          className='absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm transition-all z-10 group'
          title={wishlist?.some(item => item._id === property._id) ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={wishlist?.some(item => item._id === property._id) ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`w-5 h-5 transition-transform duration-300 group-active:scale-75 ${
              wishlist?.some(item => item._id === property._id) ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'
            }`}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      {/* Info */}
      <div className="p-3">
        <div className="flexBetween">
          <h5 className="bold-16 my-1">{property.propertyType}</h5>
          <div className='bold-15 text-secondary'>
            {currency}{property.price?.rent || property.price?.value || '0'}.00
          </div>
          </div>
          <div className="flexBetween items-center gap-2">
            <h4 className='h4 line-clamp-1 flex-1'>{property.title}</h4>
            <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full whitespace-nowrap ${
              property.status === 'Sold' ? 'bg-rose-100 text-rose-700' :
              property.status === 'Rented' ? 'bg-indigo-100 text-indigo-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {property.status === 'Sold' ? 'Sold' : property.status === 'Rented' ? 'Booked' : 'Available'}
            </span>
          </div>
          <div className="flexCenter gap-4 py-2">
            <p className='flexCenter gap-x-2 border-r border-slate-900/5 pr-4 font-[500]'>
              <img src={assets.bed} alt="facilitiesIcon" width={21} />
              {property.bedrooms || property.facilities?.bedrooms || 0}
            </p>
            <p className='flexCenter gap-x-2 border-r border-slate-900/5 pr-4 font-[500]'>
              <img src={assets.bath} alt="facilitiesIcon" width={21} />
              {property.bathrooms || property.facilities?.bathrooms || 0}
            </p>
            <p className='flexCenter gap-x-2 border-r border-slate-900/5 pr-4 font-[500]'>
              <img src={assets.car} alt="facilitiesIcon" width={21} />
              {property.parking || property.facilities?.garages || 0}
            </p>
            <p className='flexCenter gap-x-2 pr-4 font-[500]'>
              <img src={assets.ruler} alt="facilitiesIcon" width={21} />
              {property.area}
            </p>
          </div>
          <p className="pt-2 mb-4 line-clamp-2">
            {property.description}
          </p>
        </div>
    </Link>
  )
}

export default Item