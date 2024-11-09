// // import {useState,useEffect} from 'react';
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableRow,
// //   TableContainer,
// //   Typography,
// //   Paper,
// //   TextField,
// //   IconButton,
// //   TablePagination,  Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogContentText,
// //   DialogActions,Button
// // } from "@mui/material";
// // import { useGetAllParcelsQuery, useDeleteParcelMutation } from "../../features/parcel/parcelApiSlice";
// // import { DeleteForever, Visibility,Edit} from '@mui/icons-material';
// // import { useNavigate } from 'react-router-dom';


// // const ParcelTable = ({ onRefetch }) => {

  
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [open, setOpen] = useState(false);
// //   const [trackingToDelete, setTrackingToDelete] = useState(null);
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);

// //   const [deleteParcel] = useDeleteParcelMutation();
// //   const navigate=useNavigate();

// //   const handleClickOpen = (trackingNumber) => {
// //     setTrackingToDelete(trackingNumber);
// //     setOpen(true);
// //   };

// //   const handleClose = () => {
// //     setOpen(false);
// //   };

// //   const handleConfirmDelete = async () => {
// //     if (trackingToDelete) {
// //       try {
// //         await deleteParcel(trackingToDelete).unwrap(); // Call the delete function
// //         console.log('Parcel deleted successfully');
// //         refetch(); // Refetch after deletion
// //       } catch (error) {
// //         console.log("Error occurred while trying to delete", error);
// //       }
// //     }
// //     handleClose();
// //   };

// //   // Fetching parcel
// //   const { data, isLoading, error, refetch } = useGetAllParcelsQuery({
// //     refetchOnWindowFocus: true,
// //     pollingInterval: 5000,
// //   });

// //   useEffect(() => {
// //     refetch();
// //   }, [onRefetch, refetch]);

// //   if (isLoading) {
// //     return <Typography variant="body1">Loading parcels...</Typography>;
// //   }

// //   if (error) {
// //     return <Typography variant="body1" sx={{ color: 'red' }}>Error occurred while fetching data: {error.message}</Typography>;
// //   }


// // //   // Function to format date for display
// //   const formatDate = (stringDate) => {
// //     const options = { year: 'numeric', month: 'long', day: 'numeric' };
// //     return new Date(stringDate).toLocaleDateString(undefined, options);
// //   };

// //   // Filtering parcels
// //   const filteredParcels = data?.results?.filter(parcel => {
// //     const deliveryDateStr = new Date(parcel.deliveryDate).toISOString().split('T')[0]; // Format deliveryDate to 'YYYY-MM-DD'
// //     const formattedDeliveryDate = formatDate(parcel.deliveryDate); // Get a readable date format for comparison

// //     return (
// //       parcel.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       parcel.id.toString().includes(searchTerm) ||
// //       parcel.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       deliveryDateStr.includes(searchTerm) || // Compare formatted delivery date
// //       formattedDeliveryDate.toLowerCase().includes(searchTerm.toLowerCase()) // Compare readable date format
// //     );
// //   }) || []; // Fallback to an empty array

// //   // Pagination logic
// //   const totalPages = Math.ceil(filteredParcels.length / rowsPerPage);
// //   const displayedParcels = filteredParcels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

// //   return (
// //     <TableContainer component={Paper}>
// //       <h2>Parcel List</h2>
// //       <TextField
// //         label="Search"
// //         variant="outlined"
// //         value={searchTerm}
// //         onChange={(e) => setSearchTerm(e.target.value)}
// //         style={{ marginBottom: '16px' }}
// //       />

// //       {displayedParcels.length > 0 ? (
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Parcel Name</TableCell>
// //               <TableCell>Receiver Name</TableCell>
// //               <TableCell>Receiver Email</TableCell>
// //               <TableCell>Status</TableCell>
// //               <TableCell>Location</TableCell>
// //               <TableCell>Delivery Date</TableCell>
// //               <TableCell>Action</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {displayedParcels.map(parcel => (
// //               <TableRow key={parcel.id}>
// //                 <TableCell>{parcel.parcelName}</TableCell>
// //                 <TableCell>{parcel.receiverName}</TableCell>
// //                 <TableCell>{parcel.receiverEmail}</TableCell>
// //                 <TableCell>
// //                   {parcel.trackingNumber}
// //                   <Typography variant="body1" sx={{color:'skyblue'}}>({parcel.status})</Typography>
// //                   </TableCell>
// //                 <TableCell>{parcel.destination}</TableCell>
// //                 <TableCell>{formatDate(parcel.deliveryDate)}</TableCell>
// //                 <TableCell>
// //                 <IconButton onClick={() => navigate(`/admin/parcel_view?trackingNumber=${parcel.trackingNumber}`)}>
// //                     <Visibility />
// //                   </IconButton>
// //                   <IconButton onClick={() => handleClickOpen(parcel.trackingNumber)}>
// //                     <DeleteForever />
// //                   </IconButton>
// //                   <IconButton onClick={()=>navigate(`/admin/parcel_update?trackingNumber=${parcel.trackingNumber}`)} color="primary">
// //                      <Edit />
// //                  </IconButton>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       ) : (
// //         <Typography variant="body1">No records found.</Typography>
// //       )}

