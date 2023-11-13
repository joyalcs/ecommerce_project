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
  import { useAddOrderItemMutation } from '../services/order/orderApi';
  import useRazorpay from "react-razorpay";
  import { useParams } from 'react-router-dom';
  const CheckoutPage = () => {
    const [radioValue, setRadiovalue] = useState("");
    const [addOrderItem] = useAddOrderItemMutation();
    const navigate = useNavigate();
    const [Razorpay] = useRazorpay();
    const { access_token } = getToken();
    const {oid} = useParams();
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

    const complete_order = (paymentID, orderID, signature)=>{
      axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/api/transaction/',
          data: {
              "payment_id": paymentID,
              "order_id": orderID,
              "signature": signature,
              "amount": amount
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
          // Move the actualData creation inside the try block
      const actualData = {
        orderItems: orderItems,
        shippingAddress: radioValue,
        totalPrice: cartState.cartTotalAmount,

      };
      let order_id;

      // Assuming the addOrderItem function returns a Promise
        const res = await addOrderItem({ actualData, access_token });

        if (res.error) {
          console.log(res.error);
        }

        if (res.data) {
          console.log(res.data);
          order_id = res.data.order_id;
        }
        // const order_id = res.data.order_id
        ////////////////////////////////////////////////////
      try {
        console.log(order_id);
        // console.log(process.env.REACT_APP_RAZORPAY_KEY_ID)
        const options = {
          key: "rzp_test_BoC9HAQOUQZLs3", // Enter the Key ID generated from the Dashboard
          name: "eShop",
          description: "Test Transaction",
          image: "https://example.com/your_logo",
          order_id: order_id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
          handler: function (response) {

            //complete order
            complete_order(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
            )
          },
          prefill: {
            name: "joyal",
            email: "joyalcs22@gmail.com",
            contact: "7034130100",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
          rzp1.open();
      } catch (error) {
        console.log(error)
      }

      // .catch((error)=>{
      //   console.log(error);
      // })
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
