//import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore";
import { Container } from '@mui/material';

function StoreListings() {
  const [storeListings, setStoreListings] = useState([]);

  useEffect(() => {
    const fetchStoreListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Listing')); // Assuming 'storeListings' is your collection name
        const listingsData = querySnapshot.docs.map(doc => ({ id: doc.id, description: doc.data().description, title: doc.data().title }));
        setStoreListings(listingsData);
      } catch (error) {
        console.error('Error fetching store listings:', error);
      }
    };

    fetchStoreListings();
  }, []);

  return (
    <div>
      <Container>
        {storeListings.map(listing => (
          <ListStoreListing key={listing.id} listing={listing} />
        ))}
      </Container>
    </div>
  );
}

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function ListStoreListing({ listing }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={listing.title}
        subheader={listing.description}
      />
      <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {listing.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            nil
          </Typography>
          <Typography paragraph>
            nil
          </Typography>
          <Typography paragraph>
            nil
          </Typography>
          <Typography>
            nil
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default StoreListings;