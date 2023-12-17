import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/api/'}),
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        addReviews: builder.mutation({
            query: ({reviewData,access_token}) => {
                return {
                    url: 'reviews/',
                    method: 'POST',
                    body: reviewData,
                    headers: {
                        'authorization': `Bearer ${access_token}`,
                    }
                }
            },
        }),
        showReviews: builder.query({
            query: ({access_token,pid}) => {
                return {
                    url: `${pid}/reviews/`,
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${access_token}`
                    }
                }
            }
        })
    })
})

export const { useAddReviewsMutation, useShowReviewsQuery } = reviewApi;
