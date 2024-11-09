import { createSlice } from "@reduxjs/toolkit";

const getWalletId = () => {
  return localStorage.getItem("walletId") || null; 
};

const initialState = {
  walletId: getWalletId() || '1NVNpzKBponQDsickEX6yByo5XyJmgpyCD', 
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletId: (state, action) => {
      state.walletId = action.payload; 
      localStorage.setItem('walletId', action.payload);
    },
    clearWalletId: (state) => {
      state.walletId = null; 
      localStorage.removeItem('walletId');
    },
  },
});

// Export the actions
export const { setWalletId, clearWalletId } = walletSlice.actions;
export default walletSlice.reducer;
