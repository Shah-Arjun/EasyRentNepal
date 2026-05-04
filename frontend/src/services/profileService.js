// Profile Service

export const profileService = (axiosInstance) => {
  return {
    // Get my profile
    getProfile: async () => {
      try {
        const { data } = await axiosInstance.get('/profile/me')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Update profile
    updateProfile: async (profileData) => {
      try {
        const { data } = await axiosInstance.patch('/profile/me', profileData)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    
    // Delete account
    deleteAccount: async () => {
      try {
        const { data } = await axiosInstance.delete('/profile/me')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },

    // Toggle role
    toggleRole: async () => {
      try {
        const { data } = await axiosInstance.patch('/profile/toggle-role')
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    },
    
    // Update password
    updatePassword: async (passwordData) => {
      try {
        const { data } = await axiosInstance.patch('/profile/me/password', passwordData)
        return data
      } catch (error) {
        throw error.response?.data || error.message
      }
    }
  }
}

export default profileService
