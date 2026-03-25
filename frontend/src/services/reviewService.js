// This needs to be called within a component
export const reviewService = (axiosInstance) => {
  return {
    // Get all reviews for a specific property
    getPropertyReviews: async (propertyId) => {
      try {
        const { data } = await axiosInstance.get(`/reviews/property/${propertyId}`)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Create a new review for a property
    createReview: async (propertyId, reviewData) => {
      try {
        const { data } = await axiosInstance.post(`/reviews/${propertyId}`, reviewData)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Get reviews written by the current user
    getMyReviews: async () => {
      try {
        const { data } = await axiosInstance.get('/reviews')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Delete a review
    deleteReview: async (reviewId) => {
      try {
        const { data } = await axiosInstance.delete(`/reviews/${reviewId}`)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    }
  }
}

export default reviewService
