import React, {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {AiOutlineSearch, } from 'react-icons/ai'
import {FaShoppingCart} from 'react-icons/fa'
import {BiSolidUser} from 'react-icons/bi'
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { unSetUserToken } from '../features/User/authSlice';
import { removeToken, getToken } from '../services/localStorageService';
import { newCart } from '../features/Cart/CartSlice';
import { toast } from 'react-toastify';
import { useGetUserQuery } from '../services/user/userAuthApi';
import { setUserInfo, unsetUserInfo } from '../features/User/userSlice';
import "./styles/Header.css"


const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {access_token} = getToken();
    const {data, isSuccess} = useGetUserQuery(access_token);
    console.log(data);
    const handleLogout=()=>{
      dispatch(unsetUserInfo({ username: "", email: "" }))
      dispatch(unSetUserToken({access_token:null}))
      dispatch(newCart())
      removeToken()
      toast.info('Logged Out', {
        position: 'bottom-left',
      });
      navigate('/signin');

    }
    const [userData, setUserData] = useState({
      email: "",
      username: ""
    })
    useEffect(() => {
      if (data && isSuccess) {
        setUserData({
          email: data.email,
          username: data.username,
        })
      }
    }, [data, isSuccess])
    useEffect(() => {
      if (data && isSuccess) {
        dispatch(setUserInfo({
          email: data.email,
          username: data.username
        }))
      }
    }, [data, isSuccess, dispatch])
    return (
        <Container fluid>
          <Navbar
            expand="lg"
            className="bg-body-tertiary w-100 px-5 d-flex"
            fixed='top'
            collapseOnSelect
            >
          <Container fluid>
            <Navbar.Brand href="#">eShop</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
              <Form className="d-flex mx-5 px-5">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success"><AiOutlineSearch/></Button>
              </Form>
              {access_token && data ?
                <><Nav.Link className='navItem1 ' href="#">
                    <Link className='bg-white text-dark ms-3 text-decoration-none' to="/cart">Cart <FaShoppingCart /></Link>
                  </Nav.Link><NavDropdown className='ms-4' title={data.username} id="navbarScrollingDropdown">
                      <NavDropdown.Item><Button className='bg-white text-dark  btn-outline-light' onClick={handleLogout}>Logout</Button></NavDropdown.Item>
                      <NavDropdown.Item><Link className='bg-white text-dark ms-3 text-decoration-none' to="">Orders</Link></NavDropdown.Item>
                      <NavDropdown.Item><Link to="/change_password" className='bg-white text-dark ms-3 text-decoration-none' >Change Password</Link></NavDropdown.Item>
                    </NavDropdown></>
              :

                <Nav.Link className='navItem1' href="#">
                  <Link className='bg-white text-dark ms-3 text-decoration-none' to="/signin">Login <BiSolidUser/></Link>
                </Nav.Link>
              }
              </Nav>

            </Navbar.Collapse>
          </Container>
        </Navbar>
        </Container>
      );
}

export default Header
