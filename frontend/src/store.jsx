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

import { apiSlice } from './features/apiSlice';
import { parcelApiSlice } from './features/parcel/parcelApiSlice';
import { receiptApiSlice } from './features/receipty/receiptApiSlice';
import authReducer from './features/auth/authSlice';
import walletReducer from './features/wallet/walletSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [parcelApiSlice.reducerPath]: parcelApiSlice.reducer,
    [receiptApiSlice.reducerPath]: receiptApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware, 
      parcelApiSlice.middleware,
      receiptApiSlice.middleware
    ),
});

export default store;
