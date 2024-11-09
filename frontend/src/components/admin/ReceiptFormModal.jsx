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
import { useCreateReceiptMutation, useGetAllReceiptsQuery } from '../../features/receipty/receiptApiSlice';

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

const paymentOptions = ['Bitcoin Payment', 'Cash Mall', 'Cheque Deposit', 'E-Transfer'];
const currencyTypeOptions = [
  'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BRL',
  'ARS', 'ZAR', 'KRW', 'RUB', 'MXN', 'TRY', 'SAR', 'NGN', 'IDR', 'MYR',
  'EGP', 'KES', 'GHS', 'UGX', 'ETB', 'TZS', 'MAD', 'XOF', 'XAF', 'DZD',
  'ILS', 'IRR', 'IQD', 'AED', 'QAR', 'OMR', 'KWD', 'BHD', 'YER',
  'PKR', 'BDT', 'THB', 'VND', 'PHP', 'SGD', 'LKR', 'NPR', 'HKD', 'MNT',
  'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'ISK', 'RON', 'BGN'
];

const ReceiptFormModal = () => {
  const [open, setOpen] = useState(false);
  const [receiptData, setReceiptData] = useState({
    fullName: "",
    email: "",
    payment_description: "",
    amount: "",
    total_payment: "",
    payment_method: "",
    payment_date: "",
    currency: ""
  });
  const [formError, setFormError] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  const { refetch } = useGetAllReceiptsQuery({
    refetchOnWindowFocus: true,
    pollingInterval: 5000,
  });
  const [createReceipt, { isSuccess, isLoading, isError }] = useCreateReceiptMutation();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      handleClose();
      resetForm();
      setSuccessMessage(true);
    }
    if (isError) {
      setErrorMessage('Failed to create receipt. Please try again.');
    }
  }, [isSuccess, isError, refetch]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setReceiptData({
      fullName: "",
      email: "",
      payment_description: "",
      amount: "",
      total_payment: "",
      payment_method: "",
      payment_date: "",
      currency: ""
    });
    setFormError({});
    setSuccessMessage(false);
    setErrorMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceiptData((prevData) => ({ ...prevData, [name]: value }));
  };

  const formValidation = (data) => {
    const errors = {};
    if (!data.fullName) errors.fullName = 'Full Name is required';
    if (!data.email) errors.email = 'Email is required';
    if (!data.payment_description) errors.payment_description = 'Payment description is required';
    if (!data.amount) errors.amount = 'Amount is required';
    if (!data.total_payment) errors.total_payment = 'Total payment is required';
    if (!data.payment_method) errors.payment_method = 'Payment method is required';
    if (!data.payment_date) errors.payment_date = 'Payment date is required';
    return errors;
  };

  const handleReceiptSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(receiptData);
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    try {
      await createReceipt(receiptData).unwrap();
    } catch (error) {
      setFormError({ apiError: error?.data?.message || 'An error occurred' });
    }
  };

  return (
    <>
      <Button variant="contained" sx={{ backgroundColor: '#263245' }} onClick={handleOpen}>
        Create Receipt
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Create Receipt
          </Typography>
          <form onSubmit={handleReceiptSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={receiptData.fullName}
                  onChange={handleChange}
                  error={!!formError.fullName}
                  helperText={formError.fullName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={receiptData.email}
                  onChange={handleChange}
                  error={!!formError.email}
                  helperText={formError.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Payment Description"
                  name="payment_description"
                  value={receiptData.payment_description}
                  onChange={handleChange}
                  error={!!formError.payment_description}
                  helperText={formError.payment_description}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  name="amount"
                  value={receiptData.amount}
                  onChange={handleChange}
                  error={!!formError.amount}
                  helperText={formError.amount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Payment"
                  name="total_payment"
                  value={receiptData.total_payment}
                  onChange={handleChange}
                  error={!!formError.total_payment}
                  helperText={formError.total_payment}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Payment Method"
                  name="payment_method"
                  value={receiptData.payment_method}
                  onChange={handleChange}
                  error={!!formError.payment_method}
                  helperText={formError.payment_method}
                >
                  {paymentOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  name="currency"
                  value={receiptData.currency}
                  onChange={handleChange}
                >
                  {currencyTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Payment Date"
                  name="payment_date"
                  type="date"
                  value={receiptData.payment_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!formError.payment_date}
                  helperText={formError.payment_date}
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
            message="Receipt created successfully!"
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

export default ReceiptFormModal;
