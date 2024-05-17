import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';


const AccountType = () => {
    
    const [accType, setAccType] = useState(''); // User account type
    const navigate = useNavigate();

    const updateSessionStorage = (key, value) => {
        sessionStorage.setItem(key, value); // Temporarily store user account type
      };

    const handleVendor = () => {
        setAccType('Vendor');
        updateSessionStorage('accType', 'Vendor');
        register();
    }
    const handleCustomer = () => {
        setAccType('Customer');
        updateSessionStorage('accType', 'Customer');
        register();
    }
    const register = () => {
      navigate("/register"); // Redirects user to register
    };

    return (
      <Container
        maxWidth="sm" 
        sx={{  
          padding: '20px', 
          height: '100vh' }}>
        <Container
          maxWidth="xs"
          sx={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px',
            marginTop: '55px' }}>
          <Typography variant="h5" sx={{textAlign: 'center', marginBottom: '20px' }}>
            Registering As:
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleVendor} sx={{ marginBottom: '10px' }}>
              Vendor
            </Button>
            <Button variant="contained" color="primary" onClick={handleCustomer}>
              Customer
            </Button>
          </div>
        </Container>
      </Container>
    );
};

export default AccountType;