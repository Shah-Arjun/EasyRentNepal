import React from 'react'
import { Link } from 'react-router-dom'

const Item = ({property}) => {
  return (
    <Link to={`/listing/` + property._id}
    className='block rounded-lg bg-white ring-1 ring-slate-900/5'
    >
      {/* Image */}
      <div className='relative'>
        <img src={property.images[0]} alt={property.title}
        className='h-[13rem] w-full aspect-square object-cover rounded-t-xl'/> 
      </div>
      {/* Info */}
      <div className="p-3">
        <div className="flexBetween">
          <h5 className="bold-16 my-1">
            {property.propertyType}
          </h5>
          <div className='bold-15 text-secondary'>
            Rs.{property.price.rent}.00
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Item