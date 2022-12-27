import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';


// action creator
export const postsFetch = createAsyncThunk(
  "posts/postsFetch",
  async (_, { rejectWithValue }) => {
    // console.log(user)

    try {
      const { data } = await axios.get('/api/posts');
      console.log(data)
      return data;
     
    } catch (error) {
      console.log(error);
      // return rejectWithValue(error.response.data)
      return rejectWithValue("an error occurred")
    }
  }
);



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
    clearPosts(state, action) {
      state.posts = [],
      state.loading = false,
      state.error = null,
      state.count = null
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(postsFetch.pending, (state, action) => {
      state.loading = 'pending'
    })
    .addCase(postsFetch.fulfilled, (state, action) => {
      state.posts = action.payload
      state.loading = 'success'
    })
    .addCase(postsFetch.rejected, (state, action) => {
      state.loading = 'rejected'
      state.error = action.payload
    })
  }

  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       ...action.payload.posts,
  //     };
  //   },

  //   [postsFetch.pending]: (state, action) => {
  //     state.loading = 'pending'
  //   },
  //   [postsFetch.fulfilled]: (state, action) => {
  //     state.posts = action.payload
  //     state.loading = 'success'
  //   },
  //   [postsFetch.rejected]: (state, action) => {
  //     state.loading = 'rejected'
  //     state.error = action.payload
  //   }
  // }

})


export const { clearPosts } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;

export default postsSlice.reducer;