import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore"; // Import deleteDoc
import { useAuth } from './contexts/authContext';
import { doSignOut } from './firebase/auth';
import { getAuth } from 'firebase/auth';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ProfilePageCust = () => {
  const [userData, setUserData] = useState(null);
  const { userLoggedIn, currentUserEmail } = useAuth(); // Assuming you have a way to get the current user's email
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog visibility
  const auth = getAuth(); // Get Current User State
  const userIden = auth.currentUser?.uid; // UserId 

  useEffect(() => {
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      const db = getFirestore();
      
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("userId", "==", userIden));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserData(userData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [userLoggedIn, currentUserEmail, navigate]);

  const handleOpenDialog = () =>{
    setOpenDialog(true);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  // const disableUserAccount = async (uid) => {
  //   try {
  //     const userRef = doc(db, "Users", uid);
  //     await updateDoc(userRef, { status: "Banned" });
  //     updateUserStatus(uid, "Banned");
  //     console.log(`User account with UID ${uid} disabled successfully.`);
  //   } catch (error) {
  //     console.error("Error disabling user account:", error);
  //   }
  // };

  const handleDeleteAccount = async () => {
    const db = getFirestore();
    const q = query(collection(db, "Users"), where("userId", "==", userIden));
    const querySnapshot = await getDocs(q);
    try {
      const docRef = querySnapshot.docs[0].ref;
      const userRef = doc(db, "Users", userIden);
      await updateDoc(docRef, { status: "Deleted" });

      console.log(`User account with UID ${userIden} disabled successfully.`);
      setOpenDialog(false); // Close the dialog after the action
      doSignOut().then(() => {
        navigate('/');
      });
    } catch (error) {
      console.error("Error disabling user account:", error);
    }
    
  };

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col justify-center items-center">
      {userData ? (
        <div className='max-w-md w-full space-y-4 bg-white shadow-lg rounded-lg p-6 border border-teal-200'>
          <h2 className="text-2xl font-semibold text-teal-800">User Profile</h2>
          <div className="space-y-1">
            <p className="text-gray-800"><span className="font-medium text-teal-600">Email:</span> {userData.email}</p>
            <p className="text-gray-800"><span className="font-medium text-teal-600">Name:</span> {userData.name}</p>
            <p className="text-gray-800"><span className="font-medium text-teal-600">Username:</span> {userData.username}</p>
            <p className="text-gray-800"><span className="font-medium text-teal-600">Contact:</span> {userData.contact}</p>
          </div>
          
          <button 
                onClick={() => navigate('/editprofile')}
                className='mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
              >
                Edit Profile
              </button>
          <button 
            onClick={() => { doSignOut().then(() => { navigate('/login') }) }} 
            className='mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
              >
            Logout
          </button>
          <br/><br/>

          <p className="text-red-600 hover:text-red-700 cursor-pointer mt-4" onClick={handleOpenDialog}>DELETE ACCOUNT</p>

        </div>
      ) : (
        <p className="text-center text-lg text-teal-600">Loading user data...</p>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"DELETE ACCOUNT"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ backgroundColor: '#FFCDD2', padding: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Are you sure you want to permenantly delete the account? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={() => handleDeleteAccount()} autoFocus color="error">
            Yes, Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePageCust;
