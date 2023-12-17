import React,{useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {AiOutlineArrowLeft} from "react-icons/ai"
import {Row, Col, Image} from "react-bootstrap"
import {MdDelete} from "react-icons/md"
import { decreaseCart, removeFromCart, clearCart,addToCart, getTotal } from '../features/Cart/CartSlice'
import { FaPlus, FaMinus } from "react-icons/fa";
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

export const CartPage = () => {
    const navigate = useNavigate();
    const cartState = useSelector(state => state.cart);
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getTotal());
    }, [cartState,dispatch])
    const handleCheckout = (e) =>{
        navigate("/checkout")
    }
  return (

    <div className='cart-container text-align-center'>
        <Header/>
        <h2 className='mt-5 p-3'>Shopping Cart</h2>
        {cartState.cartItems.length===0 ? (
            <div className='cart-empty '>
                <p>Your Cart is empty</p>
                <div className='shop'>
                    <Link to="/"><span><AiOutlineArrowLeft/>Go to Shopping</span></Link>
                </div>
            </div>
        ):(
            <>
            <Row className='p-4'>
                <Col md={3}>
                <strong >Product</strong>
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
                </Col>
            </Row>
                {cartState.cartItems && cartState.cartItems.map(cartItem =>(
                    <Row key={cartItem.pid} className='p-4'>
                        <Col md={3} >

                            <Image className='pe-2' src={cartItem.image } alt={cartItem.name} width="60" height="60"/>
                            {cartItem.name}
                        </Col>
                        <Col md={2}>
                            {cartItem.price}

                        </Col>
                        <Col md={3}>
                            <button
                                className="btn btn-sm btn-dark fs-6 me-3 text-center"
                                onClick={() => dispatch(decreaseCart(cartItem))}
                            >
                               <FaMinus />
                            </button>
                            <span className="fs-4">{cartItem.cartQuantity}</span>
                            <button
                                className="btn btn-sm btn-dark fs-6 ms-3 text-center"
                                onClick={() => dispatch(addToCart(cartItem))}
                            >
                                <FaPlus/>
                            </button>
                        </Col>
                        <Col md={2}>
                            {cartItem.price * cartItem.cartQuantity}
                        </Col>
                        <Col md={2}>
                            <MdDelete  onClick={() => dispatch(removeFromCart(cartItem))}/>
                        </Col>
                    </Row>

                ))}
                <Row>
                    <Col md={4}>
                        <button
                            className='btn btn-secondary'
                            onClick={() => dispatch(clearCart())}
                            >Remove all</button>
                    </Col>
                    <Col md={4}></Col>
                    <Col md={4}>
                        <span><strong>Subtotal: </strong></span>
                        <span className='amount'>Rs.{cartState.cartTotalAmount}</span>
                        <br/><button onClick={handleCheckout} className='btn btn-primary px-5 mt-4'>Checkout</button>
                    </Col>
                </Row>
            </>
        )}
    </div>
  )
}

export default CartPage;
