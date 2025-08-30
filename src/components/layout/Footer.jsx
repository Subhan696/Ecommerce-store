import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              E-Shop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop shop for all your needs. Quality products at competitive prices.
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Shop
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              <li>
                <Link component={RouterLink} to="/products" color="text.secondary" underline="hover">
                  All Products
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/categories" color="text.secondary" underline="hover">
                  Categories
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/deals" color="text.secondary" underline="hover">
                  Deals
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/new-arrivals" color="text.secondary" underline="hover">
                  New Arrivals
                </Link>
              </li>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Customer Service
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
              <li>
                <Link component={RouterLink} to="/contact" color="text.secondary" underline="hover">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/faq" color="text.secondary" underline="hover">
                  FAQ
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/shipping" color="text.secondary" underline="hover">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link component={RouterLink} to="/returns" color="text.secondary" underline="hover">
                  Returns & Exchanges
                </Link>
              </li>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook color="action" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter color="action" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram color="action" />
              </Link>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Subscribe to our newsletter for the latest updates and offers.
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} E-Shop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
