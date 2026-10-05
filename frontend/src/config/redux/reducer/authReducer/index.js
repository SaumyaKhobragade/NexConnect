import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser, getAllProfiles, sendConnectionRequest } from "../../action/authAction";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    allProfiles: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducer: {
        reset: () => initialState,
        handleLoginUser: (state, action) => {
            state.message = "Hello, user!";
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Logging in...";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.user = action.payload.user;
                state.message = "Login successful!";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Login failed!";
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering user...";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.user = action.payload.user;
                state.message = "Registration successful!";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Registration failed!";
            })
            .addCase(getAboutUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching user profile...";
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.profileFetched = true;
                state.user = action.payload.user;
                state.connections = action.payload.connections;
                state.connectionRequests = action.payload.connectionRequests;
                state.message = "User profile fetched successfully!";
            })
            .addCase(getAboutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || "Failed to fetch user profile!";
            })
            .addCase(getAllProfiles.fulfilled, (state, action) => {
                state.allProfiles = action.payload.profiles || [];
            })
            .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                alert(action.payload.message || "Connection request sent!");
            });
    },
});

export default authSlice.reducer;
