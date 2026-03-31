import { apiSlice } from "../apiSlice";

const USER_URL = "/auth";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
 
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Fix: Include credentials
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Fix: Include credentials
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
      }),
    }),

    changePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: `${USER_URL}/change-password`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: 'include', // Fix: Include credentials
      }),
    }),
    
  }),
});

// Export hooks for usage in functional components
export const { 
  useRefreshTokenMutation, 
  useLoginMutation, 
  useLogoutMutation, 
  useRegisterMutation, 
  useChangePasswordMutation 
} = userApiSlice;
