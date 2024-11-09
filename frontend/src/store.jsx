// import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "./features/apiSlice";
// import authReducer from './features/auth/authSlice';
// import walletReducer from './features/wallet/walletSlice';

//  const store = configureStore({
//      reducer: {
//          auth:authReducer,
//          wallet:walletReducer,
//          [apiSlice.reducerPath]: apiSlice.reducer,
//     },
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
//      devTools: true,
//  });

//  export default store;

import { configureStore } from '@reduxjs/toolkit';

import { userApiSlice } from './features/auth/userApiSlice';
import { parcelApiSlice } from './features/parcel/parcelApiSlice';
import authReducer from './features/auth/authSlice';
import walletReducer from './features/wallet/walletSlice';
import { walletApiSlice } from './features/wallet/walletApiSlice';
import { receiptApiSlice } from './features/receipty/receiptApiSlice';



const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet:walletReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer, // Add userApiSlice reducer
    [parcelApiSlice.reducerPath]: parcelApiSlice.reducer, // Add parcelApiSlice reducer
    [walletApiSlice.reducerPath]:walletApiSlice.reducer,
    [receiptApiSlice.reducerPath]:receiptApiSlice.reducer
    // Add other reducers as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware, parcelApiSlice.middleware,walletApiSlice.middleware,receiptApiSlice.middleware), // Add the middleware for both slices
});

export default store;
