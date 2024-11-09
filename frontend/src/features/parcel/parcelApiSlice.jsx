
// import { createApi } from '@reduxjs/toolkit/query/react';
// import baseQueryWithReauth from '../baseQueryWithReauth';

// const PARCEL_URL = '/parcels';

// export const parcelApiSlice = createApi({
//   reducerPath: 'parcelApi',
//   baseQuery: baseQueryWithReauth, // Use the enhanced baseQuery
//   tagTypes: ['Parcel'],
//   endpoints: (builder) => ({
//     // Create parcel
//     createParcel: builder.mutation({
//       query: (data) => {
//         const isFormData = data instanceof FormData;
//         return {
//           url: `${PARCEL_URL}/create`,
//           method: 'POST',
//           body: isFormData ? data : JSON.stringify(data),
//         };
//       },
//       invalidatesTags: [{ type: 'Parcel', id: 'LIST' }],
//     }),

//     // Update parcel
//     updateParcel: builder.mutation({
//       query: (parcelData) => ({
//         url: `${PARCEL_URL}/trackingNumber`,  // Replace with correct URL format
//         method: 'PUT',
//         body: parcelData,
//       }),
//       invalidatesTags: ['Parcel' ],
//     }),

//     // Delete parcel
//     deleteParcel: builder.mutation({
//       query: (trackingNumber) => ({
//         url: `${PARCEL_URL}/${trackingNumber}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: [{ type: 'Parcel', id: 'LIST' }],
//     }),

//     // Get all parcels
//     getAllParcels: builder.query({
//       query: () => ({
//         url: PARCEL_URL,
//         method: 'GET',
//       }),
//       providesTags: [{ type: 'Parcel', id: 'LIST' }],
//     }),

//     // Get parcel by tracking number
//     getParcel: builder.query({
//       query: (trackingNumber) => ({
//         url: `${PARCEL_URL}/${trackingNumber}`,
//         method: 'GET',
//       }),
//     }),
//   }),
// });

// // Export hooks for usage in functional components
// export const {
//   useCreateParcelMutation,
//   useUpdateParcelMutation,
//   useDeleteParcelMutation,
//   useGetAllParcelsQuery,
//   useGetParcelQuery,
// } = parcelApiSlice;


import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../baseQueryWithReauth';

const PARCEL_URL = '/parcels';

export const parcelApiSlice = createApi({
  reducerPath: 'parcelApi',
  baseQuery: baseQueryWithReauth, // Use the enhanced baseQuery
  tagTypes: ['Parcel'],
  endpoints: (builder) => ({
    // Create parcel
    createParcel: builder.mutation({
      query: (data) => {
        const isFormData = data instanceof FormData;
        return {
          url: `${PARCEL_URL}/create`,
          method: 'POST',
          body: isFormData ? data : JSON.stringify(data),
        };
      },
      invalidatesTags: [{ type: 'Parcel', id: 'LIST' }],
    }),

    // Update parcel
    updateParcel: builder.mutation({
      query: ({ trackingNumber, data }) => ({
        url: `${PARCEL_URL}/${trackingNumber}`, // Corrected URL to use dynamic trackingNumber
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Parcel', id: 'LIST' }],
 
    }),

    // Delete parcel
    deleteParcel: builder.mutation({
      query: (trackingNumber) => ({
        url: `${PARCEL_URL}/${trackingNumber}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Parcel', id: 'LIST' }],
    }),

    // Get all parcels
    getAllParcels: builder.query({
      query: () => ({
        url: PARCEL_URL,
        method: 'GET',
      }),
      providesTags: [{ type: 'Parcel', id: 'LIST' }],
    }),

    // Get parcel by tracking number
    getParcel: builder.query({
      query: (trackingNumber) => ({
        url: `${PARCEL_URL}/${trackingNumber}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateParcelMutation,
  useUpdateParcelMutation,
  useDeleteParcelMutation,
  useGetAllParcelsQuery,
  useGetParcelQuery,
} = parcelApiSlice;
