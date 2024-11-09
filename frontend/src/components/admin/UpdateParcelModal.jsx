
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Grid,
  MenuItem,
  Slider,
} from '@mui/material';
import { useUpdateParcelMutation } from '../../features/parcel/parcelApiSlice';

const UpdateParcelForm = ({ parcelToUpdate, onParcelUpdated }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const trackingNumber = queryParams.get('trackingNumber'); // Get trackingNumber from URL params

  const [parcelData, setParcelData] = useState({
    currentLocation: '',
    destinationLatitude: '',
    destinationLongitude: '',
    progressStatus: 0,
    status: '',
    updatedAt: '',
  });

  const [formError, setFormError] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const [updateParcel] = useUpdateParcelMutation();

  // Populate form fields with existing data when component mounts
  useEffect(() => {
    if (parcelToUpdate) {
      setParcelData(parcelToUpdate);
    }
  }, [parcelToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParcelData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSliderChange = (event, newValue) => {
    setParcelData((prevData) => ({
      ...prevData,
      progressStatus: newValue,
    }));
  };

  const formValidation = (data) => {
    const errors = {};
    if (!data.currentLocation) errors.currentLocation = 'Current location is required';
    if (!data.destinationLatitude) errors.destinationLatitude = 'Destination Latitude is required';
    if (!data.destinationLongitude) errors.destinationLongitude = 'Destination Longitude is required';
    if (!data.status) errors.status = 'Status is required'; 
    return errors;
  };

  const handleParcelSubmit = async (e) => {
    e.preventDefault();

    const errors = formValidation(parcelData);
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    setFormError({});
    setLoading(true);

    try {
    
      const response = await updateParcel({
        trackingNumber,
        data: parcelData,
      }).unwrap();
      
    

      // Trigger callback if provided
      if (onParcelUpdated) onParcelUpdated();

      setSuccessMessage(true); // Show success message
      setParcelData({}); // Reset form data after success
    } catch (error) {
  
      setFormError({ apiError: error?.data?.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '90%', maxWidth: 900, margin: '0 auto', padding: '2rem', bgcolor: 'background.paper', boxShadow: 24 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Update Parcel
      </Typography>
      <Grid item xs={12}>
        <Box sx={{ background: 'lightgray', p: 2 }}>
          <Typography>Tracking Number: {trackingNumber}</Typography>
        </Box>
      </Grid>
      <form onSubmit={handleParcelSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="currentLocation"
              label="Current Location"
              variant="outlined"
              fullWidth
              margin="normal"
              value={parcelData.currentLocation}
              onChange={handleChange}
              error={!!formError.currentLocation}
              helperText={formError.currentLocation}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="destinationLatitude"
              label="Destination Latitude"
              variant="outlined"
              fullWidth
              margin="normal"
              value={parcelData.destinationLatitude}
              onChange={handleChange}
              error={!!formError.destinationLatitude}
              helperText={formError.destinationLatitude}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="destinationLongitude"
              label="Destination Longitude"
              variant="outlined"
              fullWidth
              margin="normal"
              value={parcelData.destinationLongitude}
              onChange={handleChange}
              error={!!formError.destinationLongitude}
              helperText={formError.destinationLongitude}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="status"
              label="Status"
              select
              variant="outlined"
              fullWidth
              margin="normal"
              value={parcelData.status}
              onChange={handleChange}
              error={!!formError.status}
              helperText={formError.status}
              required
            >
              <MenuItem value="impounded">Impounded</MenuItem>
              <MenuItem value="in transit">In transit</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Progress Status: {parcelData.progressStatus}%</Typography>
            <Slider
              value={parcelData.progressStatus}
              onChange={handleSliderChange}
              aria-labelledby="progress-slider"
              min={0}
              max={100}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="updatedAt"
              type="date"
              label=" Date"
              variant="outlined"
              fullWidth
              margin="normal"
              value={parcelData.updatedAt}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Updating...' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(false)}
        message="Parcel updated successfully!"
      />
    </Box>
  );
};

export default UpdateParcelForm;

