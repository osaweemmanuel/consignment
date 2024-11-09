import { apiSlice } from "../apiSlice";

const WALLET_URL = '/wallet';

const addAuthHeader = (headers = {}, token) => {
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update wallet
    createWallet: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const headers = addAuthHeader({}, token);

        const isFormData = data instanceof FormData; // Check if data is FormData
        if (!isFormData) {
          headers['Content-Type'] = 'application/json'; // Set content type for JSON
        }

        return {
          url: `${WALLET_URL}/updateWalletId`,
          method: 'POST',
          headers,
          body: isFormData ? data : JSON.stringify(data), // Use data directly if it's FormData
          credentials: 'include', // Include cookies with the request
        };
      },
      invalidatesTags: [{ type: 'Wallet', id: 'LIST' }], // Invalidate relevant cache
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateWalletMutation,
} = walletApiSlice;
