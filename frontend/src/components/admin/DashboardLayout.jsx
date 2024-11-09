


import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LockIcon from '@mui/icons-material/Lock';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice'; // Adjust the import path
import { useLogoutMutation } from '../../features/auth/userApiSlice';
import DashFooter from './DashFooter';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const drawerWidth = 240;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Logout API error: ", err);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const drawerContent = (
    <div style={{ backgroundColor: '#263245', height: '100%' }}>
      
      <Toolbar>
      <IconButton sx={{color:'orange'}}>
          <LocalShippingIcon/>
      </IconButton>
        <Box display="flex" justifyContent="center" alignItems="center" color="white" width="100%">
          <Typography variant="h6">Admin Panel</Typography>
        </Box>
      </Toolbar>
      <Divider orientation="horizontal" variant="middle" sx={{backgroundColor:'white'}}/>
      <List sx={{color:'white'}}> 
        <ListItem button component={NavLink} to="/admin/dashboard" activeClassName="active-link">
          <ListItemIcon><HomeIcon sx={{color:'white'}} /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={NavLink} to="/admin/wallet" activeClassName="active-link">
          <ListItemIcon><WalletIcon sx={{color:'white'}}/></ListItemIcon>
          <ListItemText primary="Wallet" />
        </ListItem>
        <ListItem button component={NavLink} to="/admin/receipt" activeClassName="active-link">
          <ListItemIcon><ReceiptIcon sx={{color:'white'}}/></ListItemIcon>
          <ListItemText primary="Receipt" />
        </ListItem>
        <ListItem button component={NavLink} to="/admin/change-password" activeClassName="active-link">
          <ListItemIcon><LockIcon sx={{color:'white'}}/></ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon sx={{color:'white'}} /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#263245',
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton onClick={handleAvatarClick}>
            <Avatar alt="User Avatar">
              {userInfo?.firstname ? userInfo.firstname.charAt(0) : 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {userInfo ? (
              <>
                <MenuItem onClick={handleMenuClose}>
                  {`${userInfo.firstname} ${userInfo.lastname}`}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleMenuClose}>
                Login
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />

        <DashFooter/>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

