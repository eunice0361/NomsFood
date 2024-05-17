import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from '@mui/material';
import '../../signup.css';

// Import your images
import background from "../../photo/nomswallpaper.jpg";
import nomsIcon from "../../photo/noms_icon.png";
import categoryImage1 from "../../photo/avocado.png";
import categoryImage2 from "../../photo/chinese.jpg";
import categoryImage3 from "../../photo/japanese.jpg";
import categoryImage4 from "../../photo/pastries.jpg";

const CustHome = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/searchStores');
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
          <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'}}>
            Healthy food for you at <span style={{ color: '#3EDF34' }}>NOMS</span>
          </Typography>
          
          <Typography variant="subtitle1" sx={{ marginTop: 0, color: 'white', textAlign: 'left', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'}}>
            Every Bite Counts: Nourishing Communities, One Plate at a Time.
          </Typography>
          <Button variant="contained" onClick={handleButtonClick} sx={{ marginTop: '1rem', backgroundColor:"teal", color:"white", fontWeight:"bold"}}>
            Browse our stores
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

export default CustHome;


