import React from 'react';
import { Typography, Paper } from '@mui/material';

const NotFound = () => {
  return (
    <Paper style={{ padding: '16px', textAlign: 'center' }}>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Typography variant="body1">Sorry, the page you are looking for does not exist.</Typography>
    </Paper>
  );
};

export default NotFound;