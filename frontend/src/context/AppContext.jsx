/* eslint-disable react-refresh/only-export-components */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import useAxios from '../hooks/useAxios'
import propertyService from '../services/propertyService'
import wishlistService from '../services/wishlistService'
import profileService from '../services/profileService'
import reviewService from '../services/reviewService'
import tenantService from '../services/tenantService'
import { normalizeRole, normalizeRoles, getActiveRole, hasRole } from '../utils/authRole'

const AppContext = createContext()

const buildFullAddress = (location = {}) => {
    return [location.tole, location.city, location.district, location.province]
        .filter(Boolean)
        .join(', ')
}

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const [properties, setProperties] = useState([])
    const [ownerProperties, setOwnerProperties] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [userProfile, setUserProfile] = useState(null)
    const [showAgencyReg, setShowAgencyReg] = useState(false)
    const [agency, setAgency] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const api = useAxios()

    // ─── Memoized services (not recreated on every render) ───────────────────
    const propertyServices = useMemo(() => propertyService(api), [api])
    const wishlistServices = useMemo(() => wishlistService(api), [api])
    const profileServices  = useMemo(() => profileService(api),  [api])
    const reviewServices   = useMemo(() => reviewService(api),   [api])
    const tenantServices   = useMemo(() => tenantService(api),   [api])

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /** Clears all user-specific state (used on logout / failed auth). */
    const clearUserState = useCallback(() => {
        setIsLoggedIn(false)
        setUserProfile(null)
        setIsOwner(false)
        setOwnerProperties([])
        setWishlist([])
        setAgency(null)
        setShowAgencyReg(false)
    }, [])

    // ─── Data fetchers ────────────────────────────────────────────────────────

    const getProperties = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await propertyServices.getAllProperties()
            if (response?.success) {
                setProperties(response.properties ?? [])
            }
        } catch (err) {
            console.error('Error fetching properties:', err)
            setError('Failed to load properties. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }, [propertyServices])




    const getOwnerProperties = useCallback(async () => {
        try {
            const response = await propertyServices.getOwnerProperties()
            if (response?.success) {
                setOwnerProperties(response.properties ?? [])
            }
        } catch (err) {
            console.error('Error fetching owner properties:', err)
        }
    }, [propertyServices])

    /**
     * Fetches the current user's profile.
     * Returns the user object on success, null otherwise.
     * Intentionally does NOT set authLoading — that is the caller's responsibility.
     */



    const getUserProfile = useCallback(async () => {
        try {
            const response = await profileServices.getProfile()
            if (response?.success) {
                const user = response.user
                const currentRole = getActiveRole(user)
                setUserProfile({
                    ...user,
                    role: normalizeRoles(user?.role),
                    currentActiveRole: currentRole,
                    fullAddress: user?.fullAddress || buildFullAddress(user?.location),
                })
                setIsOwner(currentRole === 'owner')
                setIsLoggedIn(true)
                return {
                    ...user,
                    role: normalizeRoles(user?.role),
                    currentActiveRole: currentRole,
                    fullAddress: user?.fullAddress || buildFullAddress(user?.location),
                }
            }
        } catch (err) {
            const status = err?.status ?? err?.response?.status
            if (status !== 401 && status !== 403) {
                console.error('Error fetching profile:', err)
            }
        }
        // Auth failed — wipe state
        clearUserState()
        return null
    }, [profileServices, clearUserState])




    const getWishlist = useCallback(async () => {
        try {
            const response = await wishlistServices.getMyWishlist()
            if (response?.success) {
                setWishlist(response.data ?? [])
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err)
        }
    }, [wishlistServices])




    // ─── Actions ──────────────────────────────────────────────────────────────

    const deleteProperty = useCallback(async (propertyId) => {
        try {
            await propertyServices.deleteProperty(propertyId)
            await getOwnerProperties()
            return true
        } catch (err) {
            console.error('Error deleting property:', err)
            return false
        }
    }, [propertyServices, getOwnerProperties])





    const toggleWishlist = useCallback(async (propertyId) => {
        try {
            const isInWishlist = wishlist.some(item => item._id === propertyId)
            if (isInWishlist) {
                await wishlistServices.removeFromWishlist(propertyId)
            } else {
                await wishlistServices.addToWishlist(propertyId)
            }
            await getWishlist()
        } catch (err) {
            console.error('Error toggling wishlist:', err)
        }
    }, [wishlist, wishlistServices, getWishlist])

    /**
     * Full auth bootstrap: fetches profile then all role-specific data.
     * Awaits every sub-request so authLoading stays true until everything
     * is ready, preventing layout flicker.
     */



    const loadUserData = useCallback(async () => {
        setAuthLoading(true)

        const user = await getUserProfile()

        if (!user) {
            // clearUserState already called inside getUserProfile
            setAuthLoading(false)
            return null
        }

        // Parallel fetch for role-specific data
        const sideLoads = []

        if (getActiveRole(user) === 'tenant' || hasRole(user, 'tenant')) {
            sideLoads.push(getWishlist())
        } else {
            sideLoads.push(getWishlist())
        }

        if (getActiveRole(user) === 'owner' || hasRole(user, 'owner')) {
            sideLoads.push(getOwnerProperties())
            sideLoads.push(
                api.get('/agency/my-agency')
                    .then(res => {
                        if (res.data?.success) {
                            setAgency(res.data.agency)
                            setShowAgencyReg(false)
                        } else {
                            setAgency(null)
                            setShowAgencyReg(true)
                        }
                    })
                    .catch(err => {
                        setAgency(null)
                        if (err.response?.status === 404) {
                            setShowAgencyReg(true)
                        }
                    })
            )
        }

        await Promise.all(sideLoads)

        setAuthLoading(false)
        return user
    }, [getUserProfile, getWishlist, getOwnerProperties, api])






    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout')
        } catch (err) {
            const status = err?.status ?? err?.response?.status
            if (status !== 401 && status !== 403) {
                console.error('Logout request failed:', err)
            }
        }
        clearUserState()
        navigate('/')
    }, [api, clearUserState, navigate])





    const toggleRole = useCallback(async () => {
        if (!userProfile) return

        try {
            setLoading(true)
            const toggleResponse = await profileServices.toggleRole()
            
            if (toggleResponse?.success) {
                const nextUser = toggleResponse.user || await getUserProfile()
                const nextRole = getActiveRole(nextUser)

                setUserProfile(nextUser)
                setIsOwner(nextRole === 'owner')

                if (nextRole === 'owner') {
                    try {
                        const agencyRes = await api.get('/agency/my-agency')
                        if (agencyRes.data?.success) {
                            setAgency(agencyRes.data.agency)
                            setShowAgencyReg(false)
                        } else {
                            setAgency(null)
                            setShowAgencyReg(true)
                        }
                    } catch (agencyErr) {
                        if (agencyErr.response?.status === 404) {
                            setAgency(null)
                            setShowAgencyReg(true)
                        }
                    }
                    navigate('/owner', { replace: true })
                } else {
                    setAgency(null)
                    setShowAgencyReg(false)
                    navigate('/tenant/dashboard', { replace: true })
                }
            } else {
                console.error('Toggle failed:', toggleResponse?.message)
            }
        } catch (err) {
            console.error('Error during role toggle:', err)
        } finally {
            setLoading(false)
        }
    }, [userProfile, profileServices, navigate, api, getUserProfile])




    // ─── Bootstrap ────────────────────────────────────────────────────────────

    useEffect(() => {
        getProperties()
        loadUserData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Run once on mount — stable refs ensure no stale closures

    // ─── Context value ────────────────────────────────────────────────────────

    const value = useMemo(() => ({
        navigate,
        currency,
        // State
        properties,
        ownerProperties,
        wishlist,
        userProfile,
        agency,
        showAgencyReg,
        isOwner,
        isLoggedIn,
        authLoading,
        loading,
        error,
        // State setters exposed to consumers
        setAgency,
        setShowAgencyReg,
        setIsOwner,
        setIsLoggedIn,
        // Actions
        getProperties,
        getOwnerProperties,
        getUserProfile,
        getWishlist,
        deleteProperty,
        toggleWishlist,
        loadUserData,
        logout,
        toggleRole,
        // Raw services (for ad-hoc calls in pages)
        api,
        propertyServices,
        wishlistServices,
        profileServices,
        reviewServices,
        tenantServices,
    }), [
        navigate,
        currency,
        properties,
        ownerProperties,
        wishlist,
        userProfile,
        agency,
        showAgencyReg,
        isOwner,
        isLoggedIn,
        authLoading,
        loading,
        error,
        getProperties,
        getOwnerProperties,
        getUserProfile,
        getWishlist,
        deleteProperty,
        toggleWishlist,
        loadUserData,
        logout,
        toggleRole,
        api,
        propertyServices,
        wishlistServices,
        profileServices,
        reviewServices,
        tenantServices,
    ])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)