import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import PropertyImages from '../components/PropertyImages'
import { assets } from '../assets/data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Item from '../components/Item'

const PropertyDetails = () => {
    const { properties, currency, propertyServices, reviewServices, userProfile, isLoggedIn } = useAppContext()
    const [property, setProperty] = useState(null)
    const [reviews, setReviews] = useState([])
    const [recommendedItems, setRecommendedItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [reviewLoading, setReviewLoading] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const { id } = useParams()
    const navigate = useNavigate()

    const fetchReviews = async () => {
        try {
            const data = await reviewServices.getPropertyReviews(id)
            if (data.success) {
                setReviews(data.reviews)
            }
        } catch (error) {
            console.error("Error fetching reviews:", error)
        }
    }

    useEffect(() => {
        const getPropertyDetails = async () => {
            try {
                setLoading(true)
                // First try to find in cached properties
                let foundProperty = properties.find((property) => property._id === id)

                // If not found in cache, fetch from API
                if (!foundProperty) {
                    const response = await propertyServices.getPropertyById(id)
                    if (response.success) {
                        foundProperty = response.property
                    }
                }

                setProperty(foundProperty || null)
            } catch (error) {
                console.error('Error fetching property details:', error)
                setProperty(null)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            getPropertyDetails()
            fetchReviews()
        }
    }, [id, properties, propertyServices])

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        if (!isLoggedIn) {
            alert("Please login to submit a review")
            return
        }
        if (userProfile?.role !== 'tenant') {
            alert("Only tenants can submit reviews")
            return
        }

        try {
            setReviewLoading(true)
            const response = await reviewServices.createReview(id, { rating, comment })
            if (response.success) {
                setComment("")
                setRating(5)
                fetchReviews() 
                // We should also refresh property to get new average
                const propResponse = await propertyServices.getPropertyById(id)
                if (propResponse.success) {
                    setProperty(propResponse.property)
                }
            }
        } catch (error) {
            console.error("Error submitting review:", error)
            alert(error.message || "Failed to submit review. You might have already reviewed this property.")
        } finally {
            setReviewLoading(false)
        }
    }

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return

        try {
            setReviewLoading(true)
            const response = await reviewServices.deleteReview(reviewId)
            if (response.success) {
                fetchReviews()
                // Refresh property data for new average
                const propResponse = await propertyServices.getPropertyById(id)
                if (propResponse.success) {
                    setProperty(propResponse.property)
                }
            }
        } catch (error) {
            console.error("Error deleting review:", error)
            alert(error.message || "Failed to delete review")
        } finally {
            setReviewLoading(false)
        }
    }

    const hasReviewed = reviews.some(rev => rev.userId?._id === userProfile?._id)



    // get recommended properties based on current property
    const fetchRecommendedProperties = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/property/recommend/${id}`)            
            console.log("reco properties-->", res.data)  // debug
            
            if (res.data.success) {
                setRecommendedItems(res.data.data)
            }
        } catch (error) {
            console.error("Error fetching recommended properties:", error)
        }
    }

    useEffect(() => {
        if (property?._id) {
            fetchRecommendedProperties()
        }
    }, [property?._id])




    if (loading) {
        return (
            <div className='bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28 h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto'></div>
                    <p className='mt-4 text-gray-500'>Loading property details...</p>
                </div>
            </div>
        )
    }

    if (!property) {
        return (
            <div className='bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28 h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-xl text-gray-500'>Property not found</p>
                </div>
            </div>
        )
    }



    return (
        <>
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
                            <span>{property.location?.municipality}, {property.location?.district}</span>
                        </p>
                        <div className='flex justify-between flex-col sm:flex-row sm:items-end mt-3'>
                            <h3 className="h3">{property.title}</h3>
                            <div className='bold-18'>
                                {currency}{property.price?.value || 'N/A'}/{property.price?.perUnit || 'month'}
                            </div>
                        </div>
                        <div className='flex justify-between items-start my-1'>
                            <h4 className='h4 text-secondary'>{property.category}</h4>
                            <div className='flex items-baseline gap-2 text-secondary relative top-1.5'>
                                <h4 className="bold-18 relative bottom-0.5 text-black">
                                    {property.averageRating > 0 ? property.averageRating.toFixed(1) : '0.0'}
                                </h4>
                                {[...Array(5)].map((_, i) => (
                                    <img 
                                        key={i} 
                                        src={i < Math.round(property.averageRating || 0) ? assets.star : assets.star } 
                                        alt="" 
                                        width={18} 
                                        className={i < Math.round(property.averageRating || 0) ? "" : "opacity-30"}
                                    />
                                ))}
                                <span className='text-gray-500 medium-14'>({property.totalReviews || 0})</span>
                            </div>
                        </div>
                        <div className='flex gap-x-4 mt-3 flex-wrap'>
                            {property.bedrooms && (
                                <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                                    <img src={assets.bed} alt="" width={19} />
                                    {property.bedrooms}
                                </p>
                            )}
                            {property.bathrooms && (
                                <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                                    <img src={assets.bath} alt="" width={19} />
                                    {property.bathrooms}
                                </p>
                            )}
                            {property.parking && (
                                <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                                    <img src={assets.car} alt="" width={19} />
                                    {property.parking}
                                </p>
                            )}
                            {property.builtArea?.value && (
                                <p className='flexCenter gap-x-2 pr-4 font-[500]'>
                                    <img src={assets.ruler} alt="" width={19} />
                                    {property.builtArea.value} {property.builtArea.unit}
                                </p>
                            )}
                        </div>
                        <div className='mt-6'>
                            <h4 className='h4 mt-4 mb-1'>Property Details</h4>
                            <p className='mb-4'>{property.fullDescription}</p>
                        </div>
                        {property.amenities && property.amenities.length > 0 && (
                            <>
                                <h4 className='h4 mt-6 mb-2'>Amenities</h4>
                                <div className="flex gap-3 flex-wrap">
                                    {property.amenities.map((amenity, index) => (
                                        <div key={index} className='p-3 py-1 rounded-lg bg-secondary/10 ring-1 ring-slate-900/10 text-sm'>{amenity}</div>
                                    ))}
                                </div>
                            </>
                        )}
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

                        {/* Reviews Section */}
                        <div className='mt-12'>
                            <h3 className='h3 mb-6'>Reviews ({reviews.length})</h3>
                            
                            {/* Review List */}
                            <div className='space-y-6 mb-10'>
                                {reviews.length > 0 ? (
                                    reviews.map((rev) => (
                                        <div key={rev._id} className='flex gap-4 p-4 rounded-xl bg-white border border-slate-900/5 shadow-sm'>
                                            <img src={rev.userId?.profileImage || assets.user} alt="" className='h-12 w-12 rounded-full object-cover border' />
                                            <div className='flex-1'>
                                                <div className='flexBetween'>
                                                    <h5 className='bold-16'>{rev.userId?.name || 'Anonymous'}</h5>
                                                    <div className='flex gap-1'>
                                                        {[...Array(5)].map((_, i) => (
                                                            <img 
                                                                key={i} 
                                                                src={assets.star} 
                                                                alt="" 
                                                                width={14} 
                                                                className={i < rev.rating ? "" : "opacity-20"}
                                                            />
                                                        ))}
                                                        {userProfile?._id === rev.userId?._id && (
                                                            <FontAwesomeIcon 
                                                                icon={faTrash} 
                                                                className='ml-4 text-red-500 cursor-pointer hover:scale-110 transition-transform' 
                                                                onClick={() => handleDeleteReview(rev._id)}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <p className='text-xs text-gray-400 mb-2'>
                                                    {new Date(rev.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className='text-gray-600 italic'>"{rev.comment}"</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-gray-500 italic'>No reviews yet. Be the first to review!</p>
                                )}
                            </div>

                            {/* Add Review Form */}
                            {isLoggedIn && userProfile?.role === 'tenant' && !hasReviewed && property.owner?._id !== userProfile?._id && (
                                <div className='p-6 rounded-xl bg-secondary/5 border border-secondary/20'>
                                    <h4 className='h4 mb-4'>Write a Review</h4>
                                    <form onSubmit={handleReviewSubmit} className='flex flex-col gap-4'>
                                        <div className='flex items-center gap-4'>
                                            <span className='medium-14'>Rating:</span>
                                            <div className='flex gap-2'>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <img 
                                                        key={num}
                                                        src={assets.star}
                                                        alt=""
                                                        width={24}
                                                        className={`cursor-pointer transition-transform hover:scale-110 ${rating >= num ? "" : "opacity-20"}`}
                                                        onClick={() => setRating(num)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <textarea 
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={3} 
                                            placeholder='Share your experience with this property...' 
                                            className='p-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-secondary outline-none' 
                                            required 
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={reviewLoading}
                                            className="btn-secondary rounded-lg py-2 w-max px-8"
                                        >
                                            {reviewLoading ? "Submitting..." : "Submit Review"}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {isLoggedIn && userProfile?.role === 'tenant' && hasReviewed && (
                                <div className='p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm'>
                                    You have already reviewed this property. Thank you!
                                </div>
                            )}

                            {isLoggedIn && property.owner?._id === userProfile?._id && (
                                <div className='p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm italic'>
                                    You are the owner of this property and cannot leave a review.
                                </div>
                            )}

                            {!isLoggedIn && (
                                <p className='text-sm text-gray-500 text-center py-4 bg-secondary/5 rounded-lg'>
                                    Please <span onClick={() => navigate('/login')} className='text-secondary cursor-pointer underline'>login</span> as a tenant to write a review.
                                </p>
                            )}
                        </div>
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
                                            <h5 className='h5'>{property.agency?.name || property.owner?.name || 'N/A'}</h5>
                                            <p className='bg-green-500/20 px-2 py-0.5 rounded-full text-xs text-green-600 border border-green-500/30'>Owner</p>
                                        </div>
                                        <p className='regular-14 text-gray-500'>
                                            {property.agency ? `${property.agency.address}, ${property.agency.city}` : 'Property Owner'}
                                        </p>
                                    </div>
                                    <img src={property.owner?.profileImage || assets.user} alt="" className='h-10 w-10 rounded-full ' />
                                </div>
                                <div className='flexStart gap-2 p-1.5'>
                                    <div className='bg-green-500/20 p-1 rounded-full border-green-500/30'>
                                        <img src={assets.phone} alt="" width={14} />
                                    </div>
                                    <p className='regular-14'>{property.agency?.contact || property.owner?.phoneNumber || 'N/A'}</p>
                                </div>
                                <div className='flexStart gap-2 p-1.5'>
                                    <div className='bg-green-500/20 p-1 rounded-full border-green-500/30'>
                                        <img src={assets.mail} alt="" width={14} />
                                    </div>
                                    <p className='regular-14'>{property.agency?.email || property.owner?.email || 'N/A'}</p>
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



            {/* recommendated properties based on vector search semantic similarity */}
             <div className="max-padd-container py-16 xl:py-22 mb-">
                <h3 className='h3'>Recommended For You</h3>

                {recommendedItems.length === 0 ? (
                    <p className="text-gray-500 mt-6">No recommendations found</p>
                ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
                    {recommendedItems.map((property) => (
                        <Item key={property._id} property={property} />
                    ))}
                </div>
                )}
            </div>
        </div>
        </>                   
    )
    
}

export default PropertyDetails