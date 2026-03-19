import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import useAxios from '../hooks/useAxios'
import propertyService from '../services/propertyService'
import wishlistService from '../services/wishlistService'
import profileService from '../services/profileService'

const Appcontext = createContext()

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();
    const { user: clerkUser } = useUser();
    
    const [properties, setProperties] = useState([]);
    const [ownerProperties, setOwnerProperties] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [showAgencyReg, setShowAgencyReg] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const api = useAxios();
    
    // Property services
    const propertyServices = propertyService(api);
    const wishlistServices = wishlistService(api);
    const profileServices = profileService(api);

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
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }

    // Fetch owner's properties
    const getOwnerProperties = async () => {
        try {
            if (!clerkUser) return;
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
            if (!clerkUser) return;
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
            if (!clerkUser) return;
            const response = await wishlistServices.getMyWishlist();
            if (response.success) {
                setWishlist(response.wishlist || []);
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
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

    // Load user-specific data when authenticated
    useEffect(() => {
        if (clerkUser) {
            setIsLoggedIn(true);
            getUserProfile();
            getWishlist();
            getOwnerProperties();
        } else {
            setIsLoggedIn(false);
            setUserProfile(null);
            setIsOwner(false);
        }
    }, [clerkUser])

    const value = {
        navigate,
        properties,
        ownerProperties,
        wishlist,
        userProfile,
        currency,
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
        propertyServices,
        wishlistServices,
        profileServices
    };

    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}

export const useAppContext = () => useContext(Appcontext)