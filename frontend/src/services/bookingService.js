export const bookingService = (axiosInstance) => {
  return {
    // Tenant: create booking with payment proof image (FormData)
    createBooking: async (formData) => {
      try {
        const { data } = await axiosInstance.post('/bookings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Tenant: get my bookings
    getMyBookings: async () => {
      try {
        const { data } = await axiosInstance.get('/bookings/my-bookings');
        return data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Owner: get all booking requests for owner's properties
    getOwnerBookings: async () => {
      try {
        const { data } = await axiosInstance.get('/bookings/owner');
        return data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Owner: approve or reject a booking
    updateBookingStatus: async (bookingId, action, reason = '') => {
      try {
        const { data } = await axiosInstance.patch(`/bookings/${bookingId}/status`, { action, reason });
        return data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  };
};

export default bookingService;