// //       {/* Pagination */}
// //       <TablePagination
// //         rowsPerPageOptions={[5, 10, 25]}
// //         component="div"
// //         count={filteredParcels.length}
// //         rowsPerPage={rowsPerPage}
// //         page={page}
// //         onPageChange={(event, newPage) => setPage(newPage)}
// //         onRowsPerPageChange={(event) => {
// //           setRowsPerPage(parseInt(event.target.value, 10));
// //           setPage(0); // Reset to first page when changing rows per page
// //         }}
// //       />

// //       {/* Confirmation Modal */}
// //       <Dialog open={open} onClose={handleClose}>
// //         <DialogTitle>Confirm Delete</DialogTitle>
// //         <DialogContent>
// //           <DialogContentText>Are you sure you want to delete this parcel? This action cannot be undone.</DialogContentText>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleClose} color="primary">Cancel</Button>
// //           <Button onClick={handleConfirmDelete} color="primary">Delete</Button> {/* Ensure this calls the function */}
// //         </DialogActions>
// //       </Dialog>
// //     </TableContainer>
// //   );
// // };

// // export default ParcelTable;
// import React, { useEffect, useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TableContainer,
//   Typography,
//   Paper,
//   TextField,
//   IconButton,
//   TablePagination,
//   Snackbar,
// } from "@mui/material";
// import { useGetAllParcelsQuery, useDeleteParcelMutation } from "../../features/parcel/parcelApiSlice";
// import { DeleteForever, Visibility } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

// const ParcelTable = ({ onRefetch }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const navigate = useNavigate();

//   const [deleteParcel] = useDeleteParcelMutation();

//   const handleDelete = async (trackingNumber) => {
//     if (window.confirm("Are you sure you want to delete this parcel?")) {
//       try {
//         await deleteParcel(trackingNumber).unwrap();
//         setSnackbarMessage("Parcel deleted successfully!");
//         setOpenSnackbar(true);
//       } catch (error) {
//         console.log("Error occurred while trying to delete", error);
//         setSnackbarMessage("Failed to delete parcel.");
//         setOpenSnackbar(true);
//       }
//     }
//   };

//   const { data, isLoading, error, refetch } = useGetAllParcelsQuery({
//     refetchOnWindowFocus: true,
//     pollingInterval: 5000,
//   });

//   useEffect(() => {
//     refetch();
//   }, [onRefetch, refetch]);

//   if (isLoading) {
//     return <Typography variant="h6">Loading parcels...</Typography>;
//   }

//   if (error) {
//     return (
//       <Typography variant="body1" sx={{ color: 'red' }}>
//         Error occurred while fetching data: {error.message}
//       </Typography>
//     );
//   }

//   const formatDate = (stringDate) => {
//     if (!stringDate) return ""; // Handle null/undefined date
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(stringDate).toLocaleDateString(undefined, options);
//   };

//   const filteredParcels = data?.results?.filter(parcel => {
//     const deliveryDateStr = new Date(parcel.deliveryDate).toISOString().split('T')[0];
//     const formattedDeliveryDate = formatDate(parcel.deliveryDate);

//     return (
//       parcel.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       parcel.id.toString().includes(searchTerm) ||
//       parcel.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       deliveryDateStr.includes(searchTerm) ||
//       formattedDeliveryDate.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }) || [];

