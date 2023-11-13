import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AddressApi= createApi({
    reducerPath: 'AddressApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/api/'}),
    tagTypes: ['ShippingAddress'],
    endpoints: (builder) => ({
        addShippingAddress: builder.mutation({
            query: ({actualData, access_token}) => {
                return {
                    url: 'shippingaddress/',
                    method: 'POST',
                    body: actualData,
                    headers: {
                        'authorization': `Bearer ${access_token}`,
                    }
                }
            },
        }),
        showShippingAddress: builder.query({
            query: (access_token) => {
                return {
                    url: 'shippingaddress/',
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${access_token}`
                    }
                }
            }
        }),
    })
})

export const {  useAddShippingAddressMutation,
                useShowShippingAddressQuery} = AddressApi;
