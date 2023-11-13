import { createApi,  fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const userAuthApi = createApi({
    reducerPath: 'userAuthSlice',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000/api/'}),
    endpoints: (builder) => ({
        registerUser:builder.mutation({
            query:(user) =>{
                return {
                    url: 'users/register/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json',
                    }
                }
            }
        }),
        loginUser: builder.mutation({
            query:(user) =>{
                return{
                    url: 'token/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            }
        }),
        getUser: builder.query({
            query: (access_token) =>{
                return{
                    url: 'users/profile/',
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${access_token}`
                    }
                }
            }
        }),
        changePassword: builder.mutation({
            query: ({actualData, access_token}) => {
                return {
                    url: 'users/change_password/',
                    method: 'POST',
                    body: actualData,
                    headers: {
                        'authorization': `Bearer ${access_token}`,
                    }
                }
            }
        }),
        sendEmailResetPassword: builder.mutation({
            query: (user) => {
                return{
                    url: 'users/send_reset_password_email/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            }
        }),
        resetPasswordByEmail: builder.mutation({
            query: ({actualData,uid,token}) => {
                return {
                    url: `users/reset_password/${uid}/${token}/`,
                    method: 'POST',
                    body: actualData,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            }
        }),
    })
})
export const {  useRegisterUserMutation,
                useLoginUserMutation,
                useGetUserQuery,
                useChangePasswordMutation,
                useSendEmailResetPasswordMutation,
                useResetPasswordByEmailMutation
            } = userAuthApi
