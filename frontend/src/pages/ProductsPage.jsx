import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import { useGetSearchProductQuery } from '../services/products/ProductApi';
import { ProductCard } from '../components/ProductCard';
import Loader from '../components/Loader';

export const ProductsPage = () => {
  const [searchtxt, setSearchtxt] = useState('');
  const { data: products, isLoading, isSuccess, isError, error } = useGetSearchProductQuery({
    searchTxt: searchtxt,
  });

  // Trigger search on input change
  const handleSearchChange = (e) => {
    setSearchtxt(e.target.value);
  };

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
    // Assume Message component is available and properly styled
    productData = <Message variant="danger">{errorMessage}</Message>;
  }

  return (
    <div>
      <Header />
      <Row style={{ marginTop: '4rem' }}>
        <form className="form-inline">
          <input
            className="form-control mr-sm-2"
            style={{ width: '20rem', marginLeft: '10rem' }}
            type="search"
            placeholder="Search"
            aria-label="Search"
            id="search"
            value={searchtxt}
            onChange={handleSearchChange}
          />
        </form>
      </Row>
      <Row className="mt-3">{productData}</Row>
    </div>
  );
};
