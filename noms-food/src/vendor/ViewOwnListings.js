import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Card, Container, CardActions, CardMedia, Typography, Button, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Tabs, Tab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import burgerPicture from '../photo/burgerpicture.jpg';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: theme.spacing(2, 0),
  backgroundColor: theme.palette.background.paper,
}));

const MediaSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '16px',
});

const DetailsSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
  flex: '1',
});

const ActionsSection = styled(CardActions)({
  flexDirection: 'column',
  alignItems: 'flex-end',
  paddingRight: '16px',
});


const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

function ViewOwnListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const auth = getAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [tabValue, setTabValue] = useState(0);


  useEffect(() => {
    const fetchListings = async () => {
      const db = getFirestore();
      const userId = auth.currentUser?.uid;
      const q = query(collection(db, 'Listing'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const fetchedListings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedListings.push({ id: doc.id, ...data });
      });
      setListings(fetchedListings);
      setLoading(false);
    };

    fetchListings();
  }, [auth]);

  const handleOpenConfirmation = (listingId) => {
    setConfirmationOpen(true);
    setListingToDelete(listingId);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setListingToDelete(null);
  };

  const handleOpenEditDialog = (listing) => {
    setCurrentListing(listing);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentListing(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentListing({ ...currentListing, [name]: value });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredListings = listings.filter(listing =>
    tabValue === 0 ? listing.stock != "0" : listing.stock === "0"
  );

  // Inside your component function
  const [listingImages, setListingImages] = useState({});
  const storage = getStorage();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Function to fetch image URLs for all listings
    if (Object.keys(listingImages).length === 0) {
      // const timer = setTimeout(() => {
        const fetchListingImages = async () => {
          const images = {};

          // Iterate through each listing and fetch image URL
          for (const listing of filteredListings) {
            const imageRef = ref(storage, `users/listing/${listing.id}`);
            try {
              const url = await getDownloadURL(imageRef);
              images[listing.id] = url;
            } catch (error) {
              // Handle error, e.g., image not found
              console.error(`Error fetching image for listing ${listing.id}:`, error);
            }
          }

          // Update state with fetched image URLs
          setListingImages(images);
        };

        fetchListingImages();
      // }, 1000);
      // return () => clearTimeout(timer);
    }

  }, [filteredListings]); // Trigger fetch when filteredListings change

  // useEffect(() => {
  //   console.log("filteredListings HAS CHANGED")
  // }, [filteredListings]); // Trigger fetch when filteredListings change

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadPhoto = async (imageRef) => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {

      // Check if a photo already exists for the user
      const storageRef = ref(storage, `users/listing/${imageRef}`)

      // Delete the file
      deleteObject(storageRef).then(() => {
        console.log("Successful deletion")
      }).catch((error) => {
      });
      uploadBytes(storageRef, selectedFile).then((snapshot) => {
        console.log('Uploaded a blob or file!');

      });

      console.log("Image was added successfully to the db")

    } catch (error) {
      // Handle error
      console.log('Error:', error);
    }
  };


  const handleUpdateListing = async () => {
    if (currentListing) {
      const db = getFirestore();
      const listingRef = doc(db, 'Listing', currentListing.id);
      try {
        await updateDoc(listingRef, {
          title: currentListing.title,
          description: currentListing.description,
          price: currentListing.price,
          stock: currentListing.stock
        });
        if (selectedFile) {
          const images = listingImages;
          await uploadPhoto(currentListing.id)
          const imageRef = ref(storage, `users/listing/${currentListing.id}`);
            try {
              const url = await getDownloadURL(imageRef);
              images[currentListing.id] = url;
              setListingImages(images);
            } catch (error) {
              // Handle error, e.g., image not found
              console.error(`Error fetching image for listing ${currentListing.id}:`, error);
            }
        }
        // Update local state
        setListings(listings.map(listing => listing.id === currentListing.id ? currentListing : listing));
        handleCloseEditDialog();
      } catch (error) {
        console.error('Error updating listing:', error);
      }
    }
  };


  const handleDeleteListing = async () => {
    const db = getFirestore();
    try {
      await deleteDoc(doc(db, 'Listing', listingToDelete));
      const storageRef = ref(storage, `users/listing/${listingToDelete}`)

      // Delete the file
      await deleteObject(storageRef).then(() => {
        console.log("Successful deletion")
      }).catch((error) => {
      });
      setListings(prevListings => prevListings.filter(listing => listing.id !== listingToDelete));
      handleCloseConfirmation();
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Container>;
  }

  return (
    <StyledContainer maxWidth="md" sx={{ my: 5 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTab-root': { // Default style for all tabs
              color: '#030303', // Normal state color
            },
            '& .Mui-selected': { // Style for the selected tab
              color: '#119e80', // Custom color for selected tab
              fontWeight: 'bold', // Optional: if you want the selected tab to be bold
            },
            '& .MuiTab-root:hover': { // Hover state for tabs
              color: '#0a4d43', // A darker shade for hover, closer to #119e80
              opacity: 0.9
            },
            '& .MuiTabs-indicator': { // Style for the indicator line
              backgroundColor: '#119e80', // Same color as selected tab
            }
          }}
        >
          <Tab label="In Stock" />
          <Tab label="Out Of Stock" />
        </Tabs>

      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : filteredListings.length === 0 ? (
        <Typography>No listings found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredListings.map((listing) => (
            <Grid item xs={12} key={listing.id}>
              <StyledCard>
                <MediaSection>
                  <CardMedia
                    component="img"
                    image={listingImages[listing.id] || burgerPicture}
                    alt="Burger"
                    sx={{ width: '100px', height: '100px' }}
                  />
                </MediaSection>
                <DetailsSection>
                  <Typography variant="h6">{listing.title}</Typography>
                  <Typography>{listing.description}</Typography>
                  <Typography>Price: ${listing.price}</Typography>
                  <Typography>Stock: {listing.stock}</Typography>
                </DetailsSection>
                <ActionsSection>
                  <IconButton onClick={() => handleOpenEditDialog(listing)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenConfirmation(listing.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </ActionsSection>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Listing</DialogTitle>
        <DialogContent>
          <Box>
            <Typography variant="h6" gutterBottom>
              Replace Listing Image:
            </Typography>
            <input type="file" id="fileInput" onChange={handleFileChange} />
            {/* <Button style={{ backgroundColor: '#00897b', color: 'white' }} onClick={uploadPhoto}>Upload Photo</Button> */}
          </Box>
          <TextField
            margin="normal"
            fullWidth
            label="Title"
            name="title"
            value={currentListing?.title || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={currentListing?.description || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Price ($)"
            name="price"
            type="number"
            value={currentListing?.price || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Stock"
            name="stock"
            type="number"
            value={currentListing?.stock || ''}
            onChange={handleEditInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} sx={{ color: 'black' }} >Cancel </Button>
          <Button onClick={handleUpdateListing} sx={{ color: 'green' }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmationOpen} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this listing?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} sx={{ color: 'black' }} >Cancel</Button>
          <Button onClick={handleDeleteListing} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );


}

export default ViewOwnListings;