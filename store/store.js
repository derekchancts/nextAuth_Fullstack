import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { postsSlice } from './postsSlice'
import { createWrapper } from "next-redux-wrapper";


const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      // auth: authSlice.reducer,
      [postsSlice.name]: postsSlice.reducer,
    },
    devTools: true,
  });



export const wrapper = createWrapper(makeStore);