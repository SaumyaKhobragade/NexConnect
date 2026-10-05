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

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return thunkAPI.rejectWithValue("No token found");
            }

            const response = await clientServer.get("/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getAllProfiles = createAsyncThunk(
    "user/getAllProfiles",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/api/users");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async (userId, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await clientServer.post("/api/connections/request", { receiverId: userId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
