import React,  { useState, useEffect }  from 'react'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { getToken } from '../services/localStorageService';
import { useAddReviewsMutation,useShowReviewsQuery } from '../services/Review/reviewApi';
const AddReview = ({productId}) => {
    const {access_token} = getToken()
    const [addReviews] = useAddReviewsMutation();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0)
    const {  refetch } = useShowReviewsQuery({ access_token, pid: productId });
    const onReviewChange = e => setReview(e.target.value)

    const addReview =async  (e) =>{
        e.preventDefault();
        const reviewData = {
            product : productId,
            rating: rating,
            review: review,

        }
        const res = await addReviews({reviewData, access_token})
        if(res.error){

          <div class="alert alert-danger" role="alert">
            {res.error}
          </div>
        }
        if(res.data){
          console.log(res.data);
          refetch();
        }

    setReview("")
    setRating(0)
    }
  return (
    <>
        <Box
            sx={{
                '& > legend': { mt: 5 ,width: 500,
                    maxWidth: '100%',},

            }}
        >
      <Typography component="legend"><h3 className='ms-5'>Review and Rate the Product </h3></Typography>
      <Rating
      className='me-5'
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {

          setRating(newValue);
        }}
      />
        <TextField
            fullWidth
            label="Add Review"
            id="fullWidth"
            value={review}
            onChange={onReviewChange}
        />
        <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={addReview}
        >
            Add Review
        </button>

      </Box>

    </>
  )
}

export default AddReview
