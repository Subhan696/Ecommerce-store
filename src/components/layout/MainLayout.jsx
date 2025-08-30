import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
