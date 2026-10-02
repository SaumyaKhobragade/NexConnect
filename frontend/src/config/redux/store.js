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

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;
