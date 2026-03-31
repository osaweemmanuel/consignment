

import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../baseQueryWithReauth';

const RECEIPT_URL = '/receipts';

export const receiptApiSlice = createApi({
  reducerPath: 'receiptApi',
  baseQuery: baseQueryWithReauth, // Use the enhanced baseQuery
  tagTypes: ['Receipt'],
  endpoints: (builder) => ({
    createReceipt: builder.mutation({
      query: (data) => {
        const isFormData = data instanceof FormData;

        return {
          url: `${RECEIPT_URL}/create`,
          method: 'POST',
          body: isFormData ? data : JSON.stringify(data), // Ensure the data is properly sent
          credentials: 'include', // 🔹 Fix: Ensure cookies are sent
          headers: {
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          },
        };
      },
      invalidatesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    updateReceipt: builder.mutation({
      query: ({ id, data }) => ({
        url: `${RECEIPT_URL}/${id}`,
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    deleteReceipt: builder.mutation({
      query: (id) => ({
        url: `${RECEIPT_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    getAllReceipts: builder.query({
      query: () => ({
        url: `${RECEIPT_URL}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    getReceipt: builder.query({
      query: (id) => ({
        url: `${RECEIPT_URL}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      invalidatesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateReceiptMutation,
  useUpdateReceiptMutation,
  useDeleteReceiptMutation,
  useGetAllReceiptsQuery,
  useGetReceiptQuery,
} = receiptApiSlice;
