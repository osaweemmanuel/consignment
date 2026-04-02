import React from 'react';
import Icon from '@mdi/react';
import { mdiTruckFast } from '@mdi/js';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MyLogoComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4" component="div" gutterBottom>
        Parcel Delivery
      </Typography>

      {/* Material-UI Button with Icon */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Icon path={mdiTruckFast} size={1} />}
        sx={{ marginBottom: 2 }}
      >
        Track Your Parcel
      </Button>
    </Box>
  );
};

export default MyLogoComponent;

