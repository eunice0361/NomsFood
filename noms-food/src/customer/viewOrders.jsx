import React, { useEffect, useState } from 'react';
import { Typography, Divider,Container, Tab, Tabs, TabPanel, ListItem, ListItemText, Box, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, TableCell, TableRow, TableBody, TableHead, Table, Paper, TableContainer,Select,MenuItem,TextField,} from '@mui/material';
import { getFirestore, collection, query, getDocs, doc, getDoc, where, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';


const ViewAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [tabValue, setTabValue] = useState('active');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const db = getFirestore();
        const ordersCollection = collection(db, 'Order');
        const ordersSnapshot = await getDocs(query(ordersCollection, where('customerId', '==', currentUser.uid)));
        const ordersData = ordersSnapshot.docs.map(async doc => {
            const orderData = doc.data();
            const storeName = await fetchStoreName(orderData.storeId);
            return { id: doc.id, ...orderData, storeName };
        });
        const resolvedOrdersData = await Promise.all(ordersData);
        setOrders(resolvedOrdersData);
    };

    const fetchStoreName = async (storeId) => {
        if (!storeId) {
            return 'Unknown Store';
        }

        try {
            const db = getFirestore();
            const storeDoc = await getDoc(doc(db, 'Store', storeId));

            if (storeDoc.exists()) {
                const storeData = storeDoc.data();
                return storeData.name;
            } else {
                return 'Unknown Store';
            }
        } catch (error) {
            console.error('Error fetching store name:', error);
            return 'Unknown Store';
        }
    };


    const handleListItemClick = async (order) => {
        await handleOrderDetails(order);
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleOrderDetails = async (order) => {
        const orderItems = order.orderItems;
        const listingsData = [];
        for (const item of orderItems) {
            const listingDocRef = doc(db, 'Listing', item.listingId);
            const listingDocSnapshot = await getDoc(listingDocRef);
            const listingData = listingDocSnapshot.data();
            const itemBought = {
                itemId: listingDocSnapshot.id,
                itemTitle: listingData.title,
                itemQuantity: item.quantity,
                itemUnitPrice: item.price,
                itemTotalPrice: (item.price * item.quantity)
            };
            listingsData.push(itemBought);
        }
        console.log(listingsData);
        setOrderDetails(listingsData);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setOrderDetails([]);
        setSelectedOrder(null);
    };

    const filteredOrders = orders.filter(order => {
        if (tabValue === 'active') {
            return order.orderStatus !== 'Completed';
        } else if (tabValue === 'completed') {
            return order.orderStatus === 'Completed';
        }
    }).sort((a, b) => {
        if (a.date > b.date) {
            return -1;
        } else if (a.date < b.date) {
            return 1;
        } else {
            return 0;
        }
    });


    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    const openRatingDialog = (order) => {
        setSelectedOrder(order);
        setRatingDialogOpen(true);
    };

    const closeRatingDialog = () => {
        setRatingDialogOpen(false);
    };

    const handleRatingUpdate = (rating) => {
        setRating(rating)
    };

    const handleCommentUpdate = (comment) => {
        setComment(comment)
    };

    const handleLeaveReview = async () => {
        try {
            const auth = getAuth();
            const activeUser = auth.currentUser;
            const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where('userId', '==', activeUser.uid)));
            const activeUserUsername = userQuerySnapshot.docs[0].data().username;

            const reviewData = {
                rating: rating,
                comment: comment,
                userName: activeUserUsername,
                storeId: selectedOrder.storeId,
            };

            console.log(reviewData);

            await addDoc(collection(db, 'Review'), reviewData);

            const orderRef = doc(db, 'Order', selectedOrder.id);
            await updateDoc(orderRef, { orderReviewed: true });
            fetchOrders();
            closeRatingDialog();
            alert("Review Added Successfully");
        } catch (error) {
            console.error('Error leaving review:', error);
        }
    };


    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2, backgroundColor: 'white' }}>
            
                
                <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => setTabValue(newValue)}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab value="active" label="Active Orders" />
                    <Tab value="completed" label="Completed Orders" />
                </Tabs>
            </Box>
            {orders.length > 0 ? (
                <Box bgcolor="white" p={2} borderRadius={4}>
                    <Stack spacing={2}>
                        {filteredOrders.map(order => (
                            <Box key={order.id} bgcolor="white" borderRadius={4} boxShadow={1} style={{ cursor: 'pointer' }}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                                Order ID: {order.orderId.slice(-4)}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body1">
                                                <strong>Store Name:</strong> {order.storeName}
                                                <br />
                                                <strong>Date:</strong> {order.date.toDate().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })}
                                                <br />
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>Status: {order.orderStatus}</span>
                                            </Typography>
                                        }
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Box mt={1}>
                                            <Button onClick={() => handleListItemClick(order)} color="primary" fullWidth sx={{ color: 'black', borderColor: 'black' }}>
                                                View Details
                                            </Button>
                                        </Box>
                                        {tabValue === 'completed' && order.orderReviewed === false && (
                                            <Button onClick={() => openRatingDialog(order)} color="primary" fullWidth sx={{ color: 'black', borderColor: 'black' }}>
                                                Leave Review
                                            </Button>
                                        )}
                                    </Box>
                                </ListItem>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            ) : (
                <Typography variant="body1">
                    No orders found.
                </Typography>
            )}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
    <DialogTitle style={{ fontWeight: 'bold'}}>Order Details</DialogTitle>
    <DialogContent>
        {selectedOrder && (
            <div>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Order ID:</strong> {selectedOrder.orderId.slice(-4)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Store Name:</strong> {selectedOrder.storeName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Status:</strong> {selectedOrder.orderStatus}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Date:</strong> {selectedOrder.date.toDate().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })}
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price (SGD)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderDetails.map((listing) => (
                                <TableRow key={listing.itemId}>
                                    <TableCell>{listing.itemTitle}</TableCell>
                                    <TableCell align="right">{listing.itemQuantity}</TableCell>
                                    <TableCell align="right">${listing.itemTotalPrice}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Total Price: $</strong> {selectedOrder.orderPrice}
                </Typography>
            </div>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
            Close
        </Button>
    </DialogActions>
</Dialog>

            <Dialog open={ratingDialogOpen} onClose={closeRatingDialog}>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Change status for Order ID: {selectedOrder && selectedOrder.orderId.slice(-4)}
                    </Typography>
                    <Select
                        value={rating}
                        onChange={(event) => handleRatingUpdate(event.target.value)}
                        fullWidth
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </Select>
                    <Box mt={2}>
                        <TextField
                            label="Comment"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={comment}
                            onChange={(event) => handleCommentUpdate(event.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleLeaveReview} color="primary">
                        Leave Feedback
                    </Button>
                    <Button onClick={closeRatingDialog} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ViewAllOrders;