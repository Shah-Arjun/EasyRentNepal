import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/data'
import { useAppContext } from "../context/AppContext";

const Item = ({ property }) => {
  const { currency } = useAppContext()
  return (
    <Link to={`/listing/` + property._id}
      className='block rounded-lg bg-white ring-1 ring-slate-900/5'
    >
      {/* Image */}
      <div className='relative'>
        <img src={property.images[0]?.url || property?.images[0] || "https://propertynepal.com/images/properties/1026/168405890059.jpg"} alt={property.title}
          className='h-[13rem] w-full aspect-square object-cover rounded-t-xl'/>
      </div>
      {/* Info */}
      <div className="p-3">
        <div className="flexBetween">
          <h5 className="bold-16 my-1">{property.propertyType}</h5>
          <div className='bold-15 text-secondary'>
            {currency}{property.price?.rent || property.price?.value || '0'}.00
          </div>
          </div>
          <h4 className='h4 line-clamp-1'>{property.title}</h4>
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