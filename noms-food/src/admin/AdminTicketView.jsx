import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { Dialog, DialogTitle, DialogContent, Divider, DialogActions, Card, styled, Tabs, Tab, Paper, Typography, Container, List, ListItem, ListItemText, Button, TextField } from '@mui/material';
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";


// Enhanced Card Style
const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[4],
    }
}));

// Modern Button Style
const ActionButton = styled(Button)({
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
    }
});

// Dialog Content with Improved Padding
const DialogContentStyled = styled(DialogContent)({
    padding: '20px',
});


const getAllTickets = async () => {
    try {
        const ticketsCollection = collection(db, "ITTicket");
        const ticketSnapshot = await getDocs(ticketsCollection);
        return ticketSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return [];
    }
};

const AdminTicketView = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [reply, setReply] = useState('');
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchTickets = async () => {
            const fetchedTickets = await getAllTickets();
            setTickets(fetchedTickets);
        };

        fetchTickets();
    }, []);

    const handleSelectTicket = (ticket) => {
        setSelectedTicket(ticket);
        setReply('');
    };

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleResolve = async () => {
        if (selectedTicket && reply) {
            try {
                const ticketRef = doc(db, "ITTicket", selectedTicket.id);
                await updateDoc(ticketRef, {
                    status: 'closed',
                    reply,
                    closingDate: new Date()
                });
                alert("Ticket resolved and reply sent.");
                setSelectedTicket(null);
                setReply('');
                setTickets(prev => prev.map(t => t.id === ticketRef.id ? { ...t, status: 'closed' } : t));
            } catch (error) {
                console.error("Error updating ticket:", error);
                alert("Failed to resolve ticket. Please try again.");
            }
        } else {
            alert("Please enter a reply before resolving.");
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const filteredTickets = tickets.filter(ticket => (tabValue === 0 ? ticket.status === 'open' : ticket.status === 'closed'));

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 2, backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)' }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>  {/* Increased bottom margin, bold, and centered */}
                    IT Ticket Management
                </Typography>
                <Divider sx={{ mb: 2 }} />  {/* Divider added for clear separation */}
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        '& .MuiTab-root': { // Default style for all tabs
                            color: '#030303', // Normal state color
                        },
                        '& .Mui-selected': { // Style for the selected tab
                            color: '#0d6659', // A darker version of #119e80 for selected tab
                        },
                        '& .MuiTab-root:hover': { // Hover state for tabs
                            color: '#0a4d43', // A darker shade for hover
                            opacity: 0.9
                        }
                    }}
                >
                    <Tab label="Open Tickets" />
                    <Tab label="Closed Tickets" />
                </Tabs>

                <List>
                    {filteredTickets.map((ticket) => (
                        <ListItem button onClick={() => handleSelectTicket(ticket)} key={ticket.id}>
                            <ListItemText primary={`Ticket ID: ${ticket.id} - ${ticket.title}`} secondary={`Status: ${ticket.status}`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {selectedTicket && (
                <Dialog
                    open={Boolean(selectedTicket)}
                    onClose={() => setSelectedTicket(null)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Selected Ticket Details</DialogTitle>
                    <DialogContent>
                        <Typography><b>Title:</b> {selectedTicket.title}</Typography>
                        <Typography><b>Description:</b> {selectedTicket.description}</Typography>
                        <Typography><b>User ID:</b> {selectedTicket.reportedUser.uid}</Typography>
                        <Typography><b>Username:</b> {selectedTicket.reportedUser.displayName}</Typography>
                        <Typography><b>Email:</b> {selectedTicket.reportedUser.email}</Typography>
                        <Typography><b>Reported Date:</b> {
                            selectedTicket.reportedDate.toDate ? (
                                `${selectedTicket.reportedDate.toDate().getDate()} ${selectedTicket.reportedDate.toDate().toLocaleString('default', { month: 'short' })} ${selectedTicket.reportedDate.toDate().getFullYear()} ${selectedTicket.reportedDate.toDate().getHours()}:${selectedTicket.reportedDate.toDate().getMinutes().toString().padStart(2, '0')}`
                            ) : 'Date unavailable'
                        }
                        </Typography>
                        <TextField
                            label="Enter Reply"
                            multiline
                            rows={4}
                            fullWidth
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                            sx={{ mt: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#119e80' } } }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedTicket(null)} color="secondary">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleResolve}
                            sx={{ backgroundColor: '#119e80', '&:hover': { backgroundColor: '#165a40' } }}>
                            Resolve
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );

};

export default AdminTicketView;
