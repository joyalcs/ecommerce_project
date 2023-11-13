import {createApi,fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


export const ProductApi = createApi({
  reducerPath: 'ProductApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/api/'}),
  tagTypes : ['Products'],
  endpoints : (builder) => ({
    getProducts: builder.query({
      query: ()=> 'products/'
    }),
    getProduct: builder.query({
      query: (pid) => `products/${pid}/`
    })
  })
})

export const { useGetProductsQuery, useGetProductQuery} = ProductApi;
