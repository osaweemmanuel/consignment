import { apiSlice } from "../apiSlice";
import { useSelector } from "react-redux";

const USER_URL = "/auth";

export const userApiSlice = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    refreshToken:builder.mutation({
      query:()=>({
        url:`${USER_URL}/refresh-token`,
        method:'POST',
        credentials:'include'
      }),
    }),


    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Ensure data is stringified
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Ensure data is stringified
      }),
    }),
    logout: builder.mutation({
      query: (_, { getState }) => ({
        url: `${USER_URL}/logout`,
        method: 'POST',
        credentials: 'include', // Send the cookie
        // headers: {
        //   'CSRF-Token': csrfToken, // Uncomment if CSRF token is needed
        // },
      }),
    }),

    changePassword:builder.mutation({
        query:({oldPassword,newPassword,token})=>({
            url:`${USER_URL}/change-password`,
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({oldPassword,newPassword}),
            credentials:'include',
           
        }),
    }), 

  }),
});

// Export hooks for usage in functional components
export const {   useRefreshTokenMutation,useLoginMutation, useLogoutMutation, useRegisterMutation,useChangePasswordMutation } = userApiSlice;