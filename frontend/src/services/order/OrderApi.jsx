import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const OrderApi = createApi({
    reducerPath: 'OrderApi',
    baseQuery: fetchBaseQuery({baseUrl:'http://localhost:8000/api/'}),
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        addOrderItem: builder.mutation({
            query: ({actualData, access_token}) => {
                return {
                    url: 'order/',
                    method: 'POST',
                    body: JSON.stringify(actualData),
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${access_token}`,
                    }

                }
            }
        })
    })
})
export const {useAddOrderItemMutation} = OrderApi;
