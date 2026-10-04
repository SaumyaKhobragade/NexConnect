/**
 *
 * Steps For State Management Using Redux Toolkit
 * Submit Action
 * Handle Action in Reducer
 * Register Reducer in Store
 *
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
    },
});

export default store;
