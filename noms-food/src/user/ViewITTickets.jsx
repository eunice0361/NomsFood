import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Typography,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Paper
} from '@mui/material';

function ViewITTickets() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [ongoingTickets, setOngoingTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchTickets = async () => {
      if (currentUser) {
        setLoading(true);
        const ticketsCollection = collection(db, 'ITTicket');
        const q = query(ticketsCollection, where('reportedUser.uid', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedTickets = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          reportedDate: doc.data().reportedDate?.toDate()
        }));
        
        setOngoingTickets(fetchedTickets.filter(ticket => ticket.status === 'open'));
        setClosedTickets(fetchedTickets.filter(ticket => ticket.status === 'closed'));
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentUser]);

  const handleOpenDetails = (ticket) => {
    setSelectedTicket(ticket);
    setDetailDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailDialogOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Typography>Loading tickets...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 3 }}>
      <Paper elevation={3} sx={{ width: '100%', p: 2, mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Ongoing IT Tickets" />
          <Tab label="Closed IT Tickets" />
        </Tabs>
      </Paper>
      <Paper elevation={3} sx={{ width: '100%', p: 2 }}>
        <List>
          {tabValue === 0 && ongoingTickets.length === 0 && (
            <Typography sx={{ textAlign: 'center', my: 2 }}>No Ongoing Tickets to show.</Typography>
          )}
          {tabValue === 1 && closedTickets.length === 0 && (
            <Typography sx={{ textAlign: 'center', my: 2 }}>No Closed Tickets to show.</Typography>
          )}
          {tabValue === 0 ? (
            ongoingTickets.map((ticket) => (
              <ListItem key={ticket.id}>
                <Card sx={{ width: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{ticket.title}</Typography>
                    <Typography color="textSecondary">Reported on: {ticket.reportedDate?.toLocaleString()}</Typography>
                    <Typography sx={{ mt: 1 }}>{ticket.description}</Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))
          ) : (
            closedTickets.map((ticket) => (
              <ListItem button onClick={() => handleOpenDetails(ticket)} key={ticket.id}>
                <Card sx={{ width: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{ticket.title}</Typography>
                    <Typography color="textSecondary">Reported on: {ticket.reportedDate?.toLocaleString()}</Typography>
                    <Typography sx={{ mt: 1 }}>{ticket.description}</Typography>
                    {ticket.reply && (
                      <Typography color="primary" sx={{ mt: 1 }}>
                        Reply: {ticket.reply}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      {/* Dialog for ticket details */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>IT Ticket Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedTicket?.title}</Typography>
          <Typography color="textSecondary">
            Reported on: {selectedTicket?.reportedDate?.toLocaleString()}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {selectedTicket?.description}
          </Typography>
          {selectedTicket?.reply && (
            <Typography sx={{ mt: 2 }}>
              Reply: {selectedTicket?.reply}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default ViewITTickets;