import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxios from '../hooks/useAxios'
import propertyService from '../services/propertyService'
import wishlistService from '../services/wishlistService'
import profileService from '../services/profileService'
import reviewService from '../services/reviewService'
import { dummyProperties } from '../assets/data'

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();
    const { user: clerkUser, isLoaded } = useUser();
    
    const [properties, setProperties] = useState([]);
    const [ownerProperties, setOwnerProperties] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [showAgencyReg, setShowAgencyReg] = useState(false)
    const [agency, setAgency] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const api = useAxios();
    
    // Property services
    const propertyServices = propertyService(api);
    const wishlistServices = wishlistService(api);
    const profileServices = profileService(api);
    const reviewServices = reviewService(api);

    // Fetch all properties for listing
    const getProperties = async () => {
        try {
            setLoading(true);
            const response = await propertyServices.getAllProperties();
            if (response.success) {
                setProperties(response.properties || []);
            }
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError('Failed to load properties. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }

    // Fetch owner's properties
    const getOwnerProperties = async () => {
        try {
            if (!localStorage.getItem('token')) return;
            setLoading(true);
            const response = await propertyServices.getOwnerProperties();
            if (response.success) {
                setOwnerProperties(response.properties || []);
            }
        } catch (err) {
            console.error('Error fetching owner properties:', err);
        } finally {
            setLoading(false);
        }
    }

    // Get user profile
    const getUserProfile = async () => {
        try {
            if (!localStorage.getItem('token')) return;
            const response = await profileServices.getProfile();
            if (response.success) {
                setUserProfile(response.user);
                setIsOwner(response.user?.role === 'owner');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    }

    // Get wishlist
    const getWishlist = async () => {
        try {
            if (!localStorage.getItem('token')) return;
            const response = await wishlistServices.getMyWishlist();
            if (response.success) {
                setWishlist(response.wishlist || []);
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            // Don't set global error for wishlist, just log it
        }
    }

    // Delete property
    const deleteProperty = async (propertyId) => {
        try {
            await propertyServices.deleteProperty(propertyId);
            // Refresh owner properties
            getOwnerProperties();
            return true;
        } catch (err) {
            console.error('Error deleting property:', err);
            return false;
        }
    }

    // Toggle wishlist
    const toggleWishlist = async (propertyId) => {
        try {
            const isInWishlist = wishlist.some(item => item._id === propertyId);
            if (isInWishlist) {
                await wishlistServices.removeFromWishlist(propertyId);
            } else {
                await wishlistServices.addToWishlist(propertyId);
            }
            getWishlist();
        } catch (err) {
            console.error('Error toggling wishlist:', err);
        }
    }

    // Initial load
    useEffect(() => {
        getProperties();
    }, [])

    const loadUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
    // Load user-specific data when authenticated
    useEffect(() => {
        if (isLoaded && clerkUser) {
            setIsLoggedIn(true);
            await getUserProfile();
            getWishlist();
            getOwnerProperties();
            
            // Check if user has an agency if they are an owner
            const profileRes = await profileServices.getProfile();
            if (profileRes.success && profileRes.user.role === 'owner') {
                try {
                    const agencyRes = await api.get('/agency/my-agency');
                    if (agencyRes.data.success) {
                        setAgency(agencyRes.data.agency);
                    } else {
                        setAgency(null);
                        setShowAgencyReg(true);
                    }
                } catch (err) {
                    setAgency(null);
                    if (err.response?.status === 404) {
                        setShowAgencyReg(true);
                    }
                }
            }
        } else {
        } else if(isLoaded && !clerkUser) {
            setIsLoggedIn(false);
            setUserProfile(null);
            setIsOwner(false);
            setOwnerProperties([]);
            setWishlist([]);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserProfile(null);
        setIsOwner(false);
        setOwnerProperties([]);
        setWishlist([]);
        navigate('/');
    };

    // Load user-specific data when authenticated
    useEffect(() => {
        loadUserData();
    }, []);

    const toggleRole = async () => {
        if (!userProfile) return;
        const newRole = isOwner ? 'tenant' : 'owner';
        try {
            setLoading(true);
            const response = await profileServices.updateProfile({ role: newRole });
            if (response.success) {
                setUserProfile(response.user);
                setIsOwner(response.user?.role === 'owner');
                
                if (newRole === 'owner') {
                    // Check if they already have an agency
                    try {
                        const agencyRes = await api.get('/agency/my-agency');
                        if (agencyRes.data.success) {
                            setAgency(agencyRes.data.agency);
                        } else {
                            setAgency(null);
                            setShowAgencyReg(true);
                        }
                    } catch (err) {
                        setAgency(null);
                        if (err.response?.status === 404) {
                            setShowAgencyReg(true);
                        }
                    }
                }
                // Redirect to homepage after successful role switch
                navigate('/');
            }
        } catch (err) {
            console.error('Error updating role:', err);
        } finally {
            setLoading(false);
        }
    };
    }, [clerkUser, isLoaded])

    const value = {
        navigate,
        properties,
        ownerProperties,
        wishlist,
        userProfile,
        currency,
        agency,
        setAgency,
        showAgencyReg,
        setShowAgencyReg,
        isOwner,
        setIsOwner,
        isLoggedIn,
        setIsLoggedIn,
        loading,
        error,
        // Services
        getProperties,
        getOwnerProperties,
        getUserProfile,
        getWishlist,
        deleteProperty,
        toggleWishlist,
        // API Services
        api,
        propertyServices,
        wishlistServices,
        profileServices,
        reviewServices,
        loadUserData,
        logout,
        toggleRole
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)