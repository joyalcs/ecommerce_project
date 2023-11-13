import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../features/Cart/CartSlice";

function CartItemCard({ item }) {
  const [product, setProduct] = useState(item.product);
  const dispatch = useDispatch();

  const increaseItemQuantity = () => {
    dispatch(increaseQuantity(item.product));
  };

  const decreaseItemQuantity = () => {
    dispatch(decreaseQuantity(item.product));
  };

  const removeItem = () => {
    dispatch(removeFromCart(item.product));
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/products/${item.product.pid}`).then((res) => {
      setProduct({ ...res.data, quantity: item.quantity });
    });
  }, [item.product]);

  return (
    <Card className="my-2">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <Link
              to={`/products/${product.pid}`}
              className="text-dark text-decoration-none fs-5"
            >
              {product.title ? product.title.slice(0, 20) : ""}...
            </Link>
          </div>
          <div className="d-flex w-100 justify-content-center">
            <button
              className="btn btn-sm btn-dark fs-6 me-3 text-center"
              onClick={decreaseItemQuantity}
            >
              <FaMinus />
            </button>
            <span className="fs-4">{item.quantity}</span>
            <button
              className="btn btn-sm btn-dark fs-6 ms-3 text-center"
              onClick={increaseItemQuantity}
            >
              <FaPlus />
            </button>
          </div>
          <div className="w-100 text-center">
            <span className="fs-5">
              ${product.price ? (product.price * item.quantity).toFixed(2) : ""}
            </span>
          </div>
          <div className="w-100 text-center">
            <Button variant="danger" onClick={removeItem}>
              Remove
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CartItemCard;
