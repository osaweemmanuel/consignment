import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../baseQueryWithReauth';

const RECEIPT_URL = '/receipts';

export const receiptApiSlice = createApi({
  reducerPath: 'receiptApi',
  baseQuery: baseQueryWithReauth, // Use the enhanced baseQuery
  tagTypes: ['Receipt'],
  endpoints: (builder) => ({
    // Create receipt
    createReceipt: builder.mutation({
      query: (receiptData) => {
        const isFormData = receiptData instanceof FormData;
        return {
          url: `${RECEIPT_URL}/create`,
          method: 'POST',
          body: isFormData ? receiptData : JSON.stringify(receiptData),
          headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        };
      },
      invalidatesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    // Update receipt
    updateReceipt: builder.mutation({
      query: ({ id, data }) => ({
        url: `${RECEIPT_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    // Delete receipt
    deleteReceipt: builder.mutation({
      query: (id) => ({
        url: `${RECEIPT_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    // Get all receipts
    getAllReceipts: builder.query({
      query: () => ({
        url: RECEIPT_URL,
        method: 'GET',
      }),
      providesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    // Get receipt by ID
    getReceipt: builder.query({
      query: (id) => ({
        url: `${RECEIPT_URL}/${id}`,
        method: 'GET',
      }),
       //providesTags: (result, error, id) => [{ type: 'Receipt', id }],
       invalidatesTags: [{ type: 'Receipt', id: 'LIST' }],
    }),

    
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateReceiptMutation,
  useUpdateReceiptMutation,
  useDeleteReceiptMutation,
  useGetAllReceiptsQuery,
  useGetReceiptQuery,
} = receiptApiSlice;
