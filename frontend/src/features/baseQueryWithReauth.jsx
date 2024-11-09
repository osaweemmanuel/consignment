import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from './auth/authSlice';
import { userApiSlice } from './auth/userApiSlice';

// Define your base query function
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // Assuming your auth slice has a token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Define base query with re-authentication logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);



  // Check if the request returned a 401 (Unauthorized)
  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    const refreshResult = await api.dispatch(userApiSlice.endpoints.refreshToken.initiate());



    if (refreshResult.data) {
      api.dispatch(setCredentials({
        token: refreshResult.data.accessToken,
        refreshToken: refreshResult.data.refreshToken,
        userInfo: api.getState().auth.userInfo,
      }));

      // Retry the original request with the new token
    await baseQuery(args, api, extraOptions);
    
    } else {
    
      api.dispatch(logout());
    }
  }

  return result;
};

export default baseQueryWithReauth;
