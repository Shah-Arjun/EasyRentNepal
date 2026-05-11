export const tenantService = (axiosInstance) => {
  return {
    getDashboard: async () => {
      try {
        const { data } = await axiosInstance.get('/tenant/dashboard')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    getBookings: async () => {
      try {
        const { data } = await axiosInstance.get('/tenant/bookings')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    getPayments: async () => {
      try {
        const { data } = await axiosInstance.get('/tenant/payments')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    }
  }
}

export default tenantService
