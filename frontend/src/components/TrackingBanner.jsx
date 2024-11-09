

import { Typography, Box } from "@mui/material";

const TrackingBanner = () => {
  return (
    <Box
      sx={{
        backgroundImage: 'url(https://bluebelltrackingcompany.com/images/commons/pages-bg.jpg)', // Background image URL
        backgroundSize: 'cover', // Ensure the image covers the entire box
        backgroundPosition: 'center', // Center the image within the container
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
        width: '100vw', // Set width to 100% of the viewport width
        height: '400px', // Height of the banner
        display: 'flex',
        justifyContent: 'center', // Center the text horizontally
        alignItems: 'center', // Center the text vertically
        color: '#fff', // White text for visibility
        margin: 0, // Remove any margins
        padding: 0, // Remove any padding
        position: 'relative', // Ensure the banner stays within its parent container
        left: 0, // Align the banner to the left
        right: 0, // Align the banner to the right
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
        Tracking
      </Typography>
    </Box>
  );
};

export default TrackingBanner;



