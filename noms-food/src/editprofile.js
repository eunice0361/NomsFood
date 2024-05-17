import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getFirestore, getDocs, where, query, collection } from "firebase/firestore";
import { useAuth } from './contexts/authContext';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    contact: '',
  });
  const { userLoggedIn, currentUserEmail } = useAuth(); // Assuming this hook provides the logged-in status and the current user's email
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      const db = getFirestore();
      const usersRef = collection(db, "Users");
      console.log('Current User Email:', currentUserEmail);
      const q = query(usersRef, where("email", "==", currentUserEmail));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Assuming the first document is the user's data
          const formData = querySnapshot.docs[0].data();
          setFormData(formData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [userLoggedIn, currentUserEmail, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get the reference to the user document by email
    const q = query(collection(db, "Users"), where("email", "==", currentUserEmail));
  
    try {
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // There should only be one user with this email, so we'll take the first doc
        const userDocRef = querySnapshot.docs[0].ref;
  
        // Update the user document
        await updateDoc(userDocRef, formData);
        console.log("Profile updated successfully");
        navigate('/profilepage'); // or wherever you wish to redirect after update
      } else {
        // This will run if there's no user with the given email
        console.error("No matching document found to update");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col justify-center items-center">
      <form className="max-w-md w-full space-y-4 bg-white shadow-lg rounded-lg p-6 border border-teal-200" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-teal-800">Edit Profile</h2>
        <div className="space-y-1">
          <label htmlFor="name" className="text-gray-600">Name: </label>
          <input className="w-full p-2 border border-teal-200 rounded-md" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
          <label htmlFor="name" className="text-gray-600">Email: </label>
          <input className="w-full p-2 border border-teal-200 rounded-md" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
          <label htmlFor="name" className="text-gray-600">Username: </label>
          <input className="w-full p-2 border border-teal-200 rounded-md" type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" />
          <label htmlFor="name" className="text-gray-600">Contact: </label>
          <input className="w-full p-2 border border-teal-200 rounded-md" type="text" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Contact" />
          {/* Add more fields as needed */}
        </div>
        <button type="submit" className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
          Update Account
        </button>
        <p className="text-teal-600 hover:text-teal-700 cursor-pointer" onClick={() => navigate('/profilepage')}>Back to Profile Page</p>
      </form>
    </div>
  );
};

export default EditProfile;
