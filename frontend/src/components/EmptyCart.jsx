import React from 'react'
import { useNavigate } from 'react-router-dom'


const EmptyCart = () => {
    const navigate = useNavigate();
  return (
    <div className='m-auto'>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Back to Add Some Products
        </button>
    </div>
  )
}

export default EmptyCart
