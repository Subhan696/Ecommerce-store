import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity, selectIsAuthenticated, selectCurrentUser } from '../../features/auth/authSlice';

const pages = [
  { title: 'Home', path: '/' },
  { title: 'Products', path: '/products' },
  { title: 'About', path: '/about' },
  { title: 'Contact', path: '/contact' },
];

export default function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const cartQuantity = useSelector(selectCartTotalQuantity);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu} component={RouterLink} to={page.path}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            E-Shop
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Right side icons */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {/* Cart */}
            <IconButton
              component={RouterLink}
              to="/cart"
              size="large"
              aria-label={`${cartQuantity} items in cart`}
              color="inherit"
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={cartQuantity} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* User menu */}
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
              <AccountCircleIcon sx={{ color: 'white' }} />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isAuthenticated ? (
                [
                  <MenuItem key="profile" component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>,
                  <MenuItem key="orders" component={RouterLink} to="/orders" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">My Orders</Typography>
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem key="logout" component={RouterLink} to="/logout" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>,
                ]
              ) : (
                [
                  <MenuItem key="login" component={RouterLink} to="/login" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>,
                  <MenuItem key="register" component={RouterLink} to="/register" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Register</Typography>
                  </MenuItem>,
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
