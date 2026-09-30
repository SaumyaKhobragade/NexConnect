/**
 *
 * Steps For State Management Using Redux Toolkit
 * Submit Action
 * Handle Action in Reducer
 * Register Reducer in Store
 *
 */

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";

const store = configureStore({
    reducer: {},
});
