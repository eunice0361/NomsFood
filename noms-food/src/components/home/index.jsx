import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../signup.css';

const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div className='container'>
        <div className='text-2xl font-bold pt-14'>
            Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
            
        </div>
        <div>
        <button
                onClick={() => navigate('/createlisting')} // Use navigate to go to the Create Listing page
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go to Create Listing
        </button>
        </div>
        <div>
        <button
                onClick={() => navigate('/createstore')} // Use navigate to go to the Create Listing page
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go to Create Store
        </button>
        </div>
        <div>
        <button
                onClick={() => navigate('/viewownlistings')} // Use navigate to go to the Create Listing page
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go to View Listings
        </button>

        <button
                onClick={() => navigate('/viewstore')} // Use navigate to go to the Create Listing page
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go to View Store
        </button>
        <button
                onClick={() => navigate('/adminviewuser')} // Use navigate to go to the Create Listing page
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Go to Admin View Users
        </button>

        </div>
        </div>
    );
};

export default Home;
