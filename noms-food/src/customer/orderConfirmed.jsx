import React, { useEffect } from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";


const OrderConfirmed = () => {
    const { storeId, orderId } = useParams();
    const cartItemsKey = `cartItems_${storeId}`;

    useEffect(() => {
        console.log("Order done");
    }, []);

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Order Confirmed!
            </Typography>
            <Typography variant="body1" paragraph>
                Thank you for your order. Your payment has been successfully processed and your order is confirmed.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/searchStores">
                Continue Shopping
            </Button>
        </Container>
    );
};

export default OrderConfirmed;