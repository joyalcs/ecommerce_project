  import React,{useEffect, useState} from 'react';
  import Grid from '@mui/material/Grid';
  import FormControl from '@mui/material/FormControl';
  import FormLabel from '@mui/material/FormLabel';
  import RadioGroup from '@mui/material/RadioGroup';
  import FormControlLabel from '@mui/material/FormControlLabel';
  import Radio from '@mui/material/Radio';
  import { useShowShippingAddressQuery } from '../services/address/AddressApi';
  import Loader from '../components/Loader';
  import Header from '../components/Header';
  import Message from '../components/Message';
  import { getToken } from '../services/localStorageService';
  import { useNavigate } from 'react-router-dom';
  import Card from 'react-bootstrap/Card';
  import { Button } from 'react-bootstrap';
  import { useSelector } from 'react-redux';
  import { useDispatch } from 'react-redux';
  import {getTotal} from '../features/Cart/CartSlice';
  import { useAddOrderItemMutation } from '../services/order/OrderApi';
  import useRazorpay from "react-razorpay";
  import axios from 'axios';
  import { newCart } from '../features/Cart/CartSlice';
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
  const CheckoutPage = () => {
    const [radioValue, setRadiovalue] = useState("");
    const [addOrderItem] = useAddOrderItemMutation();
    const navigate = useNavigate();
    const [Razorpay] = useRazorpay();
    const { access_token } = getToken();
    // const dispatch = useDispatch();


    const { data: addresses, isLoading, isSuccess, isError, error } = useShowShippingAddressQuery(
      access_token
    );
    const changeSelection = (e) => {
      setRadiovalue(e.target.value);
    };
    let addressData;
    if (isLoading) {
      addressData = <Loader />;
    } else if (isSuccess) {
      addressData = addresses.map((address) => (
        <FormControlLabel
          className="border p-3 border-dark m-3"
          key={address.shid}
          value={address.shid}
          control={<Radio />}
          label={`${address.address}, ${address.city}, ${address.postalCode}, ${address.country}, ${address.phone_number}`}
          onChange={changeSelection}
        />
      ));
    } else if (isError) {
      const errorMessage = error ? error.message : "An error occurred.";
      addressData = <Message variant="danger">{errorMessage}</Message>;
    }

    const handleClick = (e) => {
      navigate("/shippingaddress");
    };

    const cartState = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getTotal());
    }, [cartState, dispatch]);

    const complete_order = (paymentID, orderID, signature,amount,order)=>{
      axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/api/transaction/',
          data: {
              "payment_id": paymentID,
              "order_id": orderID,
              "signature": signature,
              "amount": amount,
              "order": order

          }
      })
      .then((response)=>{
          console.log(response.data);
      })
      .catch((error)=>{
          console.log(error.response.data);
      })
  }
    const makeOrder = async (e) => {

      e.preventDefault();
      const orderItems = cartState.cartItems.map((item) => ({
        product: {
          pid: item.product.pid,
          name: item.product.name,
          image: item.product.image,
        },
        cartQuantity: item.cartQuantity,
        price: item.price,
      }));
      const actualData = {
        orderItems: orderItems,
        shippingAddress: radioValue,
        totalPrice: cartState.cartTotalAmount,

      };
      let order;

        const res = await addOrderItem({ actualData, access_token });

        if (res.error) {
          console.log(res.error);
        }

        if (res.data) {
          console.log(res.data);
          order = res.data.oid;
        }
      ////////////////////////////////////////////////////
      const sdk = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      if (!sdk) {
        alert('Failure loading the Razorpay SDK. PLease make sure you are connected to the internet')
        return
      }
      const orderData = await axios.post('http://127.0.0.1:8000/api/payment/', {
        amount: cartState.cartTotalAmount*100
      })
      const { amount, currency, order_id } = orderData.data
      const options = {
        key: "rzp_test_BoC9HAQOUQZLs3", // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "Test Company",
        description: "Test Transaction",
        image:"https://example.com/your_logo" ,
        order_id: order_id,
        handler: async function (response) {
            const razorpay_paymentId = response.razorpay_payment_id
            const razorpay_orderId = response.razorpay_order_id
            const razorpay_signature = response.razorpay_signature

            const res = await axios.post('http://127.0.0.1:8000/api/verify/', {
              order,
              amount,
              razorpay_paymentId,
              razorpay_orderId,
              razorpay_signature
            })
            console.log( response.razorpay_payment_id);
            console.log( response.razorpay_order_id);
            console.log(response.razorpay_signature);
            console.log(cartState.cartTotalAmount)
            console.log(order)
            alert("Payment Sucessfully Completed")
        },
        prefill: {
            name: "Joyal",
            email: "joyalcs22@gmail.com",
            contact: "7034130100",
        },
        theme: {
            color: "#61dafb",
        },
    };
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    dispatch(newCart());
    };

  return (
        <>
        <Header/>
        <Grid container spacing={2} className='mt-5 '>
          <Grid item md={8}>
            <FormControl component="fieldset">
              <FormLabel component="legend"><h3>Your Addresses</h3></FormLabel>
              <RadioGroup
                aria-label="addresses"
                name="radio-buttons-group"
              >{addressData &&
                addressData ? addressData: <h4>Currently, you don't have any address. Please add an address.</h4>
              }
              </RadioGroup>
            </FormControl>
            <button className='ms-5 mt-1  ' onClick={handleClick}>Add Address</button>
          </Grid>
          <Grid item md={4} className=''>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
                <Card.Text>
                  <span>Price({cartState.cartItems.length} items)</span> : ₹ {cartState.cartTotalAmount}<br/>
                  <span>Delivery Charges</span> : <span className='text-success'>Free</span>
                  <hr></hr>
                  <span>Total Payable</span> : ₹ {cartState.cartTotalAmount}
                </Card.Text>
            </Card.Body>
          </Card>
          <Card style={{ width: '18rem'}} className='mt-4'>
            <Card.Body>
                <Card.Text>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label"><h5>Payment Method</h5></FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="cashOnDelivery" control={<Radio />} label="Cash On Delivery" />
                    <FormControlLabel value="card" control={<Radio />} label="Card Payment" />
                  </RadioGroup>
                </FormControl>
                </Card.Text>
                <Button onClick={makeOrder} className='mt-2 px-3'>Proceed</Button>

            </Card.Body>
          </Card>
          </Grid>
        </Grid>
        </>
      );
    };

    export default CheckoutPage;
