import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

import Rating from "./Rating"


export const ProductCard = ({product}) => {
    const cardStyle = {
        height : '28rem',
    }
    const linkStyle = {
        textDecoration: 'none',
      };

     const imageStyle = {
        width: '15 rem',
        // height: 'auto',
    };
  return (
    <Card className="my-3 p-3 rounded " style={cardStyle}>
        <Link to={`/products/${product.pid}`} style={linkStyle}>
            <Card.Img src={product.image} style={imageStyle} />
            <Card.Body className='text-dark'>
                <Card.Title as="div">
                    <strong>{product.name}</strong>
                </Card.Title>
                <Card.Text as="div">
                    <div className="my-3">
                        <Rating value={product.rating} text={`${product.numReviews} reviews`}  />
                    </div>
                </Card.Text>
                <Card.Text as="h5">
                    Rs.{product.price}
                </Card.Text>
            </Card.Body>
        </Link>
    </Card>
  )
}

