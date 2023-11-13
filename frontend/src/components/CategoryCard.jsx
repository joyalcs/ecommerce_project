import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

const CategoryCard = ({category}) => {
  const linkStyle = {
    textDecoration: 'none',
  };
  return (
    <Card className="my-3 p-3 rounded ">
        <Link to={`/categories/${category.cid}`} style={linkStyle}>
            <Card.Img src={category.image} />
            <Card.Body className='text-dark'>
                <Card.Title as="div">
                    <strong>{category.name}</strong>
                </Card.Title>
            </Card.Body>
        </Link>
    </Card>
  )
}

export default CategoryCard
