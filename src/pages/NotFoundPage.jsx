import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  SentimentVeryDissatisfied as NotFoundIcon
} from '@mui/icons-material';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <NotFoundIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
        </Box>
        
        <Typography variant="h3" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          The link you followed may be broken, or the page may have been removed.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            size="large"
            sx={{ textTransform: 'none' }}
          >
            Go to Homepage
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
            size="large"
            sx={{ textTransform: 'none' }}
          >
            Go Back
          </Button>
        </Box>
        
        <Box sx={{ mt: 6, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Need help?{' '}
            <RouterLink 
              to="/contact" 
              style={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Contact our support team
            </RouterLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
