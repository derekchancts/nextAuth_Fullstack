import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axios from 'axios';
import { parseCookies } from "nookies"

const cookies = parseCookies();


// action creator
//! Fetch posts
export const postsFetch = createAsyncThunk(
  "posts/postsFetch",
  async (_, { rejectWithValue }) => {
    // console.log(user)

    try {
      const { data } = await axios.get('/api/posts');
      // console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      // return rejectWithValue(error.response.data)
      return rejectWithValue("an error occurred")
    }
  }
);


//! Add a new post
export const postAdd = createAsyncThunk(
  "posts/postAdd",
  async (postData, { rejectWithValue }) => {

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    }

    try {
      // const { data } = await axios.post('/api/posts', { postData }, config);
      const { data } = await axios.post('/api/posts/create', { postData }, config);
      console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      // return rejectWithValue(error.response.data)
      // return rejectWithValue("an error occurred")
      const payload = error.response && error.response.data.error ? error.response.data.error : error.message;
      return rejectWithValue(payload)
    }
  }
);


//! update an existing post
export const postUpdate = createAsyncThunk(
  "posts/postUpdate",
  async (post, { rejectWithValue }) => {
    const { id, ...postData } = post;
    // console.log(id) 

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    }

    try {
      const { data } = await axios.put(`/api/posts/${id}`, { ...postData }, config);
      console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      // return rejectWithValue(error.response.data)
      // return rejectWithValue("an error occurred")
      const payload = error.response && error.response.data.error ? error.response.data.error : error.message;
      return rejectWithValue(payload)
    }
  }
);


//! delete a post
export const postDelete = createAsyncThunk(
  "posts/postDelete",
  async (id, { rejectWithValue }) => {
    // console.log('id' + id)

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    }

    try {
      const { data } = await axios.delete(`/api/posts/${id}`, config);
      console.log(data)
      return data;
    } catch (error) {
      // console.log(error);
      // console.log(error.response.data.error);
      // return rejectWithValue(error.response.data.error)

      const payload = error.response && error.response.data.error ? error.response.data.error : error.message;
      return rejectWithValue(payload)

      // return rejectWithValue("an error occurred")
      // throw Error(error);
    }
  }
);


//! like a post
export const postLike = createAsyncThunk(
  "posts/postLike",
  async (id, { rejectWithValue }) => {
    console.log('id' + id)

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.token}`,
      },
    }

    try {
      const { data } = await axios.patch(`/api/posts/${id}`, {}, config);
      console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      // return rejectWithValue(error.response.data)
      // return rejectWithValue("an error occurred")
      const payload = error.response && error.response.data.error ? error.response.data.error : error.message;
      return rejectWithValue(payload)
    }
  }
);


//! pagination
export const postsPagination = createAsyncThunk(
  "posts/postsPagination",
  async (number, { rejectWithValue }) => {
    // console.log(number)
    // console.log(typeof(number))

    try {
      const { data } = await axios.get(`/api/posts/paginate/${number}`)
      // console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      // return rejectWithValue(error.response.data)
      // return rejectWithValue("an error occurred")
      const payload = error.response && error.response.data.error ? error.response.data.error : error.message;
      return rejectWithValue(payload)
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
    },
    resetStatus(state, action) {
      state.loading = false,
      state.error = null
    },
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

    .addCase(postAdd.pending, (state, action) => {
      state.loading = 'pending'
    })
    .addCase(postAdd.fulfilled, (state, action) => {
      // state.posts.push(action.payload)   
      state.posts.unshift(action.payload)   
      state.loading = 'success'
    })
    .addCase(postAdd.rejected, (state, action) => {
      state.loading = 'rejected'
      state.error = action.payload
    })

    .addCase(postDelete.pending, (state, action) => {
      state.loading = 'pending'
    })
    .addCase(postDelete.fulfilled, (state, action) => {
      // let index = state.posts.findIndex(({ _id }) => _id === action.payload.deletedPost._id);
      // state.posts.splice(index, 1);
      const updatedPosts = state.posts.filter(post => post._id !== action.payload.deletedPost._id)
      state.posts = updatedPosts
      state.loading = 'success'
    })
    .addCase(postDelete.rejected, (state, action) => {
      state.loading = 'rejected'
      state.error = action.payload
      // state.error = action.error.message;
    })

    .addCase(postUpdate.pending, (state, action) => {
      state.loading = 'pending'
    })
    .addCase(postUpdate.fulfilled, (state, action) => {
      let index = state.posts.findIndex((post) => post._id === action.payload.updatedPost._id);
      state.posts[index] = action.payload.updatedPost;
      state.loading = 'success'
    })
    .addCase(postUpdate.rejected, (state, action) => {
      state.loading = 'rejected'
      state.error = action.payload
    })

    .addCase(postLike.pending, (state, action) => {
      state.loading = 'pending'
    })
    .addCase(postLike.fulfilled, (state, action) => {
      let index = state.posts.findIndex((post) => post._id === action.payload.updatedPost._id);
      state.posts[index] = action.payload.updatedPost;
      state.loading = 'success'
    })
    .addCase(postLike.rejected, (state, action) => {
      state.loading = 'rejected'
      state.error = action.payload
    })

    .addCase(postsPagination.pending, (state, action) => {
      state.loading = 'pending'
    })
    .addCase(postsPagination.fulfilled, (state, action) => {
      state.posts = action.payload.posts
      state.count = action.payload.count
      state.loading = 'success'
    })
    .addCase(postsPagination.rejected, (state, action) => {
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


export const { clearPosts, resetStatus } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectPostsCount = (state) => state.posts.count;

export default postsSlice.reducer;