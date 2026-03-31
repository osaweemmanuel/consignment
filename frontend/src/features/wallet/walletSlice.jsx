// import { createSlice } from "@reduxjs/toolkit";

// const getWalletId = () => {
//   return localStorage.getItem("walletId") || null; 
// };

// const initialState = {
//   walletId: getWalletId() || '1NVNpzKBponQDsickEX6yByo5XyJmgpyCD', 
// };

// const walletSlice = createSlice({
//   name: 'wallet',
//   initialState,
//   reducers: {
//     setWalletId: (state, action) => {
//       state.walletId = action.payload; 
//       localStorage.setItem('walletId', action.payload);
//     },
//     clearWalletId: (state) => {
//       state.walletId = null; 
//       localStorage.removeItem('walletId');
//     },
//   },
// });

// // Export the actions
// export const { setWalletId, clearWalletId } = walletSlice.actions;
// export default walletSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_WALLET_ID = '1NVNpzKBponQDsickEX6yByo5XyJmgpyCD'; // Define a constant for easier updates

const getStoredWalletId = () => {
  try {
    return localStorage.getItem("walletId") || DEFAULT_WALLET_ID;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return DEFAULT_WALLET_ID;
  }
};

const initialState = {
  walletId: getStoredWalletId(),
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletId: (state, action) => {
      state.walletId = action.payload;
      try {
        localStorage.setItem('walletId', action.payload);
      } catch (error) {
        console.error("Error saving walletId to localStorage:", error);
      }
    },
    clearWalletId: (state) => {
      state.walletId = DEFAULT_WALLET_ID; // Reset to default instead of null
      try {
        localStorage.removeItem('walletId');
      } catch (error) {
        console.error("Error clearing walletId from localStorage:", error);
      }
    },
  },
});

// Export the actions
export const { setWalletId, clearWalletId } = walletSlice.actions;
export default walletSlice.reducer;