//   const totalPages = Math.ceil(filteredParcels.length / rowsPerPage);
//   const displayedParcels = filteredParcels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <TableContainer component={Paper}>
//       <h2>Parcel Listing</h2>
//       <TextField
//         label="Search"
//         variant="outlined"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         style={{ marginBottom: '16px' }}
//       />
//       {displayedParcels.length > 0 ? (
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Parcel ID</TableCell>
//               <TableCell>Receiver Name</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Location</TableCell>
//               <TableCell>Delivery Date</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {displayedParcels.map(parcel => (
//               <TableRow key={parcel.id}>
//                 <TableCell>{parcel.id}</TableCell>
//                 <TableCell>{parcel.receiverName}</TableCell>
//                 <TableCell>
//                   ({parcel.trackingNumber}) <br />
//                   <Typography variant="body1" color="skyblue">{parcel.status}</Typography>
//                 </TableCell>
//                 <TableCell>{parcel.destination}</TableCell>
//                 <TableCell>{formatDate(parcel.deliveryDate)}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => navigate(`/admin/parcel_view?trackingNumber=${parcel.trackingNumber}`)}>
//                     <Visibility />
//                   </IconButton>
//                   <IconButton onClick={() => handleDelete(parcel.trackingNumber)}>
//                     <DeleteForever />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       ) : (
//         <Typography variant="body1">No records found.</Typography>
//       )}

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={filteredParcels.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={(event, newPage) => setPage(newPage)}
//         onRowsPerPageChange={(event) => {
//           setRowsPerPage(parseInt(event.target.value, 10));
//           setPage(0);
//         }}
//       />

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={() => setOpenSnackbar(false)}
//         message={snackbarMessage}
//       />
//     </TableContainer>
//   );
// };

// export default ParcelTable;




import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  Paper,
  TextField,
  IconButton,
  TablePagination,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useGetAllParcelsQuery, useDeleteParcelMutation } from "../../features/parcel/parcelApiSlice";
import { DeleteForever, Edit, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ParcelTable = ({ onRefetch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [trackingToDelete, setTrackingToDelete] = useState(null);
  const navigate = useNavigate();

  const [deleteParcel] = useDeleteParcelMutation();

  // Open the dialog to confirm deletion
  const handleClickOpenDialog = (trackingNumber) => {
    setTrackingToDelete(trackingNumber); // Set the parcel tracking number to delete
    setOpenDialog(true); // Open the confirmation dialog
  };

  // Close the dialog without deleting
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTrackingToDelete(null); // Reset the tracking number
  };

  // Confirm delete and proceed
  const handleConfirmDelete = async () => {
    try {
      await deleteParcel(trackingToDelete).unwrap();
      setSnackbarMessage("Parcel deleted successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to delete parcel.");
      setOpenSnackbar(true);
    }
    handleCloseDialog(); // Close dialog after confirming deletion
  };

  const { data, isLoading, error, refetch } = useGetAllParcelsQuery({
    refetchOnWindowFocus: true,
    pollingInterval: 5000,
  });

  useEffect(() => {
    refetch();
  }, [onRefetch, refetch]);

  if (isLoading) {
    return <Typography variant="h6">Loading parcels...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body1" sx={{ color: 'red' }}>
        Error occurred while fetching data: {error.message}
      </Typography>
    );
  }

  const formatDate = (stringDate) => {
    if (!stringDate) return ""; // Handle null/undefined date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(stringDate).toLocaleDateString(undefined, options);
  };

  const filteredParcels = data?.results?.filter(parcel => {
    const deliveryDateStr = new Date(parcel.deliveryDate).toISOString().split('T')[0];
    const formattedDeliveryDate = formatDate(parcel.deliveryDate);

    return (
      parcel.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.id.toString().includes(searchTerm) ||
      parcel.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryDateStr.includes(searchTerm) ||
      formattedDeliveryDate.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const totalPages = Math.ceil(filteredParcels.length / rowsPerPage);
  const displayedParcels = filteredParcels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <h2>Parcel Listing</h2>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      {displayedParcels.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parcel ID</TableCell>
              <TableCell>Receiver Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedParcels.map(parcel => (
              <TableRow key={parcel.id}
                sx={{
                  '&:hover':{
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                <TableCell>{parcel.id}</TableCell>
                <TableCell>{parcel.receiverName}</TableCell>
                <TableCell>
                  ({parcel.trackingNumber}) <br />
                  <Typography variant="body1" color="skyblue">{parcel.status}</Typography>
                </TableCell>
                <TableCell>{parcel.destination}</TableCell>
                <TableCell>{formatDate(parcel.deliveryDate)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/admin/parcel_view?trackingNumber=${parcel.trackingNumber}`)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleClickOpenDialog(parcel.trackingNumber)}>
                    <DeleteForever />
                  </IconButton>
                  <IconButton onClick={()=>navigate(`/admin/parcel_update?trackingNumber=${parcel.trackingNumber}`)}>
                    <Edit/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body1">No records found.</Typography>
      )}

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredParcels.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      {/* Deletion Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this parcel? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{backgroundColor:'yellow'}}>Cancel</Button>
          <Button onClick={handleConfirmDelete} sx={{backgroundColor:'red',color:'black'}}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </TableContainer>
  );
};

export default ParcelTable;
