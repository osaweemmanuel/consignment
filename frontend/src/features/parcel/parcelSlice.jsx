// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   parcels: [],
//   parcelDetail: null,
//   loading: false,
//   error: null,
// };

// const parcelSlice = createSlice({
//   name: 'parcels',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // Create parcel
//     builder
//       .addCase(createParcels.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createParcels.fulfilled, (state, action) => {
//         state.loading = false;
//         state.parcels.push(action.payload);
//         state.error = null; 
//       })
//       .addCase(createParcels.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });

//     // Fetch parcels
//     builder
//       .addCase(fetchParcel.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchParcel.fulfilled, (state, action) => {
//         state.loading = false; 
//         state.parcels = action.payload;
//         state.error = null; 
//       })
//       .addCase(fetchParcel.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default parcelSlice.reducer;
