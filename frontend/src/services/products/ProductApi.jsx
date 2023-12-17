import {createApi,fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


export const ProductApi = createApi({
  reducerPath: 'ProductApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/api/'}),
  tagTypes : ['Products'],
  endpoints : (builder) => ({
    getProducts: builder.query({
      query: (builder)=> 'products/'
    }),
    getProduct: builder.query({
      query: (pid) => `products/${pid}/`
    }),
    getSearchProduct: builder.query({
      query: ({searchTxt})=> `products/?search=${searchTxt}`
    }),
  })
})

export const { useGetProductsQuery, useGetProductQuery, useGetSearchProductQuery} = ProductApi;
