// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     email: '',
//     username: ''
// }

// export const userSlice = createSlice({
//     name: 'user_info',
//     initialState,
//     reducers: {
//       setUserInfo: (state, action) => {
//         state.email = action.payload.email
//         state.username = action.payload.username

//       },
//       unsetUserInfo: (state, action) => {
//         state.email = action.payload.email
//         state.username = action.payload.username

//       },
//     }
//   })

//   export const { setUserInfo, unsetUserInfo } = userSlice.actions

//   export default userSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: '',
  username: ''
}

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
    unsetUserInfo: (state) => {
      // Reset the user info to empty strings
      state.email = '';
      state.username = '';
    },
  }
})

export const { setUserInfo, unsetUserInfo } = userSlice.actions

export default userSlice.reducer
