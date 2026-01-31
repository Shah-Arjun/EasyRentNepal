import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/Appcontext'
import { useParams } from 'react-router-dom'
import PropertyImages from '../components/PropertyImages'
import { assets } from '../assets/data'

const PropertyDetails = () => {
    const { properties, currency } = useAppContext()
    const [property, setProperty] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const property = properties.find((property) => property._id === id)
        property && setProperty(property)
    }, [properties])
    return (
        property && (
            <div className='bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28'>
                <div className='max-padd-container'>
                    {/* Image */}
                    <PropertyImages property={property} />
                    {/* Container*/}
                    <div className='flex flex-col xl:flex-row gap-8 mt-6'>
                        {/* Left Side */}
                        <div className='p-4 flex-2 rounded-xl border border-slate-900/10'>
                            <p className='flexStart gap-x-2 '>
                                <img src={assets.pin} alt="" width={19} />
                                <span>{property.address}</span>
                            </p>
                            <div className='flex justify-between flex-col sm:flex-row sm:items-end mt-3'>
                                <h3 className="h3">{property.title}</h3>
                                <div className='bold-18'>
                                    {currency}{property.price.rent}.00/month
                                </div>
                            </div>
                            <div className='flex justify-between items-start my-1'>
                                <h4 className='h4 text-secondary'>{property.propertyType}</h4>
                                <div className='flex items-baseline gap-2 text-secondary relative top-1.5'>
                                    <h4 className="bold-18 relative bottom-0.5 text-black">5.0</h4>
                                    <img src={assets.star} alt="" width={18} />
                                    <img src={assets.star} alt="" width={18} />
                                    <img src={assets.star} alt="" width={18} />
                                    <img src={assets.star} alt="" width={18} />
                                    <img src={assets.star} alt="" width={18} />
                                </div>
                            </div>
                            <div className='flex gap-x-4 mt-3'>
                                <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                                    <img src={assets.bed} alt="" width={19} />
                                    {property.facilities.bedrooms}
                                </p>
                                <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                                    <img src={assets.bath} alt="" width={19} />
                                    {property.facilities.bathrooms}
                                </p>
                                <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                                    <img src={assets.car} alt="" width={19} />
                                    {property.facilities.garages}
                                </p>
                                <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                                    <img src={assets.ruler} alt="" width={19} />
                                    {property.area}
                                </p>
                            </div>
                            <div className='mt-6'>
                                <h4 className='h4 mt-4 mb-1'>Property Details</h4>
                                <p className='mb-4'>{property.description}</p>
                            </div>
                            <h4 className='h4 mt-6 mb-2'>Amenities</h4>
                            <div className="flex gap-3">
                                {property.amenities.map((amenity, index) => (
                                    <div key={index} className='p-3 py-1 rounded-lg bg-secondary-10 ring-1 ring-slate-900/10 text-sm'>{amenity}</div>
                                ))}
                            </div>
                            {/* Form Check Availability */}
                            <form className='text-gray-500 bg-secondary/10 rounded-lg px-6 py-4 flex flex-col lg:flex-row gap-4 max-w-md lg:max-w-full ring-1 ring-slate-900/5 relative mt-10'>
                                <div className='flex flex-col w-full'>
                                    <div className='flex items-center gap-2'>
                                        <img src={assets.calendar} alt="calenderIcon" width={20} />
                                        <label htmlFor="CheckIn">Move-In Date</label>
                                    </div>
                                    <input type="date" id="CheckIn"
                                        className='rounded bg-secondary/10 border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none' />
                                </div>
                                <div className='flex flex-col w-full'>
                                    <div className='flex items-center gap-2'>
                                        <img src={assets.user} alt="userIcon" width={20} />
                                        <label htmlFor="guests">Tenants</label>
                                    </div>
                                    <input id='guests' type='number' min={1} max={5}
                                        className='rounded bg-secondary/10 border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none'
                                        placeholder='1' />
                                </div>
                                <button type='submit' className='flexCenter gap-1 rounded-md btn-dark min-w-44'>

                                    <img src={assets.search} alt="searchIcon" width={20} className='invert' />
                                    <span>Check</span>
                                </button>
                            </form>
                        </div>
                        {/* Right Side */}
                        <div className='flex-1 max-w-sm'>
                            <div className='p-6 rounded-xl border border-slate-900/10'>
                                <h4 className="h4 mb-3">Contact Owner</h4>
                                <form className='flex flex-col gap-4'>
                                    <input type="text" placeholder='Your Name' className='p-2 py-1 border border-gray-300 rounded-md text-sm' required />
                                    <input type="email" placeholder='Your Email' className='p-2 py-1 border border-gray-300 rounded-md text-sm' required />
                                    <textarea rows={4} placeholder='Your Message' className='p-2 py-1 border border-gray-300 rounded-md text-sm' required />
                                    <button type="submit" className="btn-secondary rounded-lg py-1.5">Send Message</button>
                                </form>
                                <h4 className="h4 mt-3 mb-8">For Renting Contact</h4>
                                <div className='text-sm w-80 divide-y divide-gray-500/30 border border-gray-500/30 rounded'>
                                    <div className='flex item-start justify-between p-3'>
                                        <div>
                                            <div className='flex items-center space-x-2 '>
                                                <h5 className='h5'>{property.agency.owner.username}</h5>
                                                <p className='bg-green-500/20 px-2 py-0.5 rounded-full text-xs text-green-600 border border-green-500/30'>Owner</p>
                                            </div>
                                            <p>Property Owner</p>
                                        </div>
                                        <img src={property.agency.owner.image} alt="" className='h-10 w-10 rounded-full '/>
                                    </div>
                                    <div className='flexStart gap-2 p-1.5'>
                                        <div className='bg-green-500/20 p-1 rounded-full border-green-500/30'>
                                            <img src={assets.phone} alt="" width={14} />
                                        </div>
                                        <p>{property.agency.contact}</p>
                                    </div>
                                    <div className='flexStart gap-2 p-1.5'>
                                        <div className='bg-green-500/20 p-1 rounded-full border-green-500/30'>
                                            <img src={assets.mail} alt="" width={14} />
                                        </div>
                                        <p>{property.agency.email}</p>
                                    </div>
                                    <div className='flex items-center divide-x divide-gray-500/30'>
                                        <button className='flex items-center justify-center gap-2 w-1/2 py-3 cursor-pointer '>
                                            <img src={assets.mail} alt="" width={19} />
                                            Send Email
                                        </button>
                                        <button className='flex items-center justify-center gap-2 w-1/2 py-3 cursor-pointer '>
                                            <img src={assets.phone} alt="" width={19} />
                                            Call Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    )
}

export default PropertyDetails