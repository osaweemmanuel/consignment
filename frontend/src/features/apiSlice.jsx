import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth, // Use the enhanced base query with token refresh
  tagTypes: ['Users', 'Parcels','Wallet'],
  endpoints: (builder) => ({}),
});
