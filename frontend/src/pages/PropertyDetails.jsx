import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom';
import PropertyImages from '../components/PropertyImages';
import { assets } from '../assets/data';
import axios from 'axios';
import Item from '../components/Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';




const PropertyDetails = () => {
    const { properties, currency, propertyServices, reviewServices, userProfile, isLoggedIn, bookingServices, paymentServices } = useAppContext();
    const [property, setProperty] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [recommendedItems, setRecommendedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Booking form state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [proofImage, setProofImage] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const fetchReviews = async () => {
        try {
            const data = await reviewServices.getPropertyReviews(id);
            if (data.success) setReviews(data.reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    useEffect(() => {
        const getPropertyDetails = async () => {
            try {
                setLoading(true);
                let foundProperty = properties.find((p) => p._id === id);
                if (!foundProperty) {
                    const response = await propertyServices.getPropertyById(id);
                    if (response.success) foundProperty = response.property;
                }
                setProperty(foundProperty || null);
            } catch (error) {
                console.error('Error fetching property details:', error);
                setProperty(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getPropertyDetails();
            fetchReviews();
        }
    }, [id, properties, propertyServices]);




    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error("Please login to submit a review");
            return;
        }
        if (userProfile?.role !== 'tenant') {
            toast.error("Only tenants can submit reviews");
            return;
        }

        try {
            setReviewLoading(true);
            const response = await reviewServices.createReview(id, { rating, comment });
            if (response.success) {
                setComment("");
                setRating(5);
                fetchReviews();
                const propResponse = await propertyServices.getPropertyById(id);
                if (propResponse.success) setProperty(propResponse.property);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.message || "Failed to submit review.");
        } finally {
            setReviewLoading(false);
        }
    };



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
            toast.error(error.message || "Failed to delete review")
        } finally {
            setReviewLoading(false)
        }
    }




    const hasReviewed = reviews.some(rev => rev.userId?._id === userProfile?._id);




    // Recommended properties
    const fetchRecommendedProperties = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/property/recommend/${id}`);
            if (res.data.success) {
                setRecommendedItems(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching recommended properties:", error);
        }
    };




    useEffect(() => {
        if (property?._id) fetchRecommendedProperties();
    }, [property?._id]);

    // Handle Book Now
    const handleBookNow = () => {
        if (!isLoggedIn) {
            // After login, user will come back to this page (you can use state or query param if needed)
            navigate('/login');
            return;
        }
        if (userProfile?.role !== 'tenant') {
            toast.error("Only tenants can book properties");
            return;
        }
        setShowBookingModal(true);
    };




    // Handle proof image upload
    const handleProofUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProofImage(file);
            const reader = new FileReader();
            reader.onload = () => setProofPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };




    // Submit Booking + Payment (manual proof)
    const handlePaymentSubmit = async () => {
        if (!startDate || !endDate) {
            alert("Please select start and end dates");
            return;
        }
        if (!proofImage) {
            alert("Please upload payment proof");
            return;
        }

        try {
            setSubmitting(true);

            // 1. Create Booking
            const bookingData = {
                property: id,
                startDate,
                endDate,
                totalAmount: property.price?.value || 0,
            };

            const bookingRes = await bookingServices.createBooking(bookingData);

            if (!bookingRes.success) throw new Error("Failed to create booking");

            // 2. Create Payment with proof
            const formData = new FormData();
            formData.append('tenantId', userProfile._id);
            formData.append('ownerId', property.owner?._id);
            formData.append('amount', property.price?.value || 0);
            formData.append('method', 'Khalti'); // or let user choose
            formData.append('status', 'pending');
            formData.append('proofImage', proofImage);
            // Optionally link to booking: formData.append('bookingId', bookingRes.booking._id);

            const paymentRes = await paymentServices.createPayment(formData);

            if (paymentRes.success) {
                alert("Booking and payment proof submitted successfully! Await owner confirmation.");
                setShowBookingModal(false);
                navigate('/tenant-dashboard');
            }
        } catch (error) {
            console.error("Booking/Payment error:", error);
            alert(error.message || "Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };



    const today = new Date().toISOString().split("T")[0];

    if (loading) {
        return (
            <div className='bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28 h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto'></div>
                    <p className='mt-4 text-gray-500'>Loading property details...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className='bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28 h-screen flex items-center justify-center'>
                <p className='text-xl text-gray-500'>Property not found</p>
            </div>
        );
    }




    return (
        <>
            <div className='bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28'>
                <div className='max-padd-container'>
                    <PropertyImages property={property} />

                    <div className='flex flex-col xl:flex-row gap-8 mt-8'>
                        {/* Left - Main Content */}
                        <div className='flex-1 space-y-10'>
                            {/* Basic Info */}
                            <div className='p-6 rounded-2xl border border-slate-900/10 bg-white'>
                                <p className='flex items-center gap-x-2 text-gray-600'>
                                    <img src={assets.pin} alt="" width={19} />
                                    {property.location?.municipality}, {property.location?.district}, {property.location?.province}
                                </p>

                                <div className='flex flex-col sm:flex-row sm:items-end justify-between mt-4'>
                                    <h3 className="h3">{property.title}</h3>
                                    <div className='text-2xl font-bold text-secondary mt-2 sm:mt-0'>
                                        {currency}{property.price?.value?.toLocaleString() || 'N/A'}
                                        <span className='text-base font-normal text-gray-500'>/{property.price?.perUnit || '/month'}</span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4 mt-3'>
                                    <span className='px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium'>
                                        {property.category} • {property.listingType}
                                    </span>
                                    <div className='flex items-center gap-1 text-amber-500'>
                                        {property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}
                                        <img src={assets.star} alt="" width={18} />
                                        <span className='text-gray-500 text-sm'>({property.totalReviews || 0})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Property Specifications */}
                            <div className='p-6 rounded-2xl border border-slate-900/10 bg-white'>
                                <h3 className='h3 mb-6'>Property Specifications</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12'>
                                    {property.bedrooms >=0 && (
                                        <div className='flex items-center gap-1'>
                                            <img src={assets.bed} alt="" width={24} />
                                            <p className='font-semibold ml-2'>Bedrooms:</p>
                                            <p className='text-gray-600'>{property.bedrooms}</p>
                                        </div>
                                    )}
                                    {property.bedCount >= 0 && (
                                        <div className='flex items-center gap-1'>
                                            <p className='font-semibold ml-2'>Number of Beds:</p>
                                            <p className='text-gray-600'>{property.bedCount}</p>
                                        </div>
                                    )}
                                    {property.bathrooms >= 0 && (
                                        <div className='flex items-center gap-1'>
                                            <img src={assets.bath} alt="" width={24} />
                                            <p className='font-semibold ml-2'>Bathrooms:</p>
                                            <p className='text-gray-600'>{property.bathrooms} ({property.bathroomType || 'shared'})</p>
                                        </div>
                                    )}
                                    {property.living >= 0 && (          
                                        <div className='flex items-center gap-1'>
                                            <p className='font-semibold ml-2'>Living Rooms:</p>
                                            <p className='text-gray-600'>{property.living}</p>
                                        </div>
                                    )}
                                    {property.noOfFlat >= 0 && (
                                        <div className='flex items-center gap-1'>
                                            <p className='font-semibold ml-2'>Number of Flats:</p>
                                            <p className='text-gray-600'>{property.noOfFlat}</p>
                                        </div>
                                    )}
                                    {property.kitchen >= 0 && (
                                        <div className='flex items-center gap-1'>
                                            <p className='font-semibold ml-2'>Kitchens:</p>
                                            <p className='text-gray-600'>{property.kitchen}</p>
                                        </div>
                                    )}
                                    {property.parking && (
                                        <div className='flex items-center gap-1'>
                                            <img src={assets.car} alt="" width={24} />
                                            <p className='font-semibold ml-2'>Parking:</p>
                                            <p className='text-gray-600'>{property.parking}</p>
                                        </div>
                                    )}
                                    {property.builtArea?.value >= 0 && (
                                        <div className='flex items-center gap-1'>
                                            <img src={assets.building} alt="" width={24} />
                                            <p className='font-semibold ml-2'>Built Area:</p>
                                            <p className='text-gray-600'>{property.builtArea.value} {property.builtArea.unit}</p>
                                        </div>
                                    )}
                                    {property.landArea?.value >= 0 && (
                                        <div className='flex items-center gap-1'>
                                            <img src={assets.ruler} alt="" width={24} />
                                            <p className='font-semibold ml-2'>Land Area:</p>
                                            <p className='text-gray-600'>{property.landArea.value} {property.landArea.unit}</p>
                                        </div>
                                    )}
                                    {property.furnishedStatus && (
                                        <div className='flex items-center gap-1'>
                                            <p className='font-semibold ml-2'>Furnished Status:</p>
                                            <p className='text-gray-600 capitalize'>{property.furnishedStatus.replace('-', ' ')}</p>
                                        </div>
                                    )}
                                    {property.facing && (
                                        <div className='flex items-center gap-1'>
                                            <img src={assets.compass} alt="" width={24} />
                                            <p className='font-semibold ml-2'>Facing:</p>
                                            <p className='text-gray-600'>{property.facing}</p>
                                        </div>
                                    )}
                                    {property.builtYear >= 0 && (
                                        <div className='flex items-center gap-1'>
                                            <p className='font-semibold ml-2'>Built Year:</p>
                                            <p className='text-gray-600'>{property.builtYear} BS</p>
                                        </div>
                                    )}
                                    {property.roadSize?.value >= 0 && (
                                        <div className='flex items-center gap-1'>
                                            <p className='font-semibold ml-2'>Road Size:</p>
                                            <p className='text-gray-600'>{property.roadSize.value} {property.roadSize.unit} <span> (roadtype)</span></p>
                                        </div>
                                    )}

                                </div>

                                {property.amenities?.length > 0 && (
                                    <div className='mt-10'>
                                        <h4 className='h4 mb-3'>Amenities</h4>
                                        <div className='flex flex-wrap gap-3'>
                                            {property.amenities.map((amenity, i) => (
                                                <div key={i} className='px-4 py-2 bg-secondary/10 rounded-xl text-sm border border-slate-900/10'>
                                                    {amenity}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className='mt-10'>
                                    <h4 className='h4 mb-3'>Full Description</h4>
                                    <p className='text-gray-700 leading-relaxed'>{property.fullDescription}</p>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className='p-6 rounded-2xl border border-slate-900/10 bg-white'>
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
                                {/* reviews list and form */}
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




                        {/* Right Sidebar */}
                        <div className='flex-1 max-w-sm xl:sticky xl:top-8 self-start'>
                            <div className='p-6 rounded-2xl border border-slate-900/10 bg-white'>
                                <button
                                    onClick={handleBookNow}
                                    className='w-full py-4 bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 text-lg transition-all active:scale-[0.98]'
                                >
                                    <span>Book Now</span>
                                </button>

                                {/* Contact Owner (existing) */}
                                <h4 className="h4 mb3 mt-5">Contact Owner</h4>
                                <form className='flex flex-col gap-4'>
                                    <input type="text" placeholder='Your Name' className='p-2 py-1 border border-gray-300 rounded-md text-sm' required />
                                    <input type="email" placeholder='Your Email' className='p-2 py-1 border border-gray-300 rounded-md text-sm' required />
                                    <textarea rows={4} placeholder='Your Message' className='p-2 py-1 border border-gray-300 rounded-md text-sm' required />
                                    <button type="submit" className="btn-secondary rounded-lg py-1.5">Send Message</button>
                                </form>

                                <h4 className="h4 mt-8 mb-4">For Renting Contact</h4>
                                <div className='text-sm divide-y divide-gray-500/30 border border-gray-500/30 rounded'>
                                    {/* Your existing contact info block */}
                                    <div className='flex item-start justify-between p-3'>
                                        <div>
                                            <div className='flex items-center space-x-2'>
                                                <h5 className='h5'>{property.agency?.name || property.owner?.name || 'N/A'}</h5>
                                                <p className='bg-green-500/20 px-2 py-0.5 rounded-full text-xs text-green-600 border border-green-500/30'>Owner</p>
                                            </div>
                                            <p className='regular-14 text-gray-500'>
                                                {property.agency ? `${property.agency.address}, ${property.agency.city}` : 'Property Owner'}
                                            </p>
                                        </div>
                                        <img src={property.owner?.profileImage || assets.user} alt="" className='h-10 w-10 rounded-full' />
                                    </div>
                                    {/* Phone & Email blocks  */}
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

                {/* Recommended Properties */}
                <div className="max-padd-container py-20">
                    <h3 className='h3 mb-8'>Recommended For You</h3>
                    {recommendedItems.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {recommendedItems.map((prop) => (
                                <Item key={prop._id} property={prop} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No recommendations available at the moment.</p>
                    )}
                </div>
            </div>

            {/* Booking & Payment Modal */}
            {showBookingModal && (
                <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-auto'>
                        <div className='p-8'>
                            <div className='flex justify-between items-center mb-6'>
                                <h3 className='h3'>Book This Property</h3>
                                <button onClick={() => setShowBookingModal(false)} className='text-3xl text-gray-400 hover:text-gray-600'>&times;</button>
                            </div>

                            <div className='space-y-6'>
                                <div>
                                    <label className='block text-sm font-medium mb-1.5'>Move-in Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        min={today}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className='w-full p-3 border rounded-2xl focus:ring-2 focus:ring-secondary outline-none'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium mb-1.5'>Move-out / End Date (if applicable)</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className='w-full p-3 border rounded-2xl focus:ring-2 focus:ring-secondary outline-none'
                                    />
                                </div>

                                <div>
                                    <p className='font-medium mb-2'>Payment Details (Khalti)</p>
                                    <div className='bg-amber-50 border border-amber-200 p-5 rounded-2xl text-center'>
                                        <p className='text-sm text-gray-600 mb-3'>Scan & Pay using Khalti</p>
                                        {/* Replace with your actual Khalti QR image or merchant ID */}
                                        <div className='mx-auto w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-400 mb-3'>
                                            <p className='text-xs text-gray-500 text-center'>Khalti QR Code<br />(Merchant QR Here)</p>
                                        </div>
                                        <p className='font-mono text-sm'>Khalti ID: <span className='font-semibold'>9807307132</span></p>
                                        <p className='text-xs text-gray-500 mt-1'>Amount: {currency}{property.price?.value?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium mb-2'>Upload Payment Proof</label>
                                    <div className='border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center'>
                                        {proofPreview ? (
                                            <img src={proofPreview} alt="preview" className='mx-auto max-h-52 rounded-xl' />
                                        ) : (
                                            <div>
                                                <p className='text-gray-500 text-sm'>Drag & drop or click to upload screenshot/receipt</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProofUpload}
                                            className='mt-3 text-sm'
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePaymentSubmit}
                                disabled={submitting}
                                className='mt-8 w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-2xl transition-all'
                            >
                                {submitting ? "Submitting..." : "I Have Paid - Submit Proof"}
                            </button>

                            <p className='text-center text-xs text-gray-500 mt-4'>
                                Your booking will be confirmed after owner reviews the payment proof.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PropertyDetails;