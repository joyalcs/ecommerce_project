import React from 'react';
import Rating from './Rating';
import moment from 'moment';

const ViewReviews = ({ review }) => {
  const formattedDate = moment(review.createdAt).format('DD/MM/YY HH:mm');

  return (
    <div className='card ' style={{width:600}}>
      <div className='card-body'>
        <Rating value={review.rating} /> {review.name}
        <span className='ms-2'>{formattedDate}</span>
        <p>{review.comment}</p>
      </div>
    </div>
  );
};

export default ViewReviews;
