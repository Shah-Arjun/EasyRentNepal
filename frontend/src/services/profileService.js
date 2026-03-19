// Profile Service

export const profileService = (axiosInstance) => {
  return {
    // Get my profile
    getProfile: async () => {
      try {
        const { data } = await axiosInstance.get('/profile')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Update profile
    updateProfile: async (profileData) => {
      try {
        const { data } = await axiosInstance.patch('/profile', profileData)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Delete account
    deleteAccount: async () => {
      try {
        const { data } = await axiosInstance.delete('/profile')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    }
  }
}

export default profileService
