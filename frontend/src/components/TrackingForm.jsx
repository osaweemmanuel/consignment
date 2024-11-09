// import React,{useState} from 'react';
// import { useNavigate } from 'react-router-dom';
// import {  Typography, Box, TextField,Button,Alert } from '@mui/material';
// import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
// import axios from 'axios';

// const TrackingForm=()=>{
//     const [trackingNumber,setTrackingNumber]=useState("");
//     const [error,setError]=useState("");
//     const [parcelDetail,setParcelDetail]=useState(null);
//     const [errorMessage,setErrorMessage]=useState("");
//     const navigate=useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.get(`http://localhost:3000/api/v1/parcels/${trackingNumber}`, {
//                 withCredentials: true,
//             });

//             console.log('Response Data:', response.data);
            
//             // Ensure parcel details are properly received
//             navigate(`/parcels/${trackingNumber}`, { state: { parcelDetail: response.data } });

//         } catch (err) {
//             console.error('Error:', err.message);
//             setErrorMessage("Tracking Number not found, please try again");
//         }
//     };




//     return(
//         <Box
//         component='form'
//         onSubmit={handleSubmit}
//         sx={{
           
//             display:'flex',
//             flexDirection:'column',
//             margin:'auto',
//             alignItems:'center',
//             fontFamily:'Arial,san-serrif,helvetica,roboto',
//             paddingTop: '60px',
//             paddingTop: { xs: '40px', sm: '40px', md: '60px' }, // Responsive padding for different screens
//             paddingLeft: { xs: '10px', sm: '20px', md: '30px' }, // Add padding for smaller screens
//             paddingRight: { xs: '10px', sm: '20px', md: '30px' },
//         }}
      
//     >
    
//             <Typography variant='h4' sx={{fontWeight:600,fontSize:{xs:'20px',md:'30px'}}} gutterBottom>
//                     Tracking Number
//             </Typography>

//             <Typography variant='body1' sx={{
//                 textAlign:'center',
//                 fontSize:{xs:'14px'},
//                 margin:{xs:'4px'}
//             }}>
//                 Enter Your Electronic Parcel ID (Tracking Number) to track your parcel.
//             </Typography>

//             <TextField 
               
//               value={trackingNumber}
//               onChange={(e)=>setTrackingNumber(e.target.value)}
//                id="demo-helper-text-misaligned"
//                label="Tracking Number"
//                type='text'
//                variant='outlined'
//                sx={{ mt: 3, width:{xs: '70%'} ,mb:{xs:'6px',sm:'4px'},maxWidth: '800px' }}
//                required
               
//             />
//             <Button type='submit' variant='contained' sx={{fontFamily:'Arial,san-serrif,helvetical,roboto'}} color='error'>Tracking Parcel
//                 <KeyboardDoubleArrowRightOutlinedIcon/>
//             </Button>
//             {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
//         </Box>
//     )
// }

// export default TrackingForm;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Alert } from '@mui/material';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import axios from 'axios';

const TrackingForm = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:3000/api/v1/parcels/${trackingNumber}`, {
        withCredentials: true,
      });

      console.log('Response Data:', response.data);
      // Navigate to the detail page for the parcel
      navigate(`/parcels/${trackingNumber}`);
      
    } catch (err) {
      console.error('Error:', err.message);
      setErrorMessage("Tracking Number not found, please try again");
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        paddingTop: { xs: '40px', sm: '40px', md: '60px' }, // Responsive padding for different screens
        paddingLeft: { xs: '10px', sm: '20px', md: '30px' }, // Add padding for smaller screens
        paddingRight: { xs: '10px', sm: '20px', md: '30px' },
      }}
    >
      <Typography variant='h4' sx={{ fontWeight: 600, fontSize: { xs: '20px', md: '30px' } }} gutterBottom>
        Tracking Number
      </Typography>

      <Typography variant='body1' sx={{
        textAlign: 'center',
        fontSize: { xs: '14px' },
        margin: { xs: '4px' }
      }}>
        Enter Your Electronic Parcel ID (Tracking Number) to track your parcel.
      </Typography>

      <TextField
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        id="tracking-number"
        label="Tracking Number"
        type='text'
        variant='outlined'
        sx={{ mt: 3, width: { xs: '70%' }, mb: { xs: '6px', sm: '4px' }, maxWidth: '800px' }}
        required
      />

      <Button type='submit' variant='contained' sx={{ fontFamily: 'Arial, sans-serif' }} color='error'>
        Tracking Parcel
        <KeyboardDoubleArrowRightOutlinedIcon />
      </Button>

      {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
    </Box>
  );
}

export default TrackingForm;
