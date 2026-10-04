import clientServer from "../../../index";
import { createAsyncThunk } from '@reduxjs/toolkit';

const getAllPosts = createAsyncThunk(
    'posts/getAllPosts',
    async (params, thunkAPI) => {
        try {
            const response = await clientServer.get('/api/posts');
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    });

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (postData, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const response = await clientServer.post('/api/posts', postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (postId, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            await clientServer.delete(`/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return thunkAPI.fulfillWithValue(postId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const editPost = createAsyncThunk(
    'posts/editPost',
    async ({ postId, updatedData }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const response = await clientServer.put(`/api/posts/${postId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export { getAllPosts };
