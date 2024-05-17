import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Button, Link } from '@mui/material';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CartView = () => {
  const [cartItems, setCartItems] = useState([]);
  const { storeId } = useParams();
  const cartItemsKey = `cartItems_${storeId}`;

  useEffect(() => {
    const storedCartItems = sessionStorage.getItem(cartItemsKey);
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const updateCartItems = (updatedCartItems) => {
    setCartItems(updatedCartItems);
    sessionStorage.setItem(cartItemsKey, JSON.stringify(updatedCartItems));
  };

  // Function to remove item from cart
  const removeItem = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    updateCartItems(updatedCartItems);
  };

  const increaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + 1;
        const newPrice = item.unitPrice * newQuantity;
        return { ...item, quantity: newQuantity, price: newPrice };
      }
      return item;
    });
    updateCartItems(updatedCartItems);
  };

  const decreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId && item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        const newPrice = item.unitPrice * newQuantity;
        return { ...item, quantity: newQuantity, price: newPrice };
      }
      return item;
    });
    updateCartItems(updatedCartItems);
  };

  const totalCost = cartItems.reduce((total, item) => total + item.price, 0);

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      window.location.href = `/checkout/${storeId}`;
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        padding: '20px',
        marginTop: '40px' // Increased top margin to shift contents slightly lower
      }}
    >
      <Container sx={{ marginBottom: '20px' }}> {/* Container for the header */}
        <Typography variant="h4" style={{ fontWeight: 'bold' }}>
          Your Cart
        </Typography>

      </Container>
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
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="remove" onClick={() => decreaseQuantity(item.id)}>
                  <RemoveIcon />
                </IconButton>
                <IconButton edge="end" aria-label="add" onClick={() => increaseQuantity(item.id)}>
                  <AddIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
      <div style={{ textAlign: 'right', marginTop: '20px' }}> {/* Increased top margin */}
        <Paper elevation={3} style={{ backgroundColor: 'white', padding: '10px' }}>
          <Typography variant="h6">
            Total Cost: ${totalCost}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '10px' }}
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </Paper>
      </div>
    </Container>
  );

};


export default CartView;