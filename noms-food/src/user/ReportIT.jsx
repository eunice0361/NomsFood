import React, { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs  } from "firebase/firestore";
import { TextField, Button, Typography, Container, Grid } from '@mui/material';

const reportNewTicket = async (ticketData) => {
    
  try {
    const collectionRef = collection(db, "ITTicket");
    const docRef = await addDoc(collectionRef, ticketData);
    console.log("Ticket reported Successfully. TicketID: ", docRef.id);
  } catch (error) {
    console.error("Error in creating Ticket:", error);
  }
}

const getCurrentUserDocument = async (email) => {
  try {
      const usersCollection = collection(db, 'Users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data();
      } else {
          return null; // Return null if no document found
      }
  } catch (error) {
      console.error('Error querying user document:', error);
      throw error;
  }
};

function TicketForm() {
  const auth = getAuth(); // Get Current User State
  const currentUser = auth.currentUser;
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (currentUser) {
      getCurrentUser();
    }
  }, [currentUser]);

  const getCurrentUser = async () => {
    try {
      const userDetails = await getCurrentUserDocument(currentUser.email);
      setUserDetails(userDetails);
    } catch (error) {
      console.error('Error getting user details:', error);
    }
  };

  const [ticketData, setTicketData] = useState({
    title: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const username = userDetails.name;
      const { title, description } = ticketData;
      const status = "open";
      const reportedDate = new Date();
      const closingDate = null;
      const ticketId = 1;
      const reportedUser = {
        uid: currentUser.uid, // Pass user UID
        email: currentUser.email, // Pass user email
        displayName: userDetails.name // Pass user display name
        // You can include other user properties as needed
      };
  
      await reportNewTicket({ // Call the reportNewTicket function with ticket details
        ticketId,
        username,
        title,
        description,
        status,
        reportedDate,
        closingDate,
        reportedUser
      });
        
      alert("Ticket reported Successfully."); // Display success message
    } catch (error) {
      console.error("Error in creating Ticket:", error);
      alert("Error in creating Ticket. Please try again."); // Display error message
    }
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
          <Typography variant="h3">Report a New IT Ticket</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Ticket Title"
                  name="title"
                  value={ticketData.title}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ticket Description"
                  name="description"
                  value={ticketData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Submit Ticket
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container>
    );
  }
  
  export default TicketForm;