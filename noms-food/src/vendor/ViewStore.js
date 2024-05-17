import React, { useEffect, useState } from 'react';
import {
    doc,
    getDoc,
    getFirestore,
    query,
    collection,
    where,
    getDocs,
    updateDoc
} from "firebase/firestore";
import { useAuth } from '../contexts/authContext'; // Adjust the import path as necessary
import { LoadScript, GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'; // Correctly imported
import { useNavigate } from 'react-router-dom';
import './ViewStore.css';
import { Box, Container, Typography, TextField, Stack, Button } from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

function ViewStore() {
    const { currentUserEmail } = useAuth();
    const [store, setStore] = useState(null);
    const [address, setAddress] = useState("");
    const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false); // Add this line

    const db = getFirestore();
    const navigate = useNavigate();

    const handleEditStore = () => {
        navigate('/editstore');
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs",

    });

    const storage = getStorage();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [storeId2, setStoreId] = useState("");

    useEffect(() => {

        const imageRef = ref(storage, `users/store/${storeId2}`);
        getDownloadURL(imageRef)
            .then((url) => {
                // Set the image URL once it's fetched
                setImageUrl(url);
            })
            .catch((error) => {
                // Handle any errors
                console.error('Error fetching image URL:', error);
            });
    }, [storeId2]);


    useEffect(() => {

        const fetchStore = async () => {
            // Step 1: Query the Users collection to get the user's storeId
            const q = query(collection(db, "Users"), where("email", "==", currentUserEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                const storeId = userDoc.storeId;
                setStoreId(storeId)

                // Step 2: Fetch the store details using the storeId
                const storeRef = doc(db, "Store", storeId);
                const storeDoc = await getDoc(storeRef);

                if (storeDoc.exists()) {
                    const storeData = storeDoc.data()
                    setStore(storeData);
                    console.log(storeDoc);
                } else {
                    console.log("No store found.");
                }
            } else {
                console.log("User not found.");
            }
        };

        fetchStore();
    }, [currentUserEmail, db]);

    useEffect(() => {
        if (store && store.location && isLoaded) { // Check if API is loaded
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: store.location }, (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        setAddress(results[0].formatted_address);
                        console.log("Its Loaded")
                    } else {
                        console.log("No results found");
                    }
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
            });
        }
    }, [store, isMapsApiLoaded]); // Depend on store.location and isMapsApiLoaded


    const navigateReview = (() => {
        navigate('/viewShopReviews');
    })

    // if (!store) {
    //     return <div>Loading store information...</div>;
    // }

    const containerStyle = {
        width: '800px', // Adjust width as needed
        height: '400px' // Adjust height as needed
    };

    return (
        <Container>
            {!store ? <div>Loading store information...</div>
                :
                <Box>
                    <Box>
                        <h2 className="ViewStore-header">View Your Store</h2>
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Store Image:
                            </Typography>
                            <div>
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Stars" />
                                ) : (
                                    <p>Store Image has not been set...</p>
                                )}
                            </div>

                        </Box>
                        <div className="ViewStore-details">
                            <p><b>Store Name:</b> {store.name}</p>
                            <p><b>Description:</b> {store.description}</p>
                            <p><b>Opening Hours:</b> {store.opening}</p>
                            <p><b>Closing Hours:</b> {store.closing}</p>
                            <p><b>Store Location:</b> {address}</p>
                        </div>
                    </Box>
                    {
                        isLoaded ?
                            <div className="ViewStore-container">
                                <div className="ViewStore-mapContainer">
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={store.location}
                                        zoom={15}
                                    >
                                        <Marker position={store.location} />
                                    </GoogleMap>
                                </div>

                            </div>
                            :
                            // <LoadScript
                            //     googleMapsApiKey="AIzaSyAPomcsuwYqpr_xLpQPAfZOFI3AxxuldJs"
                            //     onLoad={() => setIsMapsApiLoaded(true)}
                            // >
                            <Box>
                                <Typography>Loading...</Typography>
                            </Box>
                        // </LoadScript>

                    }

                </Box>
            }
            <Box>
                <button className="ViewStore-button" onClick={navigateReview}>View All Reviews</button> <br /><br />
                <button className="ViewStore-button" onClick={handleEditStore}>Edit Store</button> <br /><br />
            </Box>
        </Container>
    );
}

export default ViewStore;
