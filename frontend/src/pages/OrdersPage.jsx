import React from 'react';
import Header from '../components/Header';
import { Row, Col, Image } from 'react-bootstrap';
import { getToken } from '../services/localStorageService';
import { useGetOrdersQuery } from '../services/order/orderApi';

const OrdersPage = () => {
  const { access_token } = getToken();
  const { data: orders, isSuccess, isError } = useGetOrdersQuery(access_token);
  console.log(isError);
  console.log(orders)

  return (
    <>
      <Header />
      <Row className='p-4 mt-5'>
        <Col md={3}>
          <strong>Product</strong>
        </Col>
        <Col md={2}>
          <strong>Price</strong>
        </Col>
        <Col md={3}>
          <strong>Quantity</strong>
        </Col>
        <Col md={2}>
          <strong>Total</strong>
        </Col>
        <Col md={2}>
          <strong>Delivery Status</strong>
        </Col>
      </Row>
        {orders &&
        orders.map((order) => (
          <Row key={order.oiid} className='p-4'>
            <Col md={3}>
                    <Image className='pe-2' src={'http://localhost:8000/' + order.image} alt={order.name} width='60' height='60' />
                    {order.name}
            </Col>
            <Col md={2}>{order.price}</Col>
            <Col md={3}>
              {order.qty}
            </Col>
            <Col md={2}>{order.qty*order.price}</Col>
            <Col md={2}>
                {order && order.order && order.order.isDelivered === false ? (
                    <p>Delivered </p>
                ) : (
                    <p>Delivered within one week</p>
                )}
            </Col>
          </Row>
        ))}
    </>
  );
};

export default OrdersPage;
