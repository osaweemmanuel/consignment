import React, { useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useGetReceiptQuery } from "../../features/receipty/receiptApiSlice";
import html2pdf from "html2pdf.js";

const ViewReceipt = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const { data, isLoading, isError } = useGetReceiptQuery(id);
  const receiptRef = useRef();

  const handleDownloadPDF = () => {
    const element = receiptRef.current;

    html2pdf()
      .set({
        filename: "receipt.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: "px",
          format: [595.28, 841.89],  // A4 dimensions in px at 72 DPI
          orientation: "portrait",
        },
        margin: [0, 0, 0, 0]  // No margins for better fitting
      })
      .from(element)
      .save();
  };

  const handlePrint = () => {
    const printWindow = window.open();
    printWindow.document.write(
      `<html><head><title>Print Receipt</title><style>
        @media print {
          body, html {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          .receipt-content {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            box-sizing: border-box;
          }
        }
      </style></head><body>${receiptRef.current.innerHTML}</body></html>`
    );
    printWindow.document.close();
    printWindow.print();
  };

  if (isLoading) return <Typography variant="body1">...Loading</Typography>;
  if (isError) return <Typography variant="body1" sx={{ color: "red" }}>Error loading receipt</Typography>;
  if (!data) return <Typography variant="body1">No record found</Typography>;

  return (
    <Paper elevation={3} sx={{ maxWidth: "595.28px", margin: "auto", padding: 4 }} className="receipt-content">
      <Box ref={receiptRef} style={{ width: "100%", padding: "20px" }}>
        <Box textAlign="center" mb={3}>
          <img src="https://t4.ftcdn.net/jpg/04/37/58/33/360_F_437583308_HglTcJD8fsRAkwjZD8DJHkcHwmXaZ0ag.jpg" style={{ maxWidth: "150px", marginBottom: "16px" }} />
          <Typography variant="h5" fontWeight="bold">Receipt</Typography>
          <Typography variant="subtitle1" color="textSecondary">Reference ID: {data.data.referenceId}</Typography>
          <Typography variant="subtitle1" color="textSecondary">Payment Date: {new Date(data.data.payment_date).toLocaleDateString()}</Typography>
        </Box>
        <Divider />

        <Box mt={3} mb={2}>
          <Typography variant="h6" gutterBottom>Customer Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Name:</strong> {data.data.fullName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1"><strong>Email:</strong> {data.data.email}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>Payment Details</Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="payment details table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell align="right"><strong>Method</strong></TableCell>
                  <TableCell align="right"><strong>Amount</strong></TableCell>
                  <TableCell align="right"><strong>Currency</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{data.data.payment_description}</TableCell>
                  <TableCell align="right">{data.data.payment_method}</TableCell>
                  <TableCell align="right">{Number(data.data.amount).toFixed(2)}</TableCell>
                  <TableCell align="right">{data.data.currency}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider />

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="h6" fontWeight="bold">Total Payment:</Typography>
          <Typography variant="h6" fontWeight="bold">
            {data.data.currency} {data.data.total_payment ? Number(data.data.total_payment).toFixed(2) : "0.00"}
          </Typography>
        </Box>
        <Divider />

        <Box textAlign="center" mt={3}>
          <Typography variant="body2">Thank you for your payment!</Typography>
          <Typography variant="body2">Please save this receipt for your records.</Typography>
        </Box>
      </Box>

      <Box textAlign="center" mt={4}>
        <Button onClick={handlePrint}>Print</Button>
        <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Box>
    </Paper>
  );
};

export default ViewReceipt;
 