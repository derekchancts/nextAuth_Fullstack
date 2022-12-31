import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

// import { parseCookies } from "nookies";
// import { useSession } from "next-auth/react";
import axios from 'axios';


// const cookies = parseCookies();
// const user = cookies?.user ? JSON.parse(cookies.user) : "" 


// action creator
export const authFetch = createAsyncThunk(
  "auth/authFetch",
  async (user, { rejectWithValue }) => {
    // console.log(user)

    try {
      const { data } = await axios.post('/api/user/profile', {email: user.email} );
      // const { data } = await axios.post('http://localhost:3000/api/user/profile', {email: user.email} );
      // console.log(data)
      return data;
     
    } catch (error) {
      console.log(error);
      // return rejectWithValue(error.response.data)
      return rejectWithValue("an error occurred")
    }
  }
);


// Initial state
const initialState = {
  //currentUser: user,
  currentUser: null,
  loading: false,
  error: null,
};


// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload
    },
    logoutUser(state, action) {
      // state = initialState
      state.currentUser = null
      state.loading = false
      state.error = null
    },
  },

    //! Special reducer for hydrating the state. Special case for next-redux-wrapper
    extraReducers: (builder) => {
      builder
    .addCase(authFetch.pending, (state, action) => {
      state.loading = 'pending'
    })
    .addCase(authFetch.fulfilled, (state, action) => {
      state.currentUser = action.payload
      state.loading = 'success'
    })
    .addCase(authFetch.rejected, (state, action) => {
      state.loading = 'rejected'
      state.error = action.payload
    })
    }

    // extraReducers: {
    //   [HYDRATE]: (state, action) => {
    //     return {
    //       ...state,
    //       ...action.payload.auth,
    //     };
    //   },

    //   [authFetch.pending]: (state, action) => {
    //     state.loading = 'pending'
    //   },
    //   [authFetch.fulfilled]: (state, action) => {
    //     state.currentUser = action.payload
    //     state.loading = 'success'
    //   },
    //   [authFetch.rejected]: (state, action) => {
    //     state.loading = 'rejected'
    //     state.error = action.payload
    //   }
    // }

 
});


export const { setUser, logoutUser } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectUserLoading = (state) => state.auth.loading;
export const selectUserError = (state) => state.auth.error;

export default authSlice.reducer;