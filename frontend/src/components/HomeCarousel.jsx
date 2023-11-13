import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import sunglassImage from "../assets/Images/sunglass.jpg";
import capImage from "../assets/Images/caps.jpg";
import clockImage from "../assets/Images/clock.jpg"
import Container from 'react-bootstrap/esm/Container';

const HomeCarousel = () => {
    return (
        <Container fluid>
          <Carousel>
          <Carousel.Item>
            <img src={sunglassImage} height={500} width={1290} className='img-fluid' alt="First Slide" />
            <Carousel.Caption>
              <h3>Sunglass</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={clockImage} height={500} width={1290} className='img-fluid' alt="First Slide" />
            <Carousel.Caption>
              <h3>Watch</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={capImage} height={500} width={1290} className='img-fluid' alt="First Slide" />
            <Carousel.Caption>
              <h3>Caps</h3>

            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        </Container>
      );
}

export default HomeCarousel
