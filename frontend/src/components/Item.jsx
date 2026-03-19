import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/data'
import { useAppContext } from '../context/AppContext'

const Item = ({ property }) => {
  const { currency } = useAppContext()
  
  // Handle undefined or invalid property
  if (!property) {
    return null;
  }

  return (
    <Link to={`/listing/` + property._id}
      className='block rounded-lg bg-white ring-1 ring-slate-900/5'
    >
      {/* Image */}
      <div className='relative'>
        <img src={property.images?.[0]?.url || property.images?.[0] || 'https://images.pexels.com/photos/7027844/pexels-photo-7027844.jpeg'} alt={property.title}
          className='h-[13rem] w-full aspect-square object-cover rounded-t-xl'/>
      </div>
      {/* Info */}
      <div className="p-3">
        <div className="flexBetween">
          <h5 className="bold-16 my-1">{property.category}</h5>
          <div className='bold-15 text-secondary'>
            {currency}{property.price?.value || 0}.00
          </div>
          </div>
          <h4 className='h4 line-clamp-1'>{property.title}</h4>
          <div className="flexCenter gap-4 py-2">
            {property.bedrooms && (
              <p className='flexCenter gap-x-2 border-r border-slate-900/5 pr-4 font-[500]'>
                <img src={assets.bed} alt="facilitiesIcon" width={21} />
                {property.bedrooms}
              </p>
            )}
            {property.bathrooms && (
              <p className='flexCenter gap-x-2 border-r border-slate-900/5 pr-4 font-[500]'>
                <img src={assets.bath} alt="facilitiesIcon" width={21} />
                {property.bathrooms}
              </p>
            )}
            {property.parking && property.parking !== 'None' && (
              <p className='flexCenter gap-x-2 border-r border-slate-900/5 pr-4 font-[500]'>
                <img src={assets.car} alt="facilitiesIcon" width={21} />
                {property.parking.split(' ')[0]}
              </p>
            )}
            {property.builtArea?.value && (
              <p className='flexCenter gap-x-2 pr-4 font-[500]'>
                <img src={assets.ruler} alt="facilitiesIcon" width={21} />
                {property.builtArea.value}
              </p>
            )}
          </div>
          <p className="pt-2 mb-4 line-clamp-2">
            {property.fullDescription}
          </p>
        </div>
    </Link>
  )
}

export default Item