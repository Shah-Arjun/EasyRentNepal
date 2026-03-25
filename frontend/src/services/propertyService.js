import useAxios from '../hooks/useAxios'

// This needs to be called within a component
export const propertyService = (axiosInstance) => {
  return {
    // Get all properties with pagination/filters
    getAllProperties: async (filters = {}) => {
      try {
        const { data } = await axiosInstance.get('/property', { params: filters })
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Get single property by ID
    getPropertyById: async (propertyId) => {
      try {
        const { data } = await axiosInstance.get(`/property/${propertyId}`)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Get owner's properties
    getOwnerProperties: async () => {
      try {
        const { data } = await axiosInstance.get('/property/owner')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Add new property
    addProperty: async (propertyData) => {
      try {
        const { data } = await axiosInstance.post('/property/addProperty', propertyData)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Update property
    updateProperty: async (propertyId, propertyData) => {
      try {
        const { data } = await axiosInstance.patch(`/property/${propertyId}`, propertyData)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Delete property
    deleteProperty: async (propertyId) => {
      try {
        const { data } = await axiosInstance.delete(`/property/${propertyId}`)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Get owner dashboard data
    getOwnerDashboardData: async () => {
      try {
        const { data } = await axiosInstance.get('/property/owner-dashboard')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    }
  }
}


export default propertyService
