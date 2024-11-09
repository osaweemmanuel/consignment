


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, CircularProgress, Alert, Card, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import MapComponent from '../MapComponent'; // Import MapComponent
import TrackingBanner from '../TrackingBanner';
import AdjustableProgressBar from '../adjustableProgressBar';


const ParcelDetail = () => {
  const { trackingNumber } = useParams();
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchParcelData = async () => {
      try {
        if (!trackingNumber) {
          setError('Tracking number is missing.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/v1/parcels/${trackingNumber}`);
  
     
        if (response.data && response.data.result) {
          setParcelData(response.data.result);
        } else {
          setError('No data found.');
        }
        setLoading(false);
      } catch (err) {
        console.error('API request error:', err);
        setError('Error fetching parcel details. Please try again.');
        setLoading(false);
      }
    };

    fetchParcelData();
  }, [trackingNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!parcelData) {
    return <Typography variant="body1">No parcel data found.</Typography>;
  }

  const formatDate=(dateString)=>{
    const options={year:'numeric',month:'long',day:'numeric'};
    return new Date(dateString).toLocaleDateString(undefined,options);
  };
 

  return (
    <Box>
      <TrackingBanner />
      <Typography variant="h4" sx={{ mt: 8, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: { xs: '20px' } }} gutterBottom>
        PARCEL {trackingNumber}
      </Typography>
      
      <AdjustableProgressBar progressStatus={parcelData.progressStatus}/>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb:4}}>
      {parcelData && (
        <MapComponent 
          parcelLatitude={parcelData.destinationLatitude} 
          parcelLongitude={parcelData.destinationLongitude} 
          parcelDestination={parcelData.currentLocation}
        />
      )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4}}>
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardMedia
            component="img"
            height="400"
            image={parcelData.imageUrl}
            alt="Parcel"
          />
        </Card>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TableContainer component={Paper} sx={{ maxWidth: 1000, width: '100%', mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Shipping Details</strong></TableCell>
                <TableCell><strong></strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Parcel Description</TableCell>
                <TableCell>{parcelData.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Weight</TableCell>
                <TableCell>{parcelData.weight}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Parcel Origin</TableCell>
                <TableCell>{parcelData.origin}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Parcel Destination</TableCell>
                <TableCell>{parcelData.destination}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created Date</TableCell>
                <TableCell>{formatDate(parcelData.createdAt)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TableContainer component={Paper} sx={{ maxWidth: 1000, width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Sender Details</strong></TableCell>
                <TableCell><strong></strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Sender Name</TableCell>
                <TableCell>{parcelData.senderName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sender Gender</TableCell>
                <TableCell>{parcelData.senderGender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sender Address</TableCell>
                <TableCell>{parcelData.senderNationality}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TableContainer component={Paper} sx={{ maxWidth: 1000, width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Receiver Details</strong></TableCell>
                <TableCell><strong></strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Receiver Name</TableCell>
                <TableCell>{parcelData.receiverName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Receiver Gender</TableCell>
                <TableCell>{parcelData.receiverGender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Receiver Nationality</TableCell>
                <TableCell>{parcelData.receiverNationality}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Receiver Email</TableCell>
                <TableCell>{parcelData.receiverEmail}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Receiver Phone</TableCell>
                <TableCell>{parcelData.receiverPhone}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print Parcel Details
        </Button>
      </Box>
    </Box>
  );
};

export default ParcelDetail;

