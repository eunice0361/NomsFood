import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper, Grid, Box } from '@mui/material';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useParams } from 'react-router-dom';
import PaypalPayment from './paypal';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const { storeId } = useParams();
    const cartItemsKey = `cartItems_${storeId}`;
 
    useEffect(() => {
        const storedCartItems = sessionStorage.getItem(cartItemsKey);
        console.log(storedCartItems);
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    const totalCost = cartItems.reduce((total, item) => total + item.price, 0);

    const initialOptions = {
        clientId: "AT2pqBSGUnTl_0rmjZnvVC7reVEUUzNcVcftmU0XucZND-cuy7yvjfzcodRkVjvEgwz1bJVv6u84Xf-u",
        currency: "SGD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <Container maxWidth="md" sx={{ padding: '20px', marginTop: '20px' }}>
                <div>
                    <Typography variant="h5" gutterBottom>
                        Order Summary
                    </Typography>
                    <Paper>
                        <List>
                            {cartItems.map((item) => (
                                <ListItem key={item.id}>
                                    <ListItemText
                                        primary={`${item.title}`}
                                        secondary={`Item Description: ${item.description}`}
                                    />
                                    <ListItemText
                                        primary={`Price: $${item.price}`}
                                        secondary={`Quantity: ${item.quantity}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                        <Paper elevation={3} style={{ backgroundColor: 'white', border: '1px solid black', padding: '10px' }}>
                            <Typography variant="h6">
                                Total Cost: ${totalCost}
                            </Typography>
                        </Paper>
                    </div>
                </div>
                <Grid container justifyContent="center" marginTop={4} sx={{ bgcolor: 'white' }}>
                    <Grid item xs={12} sm={6}>
                        <Box textAlign="center">
                            <PaypalPayment />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </PayPalScriptProvider>
    );
};

export default CheckoutPage;