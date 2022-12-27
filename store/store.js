import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { postsSlice } from './postsSlice'
import { createWrapper } from "next-redux-wrapper";


const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [postsSlice.name]: postsSlice.reducer,
      // auth: authSlice.reducer,
      // [api.reducerPath]: (state, action) => action.type !== HYDRATE ? api.reducer(state, action) : {...state, ...(action.payload)[api.reducerPath]},
    },
    devTools: true,
  });



export const wrapper = createWrapper(makeStore);