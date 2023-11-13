import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import HomeCarousel from '../components/HomeCarousel'
import Products from '../components/Products'
import Category from '../components/Category'

const HomePage = () => {
  return (
    <div>
        <Header/>
        <HomeCarousel/>
        <Category/>
        <Products/>
        <Footer/>
    </div>
  )
}

export default HomePage
