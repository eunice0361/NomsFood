import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../signup.css';


const AdminHome = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div>
        <div className='container'>
            
        <div className='text-2xl font-bold pt-14'>
            Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
            
        </div>
        
        </div>
        </div>
    );
};

export default AdminHome;
