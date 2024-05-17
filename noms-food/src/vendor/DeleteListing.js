import React, { useState } from 'react';
import { doc, deleteDoc, getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// import './CreateListing.css'; // Import the CSS file for styling

const DeleteListing = () => {
    const [listingId, setListingId] = useState('');

    const handleDelete = async () => {
        const db = getFirestore();
        const listingDocRef = doc(db, "Listing", listingId);

        try {
            await deleteDoc(listingDocRef);
            console.log('Listing deleted successfully');
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    return (
        <div>
            <h2>Delete Listing</h2>
            <label htmlFor="listingId">Listing ID:</label>
            <input
                type="text"
                id="listingId"
                value={listingId}
                onChange={e => setListingId(e.target.value)}
            />
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default DeleteListing;