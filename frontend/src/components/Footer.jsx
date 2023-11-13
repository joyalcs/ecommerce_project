import React from 'react';
import "./styles/Footer.css"
import Container from 'react-bootstrap/esm/Container';

const Footer = () => {
  return (
    <Container fluid>
      <div  className='footer'>
        <p> &copy; {new Date().getFullYear()} Copyright
        </p>
    </div>
    </Container>
  );
};

export default Footer;
