import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../Utils/axios";

const initialState = {
    categories: [],
    status: 'idle',
    error: null,
}

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () =>{
    try {
        const response = await axios.get('api/categories/')
        console.log(response.data);
        return [...response.data]
    } catch (error) {
        return error.message
    }
})

export const fetchCategory = createAsyncThunk('category/fetchCategory', async () =>{
    try {
        const response = await axios.get('api/categories/:cid');
        console.log(response.data)
        return response.data
    } catch (error) {
        return error.message
    }
})

const CategorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchCategories.pending, (state,action) => {
          state.status = 'loading';
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.categories = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchCategory.fulfilled, (state, action) =>{
          if(!action.payload?.cid){
              console.log("not found");
              console.log(action.payload);
          }
          const {cid} = action.payload
          const category = state.categories.filter(category=> category.cid === cid)
          state.categories = [...state.categories, action.payload]
        })
      }
  });



  export const selectCategories = (state) => state.categories.categories;
  export const selectStatus = (state) => state.categories.status;

  export const selectCategoryById = (state, pid) =>
      state.categories.categories.find(category => category.cid === cid)

  export default CategorySlice.reducer;
