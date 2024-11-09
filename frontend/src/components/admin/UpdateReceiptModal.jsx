import { Paper, Typography, TextField, Button, Box, Snackbar } from "@mui/material";
import { useUpdateReceiptMutation, useGetAllReceiptsQuery } from "../../features/receipty/receiptApiSlice";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const UpdateReceiptModal = ({ReceiptToUpdate,onReceiptUPdated}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");


  
  const [receiptData, setReceiptData] = useState({
    total_payment:  "",
    date_payment:  ""
  });

  const [updateReceipt, { isLoading: updateLoading, isError: updateError }] = useUpdateReceiptMutation();
  const [successMessage,setSuccessMessage]=useState(false);
  const [formError,setFormError]=useState({});

  useEffect(()=>{
    if(ReceiptToUpdate){
      setReceiptData(ReceiptToUpdate)
    }
  },[ReceiptToUpdate])
 

  if (updateLoading ) {
    return <Typography variant="body1">...Loading</Typography>;
  }

  if (updateError ) {
    return <Typography variant="body1" sx={{ color: "red" }}>Error loading receipt</Typography>;
  }

 

  const resetReceiptData=()=>{
    setReceiptData({
      total_payment:"",
      date_payment:""
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceiptData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError({})
    try {
      await updateReceipt({ id,data:receiptData }).unwrap();
      if(onReceiptUPdated) onReceiptUPdated();
    
       setSuccessMessage(true)
      resetReceiptData();
    } catch (error) {
      setFormError({ apiError: error?.data?.message || 'An error occurred' });
    }

    
  };

  return (
    <Paper sx={{ padding: 6, maxWidth: 500, margin: "auto" }}>
      <Typography variant="h6" gutterBottom>Update Receipt</Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Total Payment"
          name="total_payment"
          value={receiptData.total_payment}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Date of Payment"
          name="date_payment"
          value={receiptData.date_payment}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          sx={{ mt: 2 }}
          disabled={updateLoading}
        >
          Update Receipt
        </Button>
      </Box>
      {updateError && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Error updating receipt. Please try again.
        </Typography>
      )}

      <Snackbar
        open={successMessage}
        autoHideDuration={6000}
        onClose={()=>setSuccessMessage(false)}
        message="Receipt Updated Successfully"
      />
    </Paper>
  );
};

export default UpdateReceiptModal;
