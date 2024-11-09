// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Typography, Box } from '@mui/material';
// import { useCreateWalletMutation } from '../../features/wallet/walletApiSlice';

// const Wallet = () => {
//   // Get the wallet ID from local storage or set to default if not available
//   const [walletId, setWalletId] = useState(localStorage.getItem('walletId') || '1NVNpzKBponQDsickEX6yByo5XyJmgpyCD');
//   const [walletUpdate] = useCreateWalletMutation(); // Access the mutation hook
//   const [qrCodeUrl, setQrCodeUrl] = useState('');

//   // Update the QR code URL whenever the walletId changes
//   useEffect(() => {
//     if (walletId) {
//       const encodedWalletId = encodeURIComponent(walletId);
//       setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodedWalletId}&size=200x200`);
//     } else {
//       setQrCodeUrl('');
//     }
//   }, [walletId]);

//   const handleWalletIdChange = (e) => {
//     setWalletId(e.target.value);
//   };

//   const handleUpdateWalletId = async () => {
//     try {
      
//       const response = await walletUpdate({ walletId }).unwrap();
//       // Update the walletId state with the new value and also store it in localStorage
//       const newWalletId = response.newWalletId || walletId; 
//       setWalletId(newWalletId);
//       localStorage.setItem('walletId', newWalletId); // Store the new wallet ID in local storage

//       console.log("Wallet ID updated successfully to:", newWalletId);
//     } catch (error) {
//       console.error("Error updating wallet ID:", error);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
//       <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
//         {walletId}
//       </Typography>
//       <img 
//         src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=bitcoin:${walletId}`} 
//         style={{ width: '300px', height: '300px', marginTop: '20px' }} 
//         alt="QR Code"
//       />
//       <TextField
//         label="Wallet ID"
//         variant="outlined"
//         value={walletId} // Use state value to reflect changes
//         onChange={handleWalletIdChange} // Update state on change
//         fullWidth
//         sx={{ marginBottom: '16px', marginTop: '20px' }}
//       />
//       <Button variant="contained" onClick={handleUpdateWalletId}>
//         Update Wallet ID
//       </Button>
//     </Box>
//   );
// };

// export default Wallet;
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useCreateWalletMutation } from "../../features/wallet/walletApiSlice";
import { setWalletId } from "../../features/wallet/walletSlice";
import { useSelector, useDispatch } from "react-redux";

const Wallet = () => {
  const [walletUpdate] = useCreateWalletMutation();
  const dispatch = useDispatch();
  const walletId = useSelector((state) => state.wallet.walletId); // Directly using walletId from Redux state

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const encodedWalletId = encodeURIComponent(walletId);
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=${encodedWalletId}&size=300x300`);
  }, [walletId]);

  const handleWalletIdChange = (e) => {
    dispatch(setWalletId(e.target.value)); // Directly update Redux state
  };

  const handleUpdateWalletId = async () => {
    try {
      const response = await walletUpdate({ walletId }).unwrap();
    
      setSnackbarMessage("Wallet ID successfully updated");
      setSnackbarOpen(true);
    } catch (error) {
     
      const errorMessage = error.data?.message || "Error updating wallet ID.";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: '14px' }}>
        Current Wallet ID: {walletId}
      </Typography>
      <img 
        src={qrCodeUrl} 
        style={{ width: '300px', height: '300px', marginTop: '20px' }} 
        alt="QR Code"
      />
      <TextField
        label="Wallet ID"
        variant="outlined"
        value={walletId}
        onChange={handleWalletIdChange}
        fullWidth
        sx={{ marginBottom: '16px', marginTop: '20px' }}
      />
      <Button variant="contained" onClick={handleUpdateWalletId}>
        Update Wallet ID
      </Button>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarMessage.includes("Error") ? "error" : "success"} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Wallet;
