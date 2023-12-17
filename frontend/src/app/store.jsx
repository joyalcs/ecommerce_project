import { configureStore} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query'
import cartReducer from '../features/Cart/CartSlice';
import { userAuthApi } from '../services/user/userAuthApi'
import { ProductApi } from '../services/products/ProductApi';
import { CategoryApi } from '../services/categories/categoryApi';
import  authReducer  from '../features/User/authSlice';
import userReducer from '../features/User/userSlice';
import { AddressApi } from '../services/address/AddressApi';
import { OrderApi } from '../services/order/orderApi';
import { reviewApi } from '../services/Review/reviewApi';


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    user: userReducer,
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [CategoryApi.reducerPath]: CategoryApi.reducer,
    [AddressApi.reducerPath]: AddressApi.reducer,
    [OrderApi.reducerPath]: OrderApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(userAuthApi.middleware,
                                ProductApi.middleware,
                                CategoryApi.middleware,
                                AddressApi.middleware,
                                OrderApi.middleware,
                                reviewApi.middleware,
                              )
});

setupListeners(store.dispatch)
