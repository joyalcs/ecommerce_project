import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { useGetCategoryQuery } from '../services/categories/CategoryApi';
import Loader from '../components/Loader';
import { Row, Col } from 'react-bootstrap';
import { ProductCard } from '../components/ProductCard';
import Message from '../components/Message';

const CategoryPage = () => {
    const {cid} = useParams();
    const { data: products, isLoading, isSuccess, isError, error } = useGetCategoryQuery(cid);
    let categoryProductData;

    if (isLoading) {
      categoryProductData = <Loader />;
    } else if (isSuccess) {
      categoryProductData = products.map((product) => (
        <Col key={product.pid} sm={12} md={6} lg={4} xl={3}>
          <ProductCard product={product} />
        </Col>
      ));
    } else if (isError) {
      const errorMessage = error ? error.message : 'An error occurred.';
      categoryProductData = <Message variant="danger">{errorMessage}</Message>;
    }

  return (
    <div>
      <Row>{categoryProductData}</Row>
    </div>
  )
}

export default CategoryPage
