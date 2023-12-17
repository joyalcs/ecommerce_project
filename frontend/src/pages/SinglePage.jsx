import React,  { useState, useEffect }from 'react';
import { Row, Col, Image, ListGroup, Button, Card} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Rating from '../components/Rating';
import Header from '../components/Header';
import {useDispatch } from 'react-redux';
import NotFound from '../components/NotFound';
import Loader from '../components/Loader';
import { addToCart } from '../features/Cart/CartSlice';
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useGetProductQuery } from '../services/products/ProductApi';
import { useShowReviewsQuery } from '../services/Review/reviewApi';
import AddReview from '../components/AddReview';
import ViewReviews from '../components/ViewReviews';
import { getToken } from '../services/localStorageService';
const SinglePage = () => {
  const [quantity, setQuantity] = useState(1)
  const { pid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {access_token} = getToken()
  const [review, setReview] = useState([]);

  const {
    data: product,
    isLoading,
    isSuccess,
    // isError,
    // error
  } = useGetProductQuery(pid);

  const {
    data: reviews,
    iserror,
    error
  } = useShowReviewsQuery({access_token,pid});
  useEffect(() => {
    if (reviews) {
      setReview(reviews);
    }
  }, [reviews]);
  // const increaseQuantity = (e) => {
  //   e.preventDefault();
  //   if (product.stock_count >= quantity){
  //   setQuantity(quantity + 1);
  //   }else{
  //     toast.error("Out of stock", {position:'bottom-left'})
  //   }  };

  // const decreaseQuantity = (e) => {
  //   e.preventDefault();
  //   if (quantity > 1) {
  //     setQuantity(quantity - 1);

  //   }
  // };

  const addToCartHandler = () =>{

    let item = {
      product:product,
      cartQuantity: quantity,
      name:product.name,
      pid: product.pid,
      image:product.image,
      price: product.price,
      stock_count: product.stock_count
    };
    dispatch(addToCart(item));
  };

  let content;
  if (isLoading) {
    content = <Loader/>
    return content;
  }

  if (!product) {
    return (
      <section>
        <NotFound />
      </section>
    );
  }
  let reviewsData;

  // if (Loading) {
  //   reviewsData = <Loader />;
  // } else if (Success) {
  reviewsData = reviews ? (
      reviews.map((review) => (
        <Col key={review.rid} sm={12} md={6} lg={4} xl={3}>
          <ViewReviews review={review} />
        </Col>
      ))
    ) : null;
    if (error) {
      reviewsData=
        <div className="alert alert-danger" role="alert">
          <p>You are already reviewed</p>
        </div>

    }
// console.log(reviewsData);
  return (
    <div>
      <Header />
      {content ? content : product ? (
        <div className='mt-5 pt-5'>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: ${product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.stock_count > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                    </Row>
                  </ListGroup.Item>
                  {/* {
                    product.stock_count > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>Qty</Col>
                          <Col xs='auto' className='me-5 pe-5'>

                          <button
                            className="btn btn-sm btn-dark fs-6 me-3 text-center"
                            onClick={decreaseQuantity}
                          >
                            <FaMinus />
                          </button>
                            <span className="fs-4">{quantity}</span>
                          <button
                            className="btn btn-sm btn-dark fs-6 ms-3 text-center"
                            onClick={increaseQuantity}
                          >
                           <FaPlus />
                          </button>

                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )
                  } */}
                  <ListGroup.Item className='mx-auto'>
                    <Button
                      onClick={()=>addToCartHandler(product)}
                      className='btn-block'
                      disabled={product.stock_count === 0}
                      type='button'
                    >
                      Add to cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
            <AddReview productId={product.pid}/>
            </Col>
            <Col md={6} className='mt-5'>
              <h4>Reviews and Ratings</h4>
                {reviewsData}
            </Col>
          </Row>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};



export default SinglePage;
