import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Grid,
  MenuItem,
} from '@mui/material';
import { useCreateParcelMutation, useGetAllParcelsQuery } from '../../features/parcel/parcelApiSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const genderOptions = ['Male', 'Female', 'Other'];
const serviceTypeOptions = ['Air Freight', 'Road Freight', 'Sea Freight'];

const ParcelFormModal = () => {
  const [open, setOpen] = useState(false);

  const [parcelData, setParcelData] = useState({
    senderName: '',
    senderGender: '',
    senderPhone: '',
    senderNationality: '',
    receiverName: '',
    receiverPhone: '',
    receiverGender: '',
    receiverNationality: '',
    receiverEmail: '',
    origin: '',
    weight: '',
    destination: '',
    destinationLatitude: '',
    destinationLongitude: '',
    service_type: '',
    description: '',
    parcelName: '',
    deliveryDate: '',
    image: null,
  });

  const [formError, setFormError] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { refetch } = useGetAllParcelsQuery();
  const [createParcel, { isSuccess, isLoading, isError }] = useCreateParcelMutation();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      handleClose();
      resetForm();
      setSuccessMessage(true);
    }
    if (isError) {
      setErrorMessage('Failed to create parcel. Please try again.');
    }
  }, [isSuccess, isError, refetch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setParcelData({
      senderName: '',
      senderGender: '',
      senderPhone: '',
      senderNationality: '',
      receiverName: '',
      receiverPhone: '',
      receiverGender: '',
      receiverNationality: '',
      receiverEmail: '',
      origin: '',
      weight: '',
      destination: '',
      destinationLatitude: '',
      destinationLongitude: '',
      service_type: '',
      description: '',
      parcelName: '',
      deliveryDate: '',
      image: null,
    });
    setFormError({});
    setSuccessMessage(false);
    setErrorMessage('');
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setParcelData({
      ...parcelData,
      [name]: files ? files[0] : value,
    });
  };

  const formValidation = (data) => {
    const errors = {};
    if (!data.senderName) errors.senderName = 'Sender Name is required';
    if (!data.senderPhone) errors.senderPhone = 'Sender Phone is required';
    if (!data.receiverName) errors.receiverName = 'Receiver Name is required';
    if (!data.receiverPhone) errors.receiverPhone = 'Receiver Phone is required';
    if (!data.origin) errors.origin = 'Origin is required';
    if (!data.destination) errors.destination = 'Destination is required';
    if (!data.weight) errors.weight = 'Weight is required';
    if (!data.service_type) errors.service_type = 'Service Type is required';
    if (!data.image) errors.image = 'Image is required';
    return errors;
  };

  const handleParcelSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(parcelData);
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    const formData = new FormData();

    for (const key in parcelData) {
      formData.append(key, parcelData[key]);
    }

    try {
      await createParcel(formData).unwrap();
    } catch (error) {
      setFormError({ apiError: error?.data?.message || 'An error occurred' });
    }
  };

  return (
    <>
      <Button variant="contained" sx={{ backgroundColor: '#263245' }} onClick={handleOpen}>
        Create Parcel
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Create Parcel
          </Typography>
          <form onSubmit={handleParcelSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sender Name"
                  name="senderName"
                  value={parcelData.senderName}
                  onChange={handleChange}
                  error={!!formError.senderName}
                  helperText={formError.senderName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Sender Gender"
                  name="senderGender"
                  value={parcelData.senderGender}
                  onChange={handleChange}
                  error={!!formError.senderGender}
                  helperText={formError.senderGender}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sender Phone"
                  name="senderPhone"
                  value={parcelData.senderPhone}
                  onChange={handleChange}
                  error={!!formError.senderPhone}
                  helperText={formError.senderPhone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sender Nationality"
                  name="senderNationality"
                  value={parcelData.senderNationality}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Receiver Name"
                  name="receiverName"
                  value={parcelData.receiverName}
                  onChange={handleChange}
                  error={!!formError.receiverName}
                  helperText={formError.receiverName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Receiver Phone"
                  name="receiverPhone"
                  value={parcelData.receiverPhone}
                  onChange={handleChange}
                  error={!!formError.receiverPhone}
                  helperText={formError.receiverPhone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Receiver Email"
                  name="receiverEmail"
                  value={parcelData.receiverEmail}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Origin"
                  name="origin"
                  value={parcelData.origin}
                  onChange={handleChange}
                  error={!!formError.origin}
                  helperText={formError.origin}
                />
                
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Destination"
                  name="destination"
                  value={parcelData.destination}
                  onChange={handleChange}
                  error={!!formError.destination}
                  helperText={formError.destination}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parcel Weight (kg)"
                  name="weight"
                  value={parcelData.weight}
                  onChange={handleChange}
                  error={!!formError.weight}
                  helperText={formError.weight}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                fullWidth
                  label="Destination Longitude"
                  name="destinationLongitude"
                  value={parcelData.destinationLongitude}
                  onChange={handleChange}
                  error={!!formError.destinationLongitude}
                  helperText={formError.destinationLongitude}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                fullWidth
                  label="Destination Latitude"
                  name="destinationLatitude"
                  value={parcelData.destinationLatitude}
                  onChange={handleChange}
                  error={!!formError.destinationLatitude}
                  helperText={formError.destinationLatitude}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                fullWidth
                label="Parcel Name"
                name="parcelName"
                value={parcelData.parcelName}
                onChange={handleChange}
                error={!!formError.parcelName}
                helperText={formError.parcelName}
                
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Service Type"
                  name="service_type"
                  value={parcelData.service_type}
                  onChange={handleChange}
                  error={!!formError.service_type}
                  helperText={formError.service_type}
                >
                  {serviceTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={parcelData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="image"
                  type="file"
                  onChange={handleChange}
                  error={!!formError.image}
                  helperText={formError.image}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                 fullWidth
                 label="Delivery Date"
                 name="deliveryDate"
                 type="date" 
                 value={parcelData.deliveryDate} 
                 onChange={handleChange}
                 InputLabelProps={{
                   shrink: true, 
                 }}
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ marginTop: 2 }} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Submit'}
            </Button>
          </form>
          <Snackbar
            open={successMessage}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage(false)}
            message="Parcel created successfully!"
          />
          <Snackbar
            open={!!errorMessage}
            autoHideDuration={6000}
            onClose={() => setErrorMessage('')}
            message={errorMessage}
          />
        </Box>
      </Modal>
    </>
  );
};

export default ParcelFormModal;
