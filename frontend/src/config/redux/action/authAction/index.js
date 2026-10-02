import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const loginUser = createAsyncThunk(
    "user/login",
    async (userData, thunkAPI) => {
        try {
            const response = await clientServer.post("/api/auth/login", {
                email: userData.email,
                password: userData.password,
            });
            
            localStorage.setItem("token", response.data.token);

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/register",
    async (userData, thunkAPI) => {
        try {
            const response = await clientServer.post("/api/auth/register", {
                name: userData.name,
                username: userData.username,
                email: userData.email,
                password: userData.password,
            });

            localStorage.setItem("token", response.data.token);

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
