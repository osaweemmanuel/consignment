



import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Logo</Link>
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleDrawerToggle}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleCloseDrawer}
              >
                <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', padding: 2 }}>
                  <List>
                    <ListItem button component={Link} to="/" onClick={handleCloseDrawer}>
                      <ListItemText primary="Home" sx={{ textAlign: 'left' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/about" onClick={handleCloseDrawer}>
                      <ListItemText primary="About" sx={{ textAlign: 'left' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/services" onClick={handleCloseDrawer}>
                      <ListItemText primary="Services" sx={{ textAlign: 'left' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/contact" onClick={handleCloseDrawer}>
                      <ListItemText primary="Contact" sx={{ textAlign: 'left' }} />
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/about">
                About
              </Button>
              <Button color="inherit" component={Link} to="/services">
                Services
              </Button>
              <Button color="inherit" component={Link} to="/contact">
                Contact
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
