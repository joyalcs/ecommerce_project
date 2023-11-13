import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CategoryApi = createApi({
    reducerPath: 'CategoryApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/api/'}),
    tagTypes: ['Categories'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: ()=> 'categories/'
        }),
        getCategory: builder.query({
            query: (cid) => `categories/${cid}/`
        }),
    })
})

export const {useGetCategoriesQuery, useGetCategoryQuery} = CategoryApi;
