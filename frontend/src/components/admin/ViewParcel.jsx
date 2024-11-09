

import React from 'react';
import { useLocation } from 'react-router-dom'; // Removed useParams
import { useGetParcelQuery } from '../../features/parcel/parcelApiSlice';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material';
import MapComponent from '../MapComponent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AdjustableProgressBar from '../adjustableProgressBar';
import { setOptions } from 'leaflet';

const ViewParcel = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const trackingNumber = queryParams.get('trackingNumber'); // Keep this line

  // Fetch parcel data
  const { data, error, isLoading } = useGetParcelQuery(trackingNumber); // Fetch the parcel data
  
  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error handling
  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        Error: {error.message}
      </Alert>
    );
  }

  // Check if data exists
  if (!data.result) {
    return <Typography variant="body1" sx={{ margin: 2 }}>No parcel found.</Typography>;
  }

 ;


//dateFormat
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: '2-digit' }; // Corrected 'number' to '2-digit'
  return new Date(dateString).toLocaleDateString(undefined, options);
};


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" textAlign={'center'} gutterBottom>Parcel Details</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ ml: 14 }}>
          <IconButton><LocalShippingIcon /></IconButton>{data.result.trackingNumber}
        </Typography>
        <AdjustableProgressBar progressStatus={data.result.progressStatus} />
        <MapComponent 
          parcelLatitude={data.result.destinationLatitude} 
          parcelLongitude={data.result.destinationLongitude} 
          parcelDestination={data.result.currentLocation}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Tracking Number</Typography>
              <Typography variant="body1" color="textSecondary">{data.result.trackingNumber}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Receiver Name</Typography>
              <Typography variant="body1" color="textSecondary">{data.result.receiverName}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Status</Typography>
              <Typography variant="body1" color="textSecondary">{data.result.status}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Current Location</Typography>
              <Typography variant="body1" color="textSecondary">{data.result.destination}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Delivery Date</Typography>
              <Typography variant="body1" color="textSecondary">{formatDate(data.result.deliveryDate)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewParcel;

