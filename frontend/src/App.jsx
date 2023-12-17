import './App.css'
import { Navigate, Route, Routes } from "react-router-dom"
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css"

import { useEffect } from 'react';
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from './pages/RegisterPage';
import NotFound from "./components/NotFound";
import Container from 'react-bootstrap/esm/Container';
import SinglePage from './pages/SinglePage';
import CategoryPage from './pages/CategoryPage';
import  CartPage  from './pages/CartPage';
import Layout from './components/Layout';
import { useSelector } from 'react-redux';
import ChangePassword from './pages/ChangePassword';
import ResetEmailPage from './pages/ResetEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AddressPage from './pages/AddressPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import PrivateRoutes from './Utils/privateRoutes';
import { ProductsPage } from './pages/ProductsPage';
function App() {
  const {access_token} = useSelector(state => state.auth)
  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);
  return (
    <>
      <Container fluid>
        <Routes>
          <Route path="/" exact element={access_token?<Layout/>: <Navigate to="/signin"/>}/>
          <Route index element={<HomePage/>}/>
          <Route path="/signin" element={!access_token ?<LoginPage/>: <Navigate to="/"/>}/>
          <Route path="/signup" element={<RegisterPage/>}/>
          <Route path="/send_password_reset_email" element={<ResetEmailPage/>}/>
          <Route path="api/users/reset/:uid/:token" element={<ResetPasswordPage/>}/>
          <Route path="*" element={<NotFound/>}/>
          <Route element={<PrivateRoutes/>}>
            <Route path="/products/:pid" element={<SinglePage/>}/>
            <Route path="/categories/:cid" element={<CategoryPage/>}/>
            <Route path="cart" element={<CartPage/>}/>
            <Route path="/change_password" element={<ChangePassword/>}/>
            <Route path="/shippingaddress" element={<AddressPage/>}/>
            <Route path="/checkout" element={<CheckoutPage/>}/>
            <Route path="/orders" element={<OrdersPage/>}/>
            <Route path="/products-filter" element={<ProductsPage/>}/>
          </Route>
        </Routes>
        <ToastContainer/>
      </Container>
    </>
  )
}

export default App
