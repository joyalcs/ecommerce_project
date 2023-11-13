import React from 'react';
import Loader from './Loader';
import { Row, Col } from 'react-bootstrap';
import { ProductCard } from './ProductCard';
import Message from './Message';
import { useGetProductsQuery } from '../services/products/ProductApi';

const Products = () => {
  const { data: products, isLoading, isSuccess, isError, error } = useGetProductsQuery();

  let productData;

  if (isLoading) {
    productData = <Loader />;
  } else if (isSuccess) {
    productData = products.map((product) => (
      <Col key={product.pid} sm={12} md={6} lg={4} xl={3}>
        <ProductCard product={product} />
      </Col>
    ));
  } else if (isError) {
    const errorMessage = error ? error.message : 'An error occurred.';
    productData = <Message variant="danger">{errorMessage}</Message>;
  }

  return (
    <div>
      <Row>{productData}</Row>
    </div>
  );
};

export default Products;
