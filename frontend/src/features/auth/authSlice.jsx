import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely retrieve userInfo from localStorage
const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo && userInfo !== "undefined") {
    try {
      return JSON.parse(userInfo);
    } catch (error) {
     
      return null; // Return null on parse error
    }
  }
  return null;
};

const initialState = {
  userInfo: getUserInfo(), // Safely get userInfo
  token: localStorage.getItem("token") || "", // Store token separately
  refreshToken: localStorage.getItem("refreshToken") || "", // Store refresh token
};

// Auth slice with `setCredentials` and `logout` actions
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
  

      // Store user info and tokens in localStorage
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
      localStorage.setItem('token', action.payload.token);
     
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = "";
   

      // Clear user info and tokens from localStorage
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
 
    },
  },
});

// Export the actions
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
