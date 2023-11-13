import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CartApi = createApi({
    reducerPath: 'CartApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/api/'}),
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        addToCart: builder.mutation({
            query: (cart)=> {
                return{
                    url: 'carts/',
                    method: 'POST',
                    body: cart,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            }
        }),
    })
})

export const {useAddToCartMutation} = CartApi;
