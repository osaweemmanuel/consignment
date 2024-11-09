import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
 
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button

} from '@mui/material';
import { useGetAllReceiptsQuery,useDeleteReceiptMutation } from '../../features/receipty/receiptApiSlice';
import { Receipt,Edit,Visibility, DeleteForever } from '@mui/icons-material';

const ReceiptTable = ({ onRefetch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page,setPage]=useState(0);
  const [rowsPerPage,setRowsPerPage]=useState(5);
  const [openDialog,setOpenDialog]=useState(false);
  const [trackingDelete,setTrackingDelete]=useState(null);
  const [openSnackbar,setOpenSnackbar]=useState(false);
  const [snackbarMessage,setSnackbarMessage]=useState("");

  const [deleteReceipt]=useDeleteReceiptMutation();

  const handleClickOpenDialog=(id)=>{
    setTrackingDelete(id);
    setOpenDialog(true);
    
  }

  const handleClose=()=>{
    setTrackingDelete(null);
    setOpenDialog(false);
  }

  const handleConfirmDelete=async()=>{
      try{
          await deleteReceipt(trackingDelete).unwrap();
          setSnackbarMessage("Receipt Successfully deleted");
          setOpenSnackbar(true);
      }catch(error){
        setSnackbarMessage(error.message,'An error occurred while trying to delete receipt');
        setOpenSnackbar(true);
      }
      handleClose();
  }

  const navigate=useNavigate();

  const { data, isLoading, error, refetch } = useGetAllReceiptsQuery({
    refetchOnWindowFocus: true,
    pollingInterval: 5000,
  });

  useEffect(() => {
    if (onRefetch) refetch();
  }, [onRefetch, refetch]);

  if (isLoading) {
    return <Typography>{isLoading}</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }

  const filteredReceipts = data?.results?.filter(receipt => {
    return (
      receipt.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.amount.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.total_payment.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const totalPage=filteredReceipts.lenght;
  const displayedReceipts=filteredReceipts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6" sx={{color:'black',fontSize:'14px',fontWeight:"bold"}}>
          <IconButton sx={{color:'black',fontWeight:"bold"}}>
             <Receipt/> 
          </IconButton>
          Receipt
        </Typography>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
        {displayedReceipts.length > 0 ? (
           <Table>
              <TableHead>
                <TableRow >
                  <TableCell sx={{fontWeight:'bold'}}>Actions</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>referenceID</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Name</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Email</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Payment Method</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Amount</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
            {displayedReceipts.map(receipt => (
              <TableRow key={receipt.id}
                sx={{
                  '&:hover':{
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                   <TableCell>
                  <IconButton onClick={() => navigate(`/admin/review_receipt?id=${receipt.id}`)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleClickOpenDialog(receipt.id)}>
                    <DeleteForever />
                  </IconButton>
                  <IconButton onClick={()=>navigate(`/admin/receipt_update?id=${receipt.id}`)}>
                    <Edit/>
                  </IconButton>
                </TableCell>
                <TableCell>{receipt.referenceId}</TableCell>
                <TableCell>{receipt.fullName}</TableCell>
                <TableCell>{receipt.email}</TableCell>
                <TableCell>{receipt.payment_method}</TableCell>
                <TableCell>{receipt.amount}</TableCell>
                <TableCell>{receipt.total_payment}</TableCell>
               
             
              </TableRow>
            ))}
          </TableBody>
               
          
           </Table>
        ) : (
          <Typography>No record found</Typography>
        )}

           {/* Deletion Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this parcel? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} sx={{backgroundColor:'yellow'}}>Cancel</Button>
          <Button onClick={handleConfirmDelete} sx={{backgroundColor:'red',color:'black'}}>Delete</Button>
        </DialogActions>
      </Dialog>

        <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={()=>setOpenSnackbar(false)}
        />

    </Box>
  );
};

export default ReceiptTable;
