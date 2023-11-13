import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (

      <div className="d-flex m-auto align-items-center m-auto vh-100 text-center" >
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead">
                    The page you’re looking for doesn’t exist.
                  </p>
                {/* <a href="index.html" class="btn btn-primary">Go Home</a> */}
                <Link className="btn btn-primary" to="/">Go Home</Link>
            </div>
        </div>

  )
}

export default NotFound
