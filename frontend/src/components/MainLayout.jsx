import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Footer from '../components/page/Footer.jsx';
import Navbar from '../components/Navbar.jsx';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ padding: '20px' }}>
        
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};

export default MainLayout;
