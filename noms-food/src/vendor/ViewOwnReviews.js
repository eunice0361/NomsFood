import React, { useEffect, useState } from 'react';
import { Typography, Container, Card, CardContent, Box } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getAuth } from 'firebase/auth';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

const ShopReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        calculateAverageRating();
    }, [reviews]);

    const fetchReviews = async () => {
        try {
            const auth = getAuth();
            const activeUser = auth.currentUser;
            const userQuerySnapshot = await getDocs(query(collection(db, 'Users'), where('userId', '==', activeUser.uid)));
            const activeStoreId = userQuerySnapshot.docs[0].data().storeId;


            const reviewsRef = collection(db, 'Review');
            const q = query(reviewsRef, where('storeId', '==', activeStoreId));
            const querySnapshot = await getDocs(q);

            const reviewsData = [];
            querySnapshot.forEach((doc) => {
                reviewsData.push({ id: doc.id, ...doc.data() });
            });

            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) {
            setAverageRating(0);
            return;
        }

        const totalRating = reviews.reduce((accumulator, review) => accumulator + review.rating, 0);
        const avgRating = totalRating / reviews.length;
        setAverageRating(avgRating);
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>
                Reviews for this Shop
            </Typography>
            {reviews.length > 0 ? (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Typography variant="h6" sx={{ marginRight: '10px' }}>
                            Average Rating:
                        </Typography>
                        {Array.from({ length: Math.floor(averageRating) }, (_, index) => (
                            <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '20px' }} />
                        ))}
                        {averageRating % 1 !== 0 && (
                            <StarHalfIcon sx={{ color: '#FFD700', fontSize: '20px' }} />
                        )}
                        {Array.from({ length: Math.floor(5 - averageRating) }, (_, index) => (
                            <StarBorderIcon key={index} sx={{ color: '#FFD700', fontSize: '20px' }} />
                        ))}
                        <Typography variant="h6" sx={{ marginLeft: '10px' }}>
                            ({averageRating.toFixed(1)} / 5)
                        </Typography>
                    </Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Number of Ratings: {reviews.length}
                    </Typography>
                    {reviews.map(review => (
                        <Card key={review.id} style={{ marginBottom: '20px' }}>
                            <CardContent>
                                <Typography variant="h6">
                                    Rating:
                                </Typography>
                                {Array.from({ length: Math.floor(review.rating) }, (_, index) => (
                                    <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '20px' }} />
                                ))}
                                {Array.from({ length: Math.max(5 - Math.ceil(review.rating), 0) }, (_, index) => (
                                    <StarBorderIcon key={index} sx={{ color: '#FFD700', fontSize: '20px' }} />
                                ))}
                                <Typography variant="body1">
                                    Comment: {review.comment}
                                </Typography>
                                <Typography variant="subtitle2">
                                    By: {review.userName}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Typography variant="body1">
                    No reviews found for this shop.
                </Typography>
            )}
        </Container>
    );
};

export default ShopReviewsPage;