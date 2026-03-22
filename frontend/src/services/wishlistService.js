// Wishlist Service

export const wishlistService = (axiosInstance) => {
  return {
    // Get my wishlist
    getMyWishlist: async () => {
      try {
        const { data } = await axiosInstance.get('/wishlist')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Add property to wishlist
    addToWishlist: async (propertyId) => {
      try {
        const { data } = await axiosInstance.post(`/wishlist/${propertyId}`)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Remove property from wishlist
    removeFromWishlist: async (propertyId) => {
      try {
        const { data } = await axiosInstance.delete(`/wishlist/${propertyId}`)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    }
  }
}

export default wishlistService
