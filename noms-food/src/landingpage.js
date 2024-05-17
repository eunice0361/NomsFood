import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from '@mui/material';
import './signup.css';

// Import your images
import background from "./photo/nomswallpaper.jpg";
import nomsIcon from "./photo/noms_icon.png";
import categoryImage1 from "./photo/avocado.png";
import categoryImage2 from "./photo/chinese.jpg";
import categoryImage3 from "./photo/japanese.jpg";
import categoryImage4 from "./photo/pastries.jpg";
import { doSignOut } from "./firebase/auth.js";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    doSignOut();
  }, []);

  const handleButtonClick = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh', // You can adjust this as needed
          width: '100vw', // Ensure it takes full width
          marginLeft: '-2vw', // Resets any inherited margin
          position: 'relative',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative' }}>
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'left', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
            Healthy food for you at NOMs
          </Typography>
          <Typography variant="subtitle1" sx={{ marginTop: 0, color: 'white', textAlign: 'left', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}>
            Every Bite Counts: Nourishing Communities, One Plate at a Time.
          </Typography>
          <Button variant="contained" onClick={handleButtonClick} sx={{ marginTop: '1rem', backgroundColor:"teal", color:"white", fontWeight:"bold"}}>
            Login to learn more
          </Button>
        </Container>
      </Box>

      {/* Smaller Standard Size Category Images in 2x2 Grid */}
      {/* Category Images */}
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '2rem',
            flexWrap: 'wrap', // Ensures responsiveness
          }}
        >
          {[
            { image: categoryImage1, label: "Healthy Greens", link: "/greens" },
            { image: categoryImage2, label: "Savoury Chinese Food", link: "/chinese" },
            { image: categoryImage3, label: "Savoury Japanese Food", link: "/japanese" },
            { image: categoryImage4, label: "Delicious Pastries", link: "/pastries" }
          ].map((category, index) => (
            <Box key={index} sx={{ width: '22%', margin: '1%', position: 'relative', textAlign: 'center' }}>
              <img
                src={category.image}
                alt={category.label}
                style={{
                  width: '100%', // Adjust width as needed
                  borderRadius: '8px', // Rounded edges
                  height: '100%', // Ensure the image covers the area
                }}
              />
              <Typography variant="subtitle1" sx={{ position: 'absolute', top: '10%', right: '0px', width: '100%', fontSize: '130%', fontFamily: 'cursive', color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)' }}>
                {category.label}
              </Typography>
              <Button variant="contained" sx={{ position: 'absolute', bottom: '5%', left: '30%', transform: 'translateX(-50%)', backgroundColor: 'rgba(128, 128, 128, 0.4)', color: 'white', }} onClick={() => navigate(category.link)}>
                Learn More
              </Button>
            </Box>
          ))}
        </Box>


    </Box>
  );
};

export default LandingPage;


// import db from "./firebase/firebase";
// import logo from './logo.svg';
// import './signup.css';
// import { useNavigate } from "react-router-dom";
// import { Box, Container, Typography } from '@mui/material';
// import background from "./photo/noms_background.jpg"
// import nomsIcon from "./photo/noms_icon.png"
// import { doSignOut } from "./firebase/auth.js";

// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   addDoc,
//   doc,
//   setDoc,
//   query,
//   where,
//   getDocs,
//   getFirestore,
// } from "firebase/firestore";

// /* TODO: Below buttons are only for testing, since login must occur first */

// const LandingPage = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     doSignOut();
//   }, []);

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         position: 'relative',
//         alignItems: 'center', // Center items vertically
//         justifyContent: 'center', // Center items horizontally
//         backgroundImage: `url(${background})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         height: '100vh',
//       }}
//     >
//       <img
//         src={nomsIcon}
//         alt="NOMs Logo"
//         style={{
//           position: 'absolute', // Set position to absolute
//           top: '20%', // Center vertically
//           left: '50%', // Center horizontally
//           transform: 'translate(-50%, -50%)', // Center the image
//           width: '50%',
//           maxWidth: '150px',
//           borderRadius: '8px',
//           zIndex: 1,
//         }}
//       />
//       <Container
//         maxWidth="sm"
//         sx={{
//           position: 'absolute', // Set position to absolute
//           bottom: '35%', // Adjust bottom offset as desired
//           left: '50%', // Center horizontally
//           transform: 'translateX(-50%)', // Center the container
//           textAlign: 'center',
//           background: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
//           borderRadius: '8px', // Rounded corners
//           padding: '2rem', // Add padding
//           zIndex: 0,
//           '@media (max-width: 600px)': { // Apply styles for screens with max width of 600px (mobile devices)
//             bottom: '20%', // Adjust bottom offset for mobile
//             padding: '1rem', // Adjust padding for mobile
//           }
//         }}
//       >
//         <Typography variant="h2">Welcome to NOMs</Typography>
//         <Typography variant="subtitle1" sx={{ marginTop: 2 }}>Every Bite Counts: Nourishing Communities, One Plate at a Time</Typography>
//       </Container>
//     </Box>
//   );
// };

// export default LandingPage;


// /*
// <div className="container">
//       <div>
//         <button onClick={handleSignupLink}>
//             Sign up now
//         </button>
//       </div>

//       <div>
//         <button onClick={handleCreateListing}>
//             Create Listing Page
//         </button>
//       </div>

//       <div>
//         <button onClick={handleAccountClick}>
//             Account
//         </button>
//       </div>
     
//     </div>
// */