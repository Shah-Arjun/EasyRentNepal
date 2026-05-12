// Profile Service

export const profileService = (axiosInstance) => {
  return {
    // Get my profile
    getProfile: async () => {
      try {
        const { data } = await axiosInstance.get('/profile/me')
        return data
      } catch (error) {
        const payload = error.response?.data || { message: error.message }
        const normalizedError = new Error(payload.message || error.message)
        normalizedError.status = error.response?.status
        normalizedError.data = payload
        throw normalizedError
      }
    },

    // Update profile
    updateProfile: async (profileData) => {
      try {
        const { data } = await axiosInstance.patch('/profile/me', profileData)
        return data
      } catch (error) {
        const payload = error.response?.data || { message: error.message }
        const normalizedError = new Error(payload.message || error.message)
        normalizedError.status = error.response?.status
        normalizedError.data = payload
        throw normalizedError
      }
    },

    
    // Delete account
    deleteAccount: async () => {
      try {
        const { data } = await axiosInstance.delete('/profile/me')
        return data
      } catch (error) {
        const payload = error.response?.data || { message: error.message }
        const normalizedError = new Error(payload.message || error.message)
        normalizedError.status = error.response?.status
        normalizedError.data = payload
        throw normalizedError
      }
    },

    // Toggle role
    toggleRole: async () => {
      try {
        const { data } = await axiosInstance.patch('/profile/toggle-role')
        return data
      } catch (error) {
        const payload = error.response?.data || { message: error.message }
        const normalizedError = new Error(payload.message || error.message)
        normalizedError.status = error.response?.status
        normalizedError.data = payload
        throw normalizedError
      }
    },
    
    // Update password
    updatePassword: async (passwordData) => {
      try {
        const { data } = await axiosInstance.patch('/profile/me/password', passwordData)
        return data
      } catch (error) {
        const payload = error.response?.data || { message: error.message }
        const normalizedError = new Error(payload.message || error.message)
        normalizedError.status = error.response?.status
        normalizedError.data = payload
        throw normalizedError
      }
    }
  }
}

export default profileService
