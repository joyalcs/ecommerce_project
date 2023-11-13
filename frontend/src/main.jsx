import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { store } from './app/store.jsx'
import { Provider } from 'react-redux'
// import { fetchProducts } from './features/Product/ProductSlice.jsx'
import { fetchCategories } from './features/Category/CategorySlice.jsx'

// store.dispatch(fetchProducts())
store.dispatch(fetchCategories())

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
  </>,
)
