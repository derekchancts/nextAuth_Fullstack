import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';


const initialState = {
  posts: [],
  loading: false,
  error: null,
  count: null
}


export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
  }
})


export default postsSlice.reducer;