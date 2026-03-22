// Reviews Service

export const reviewService = (axiosInstance) => {
  return {
    // Get my reviews
    getMyReviews: async () => {
      try {
        const { data } = await axiosInstance.get('/reviews')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Create review for property
    createReview: async (propertyId, reviewData) => {
      try {
        const { data } = await axiosInstance.post(`/reviews/${propertyId}`, reviewData)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Delete review
    deleteReview: async (propertyId) => {
      try {
        const { data } = await axiosInstance.delete(`/reviews/${propertyId}`)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    }
  }
}

export default reviewService
