import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

export const CartSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find((item) => item.pid === action.payload.pid );

      if (existingItem) {
        if (existingItem.cartQuantity >= existingItem.stock_count) {
          toast.error('Out of stock', {
            position: 'bottom-left',
          });
        } else {
          existingItem.cartQuantity += 1;
          toast.info('Increased Product Quantity', {
            position: 'bottom-left',
          });
        }
      } else {
        if (action.payload.stock_count > 0) {
          const tempProductItem = { ...action.payload, cartQuantity: 1};
          state.cartItems.push(tempProductItem);
          toast.success(`${action.payload.name} added to cart`, {
            position: 'bottom-left',
          });
        } else {
          toast.error('Out of stock', {
            position: 'bottom-left',
          });
        }
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    decreaseCart: (state, action) => {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.pid === action.payload.pid
      );
      if (existingItemIndex !== -1) {
        const existingItem = state.cartItems[existingItemIndex];

        if (existingItem && existingItem.cartQuantity > 1) {
          existingItem.cartQuantity -= 1;
          toast.info('Decreased product quantity', {
            position: 'bottom-left',
          });
        } else {
          state.cartItems = state.cartItems.filter((item) => item.pid !== action.payload.pid);
          toast.error('Product removed from cart', {
            position: 'bottom-left',
          });
        }

        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.pid !== action.payload.pid );
      toast.error('Product removed from cart', {
        position: 'bottom-left',
      });
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    getTotal: (state) => {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;
          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;
          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      total = parseFloat(total.toFixed(2));
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      toast.error('Cart cleared', { position: 'bottom-left' });
    },
    newCart: (state) => {
      state.cartItems = [];
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }
  },
});

export const cart = (state) => state.cart.cartItems;

export const { addToCart, decreaseCart, removeFromCart, getTotal, clearCart, newCart } = CartSlice.actions;

export default CartSlice.reducer;

