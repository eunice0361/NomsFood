import React, { useState, useEffect } from 'react';
import { LoadScript, useLoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { collection, addDoc, getFirestore, query, where, getDocs, updateDoc } from "firebase/firestore";
import { Box, Paper, Container, Typography, TextField, Stack, Grid, Button, MenuItem } from "@mui/material";
import vendorPhoto from '../photo/vendor.jpeg';


function CreateStore() {
  const navigate = useNavigate();
  const { currentUserEmail, currentUserId } = useAuth();
  const [store, setStore] = useState({
    name: '',
    description: '',
    opening: '',
    closing: '',
    location: '',
    locationString: '',
    category: '',
    isOpen: false,
    distance: '0',
    creatorEmail: currentUserEmail || '',
    userId: currentUserId || ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [marker, setMarker] = useState({ lat: null, lng: null });
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStore({
      ...store,
      [name]: value,
    });
  };

  const handlePlaceSelect = () => {
    const address = autocomplete.getPlace();
    setStore({
      ...store,
      location: address.formatted_address,
      locationString: address.formatted_address,
    });
    setMarker({ lat: address.geometry.location.lat(), lng: address.geometry.location.lng() });
  };

  const onLoad = (autoC) => setAutocomplete(autoC);

  useEffect(()=> {
    localStorage.setItem('isMapsApiLoaded', true);
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const db = getFirestore();

    try {
      const storeCollectionRef = collection(db, "Store");
      console.log(currentUserId);
      console.log(store.name);
      console.log(store.location);
      console.log(store.description);
      console.log(store.opening);
      console.log(store.closing);
      console.log(store.isOpen);
      console.log(currentUserEmail);
      const storeDocRef = await addDoc(storeCollectionRef, {
        ...store,
        location: marker,
      });

      const usersCollectionRef = collection(db, "Users");
      const q = query(usersCollectionRef, where("email", "==", currentUserEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming the email field is unique, there should only be one document
        const userDocRef = querySnapshot.docs[0].ref;

        // Step 3: Update the user document with the store ID
        
        await updateDoc(userDocRef, {
          storeId: storeDocRef.id,
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        navigate('/home'); // Navigate to home after successful store creation
      } else {
        console.log("User not found.");
      }

    } catch (error) {
      console.error("Error adding store", error);
    }
  };

  const libraries = ["places"];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs",
    libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  const sideImageStyles = {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Typography variant='h4' sx={{ mb: 2 }}>Sign your store up with NOMs!</Typography>
          <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* TextField components */}
              <TextField name="name" label="Store Name" variant="outlined" required onChange={handleInputChange} />
              <TextField name="description" label="Description" variant="outlined" required onChange={handleInputChange} />
              <TextField name="opening" label="Opening Hours" variant="outlined" placeholder='HH:MM' required onChange={handleInputChange} />
              <TextField name="closing" label="Closing Hours" variant="outlined" placeholder='HH:MM' required onChange={handleInputChange} />
              {/* Dropdown for categories component */}
              {/* Dropdown for categories */}
              <TextField
                select
                name="category"
                label="Category"
                variant="outlined"
                value={store.category}
                onChange={handleInputChange}
                required
              >
                {['Japanese', 'Chinese', 'Western', 'Korean', 'Pastry', 'Greens', 'Halal', 'Others'].map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              
              <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceSelect}>
                <TextField name="location" label="Store Location" variant="outlined" required onChange={handleInputChange} />
              </Autocomplete>
              {/* GoogleMap component */}
              {marker.lat && marker.lng && (
                <Paper elevation={3} sx={{ height: 400 }}>
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={marker}
                    zoom={15}
                  >
                    <Marker position={marker} />
                  </GoogleMap>
                </Paper>
              )}
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Sign Up Store</Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={10} md={5}>
          <Box
            component="img"
            src={vendorPhoto}
            alt="Vendor"
            sx={{ width: '98%', height: 'auto', borderRadius: '8px' }}
          />
        </Grid>
      </Grid>
      {showSuccess && <Typography color="success.main" sx={{ mt: 2 }}>Store signed up successfully!</Typography>}
    </Container>
  );
}

export default CreateStore;