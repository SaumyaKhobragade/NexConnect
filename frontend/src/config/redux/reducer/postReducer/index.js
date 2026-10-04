import { createSlice } from '@reduxjs/toolkit';
import { getAllPosts, createPost, deletePost, editPost } from '../../action/postAction';

const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    message: "",
    postId: "",
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.message = "Fetching posts...";
                state.isLoading = true;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.postFetched = true;
                state.posts = action.payload?.posts || []; 
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                if (action.payload?.post) {
                    state.posts = [action.payload.post, ...state.posts];
                }
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                // deletePost returns the postId
                state.posts = state.posts.filter(post => post._id !== action.payload);
            })
            .addCase(editPost.fulfilled, (state, action) => {
                const updatedPost = action.payload?.post || action.payload;
                const index = state.posts.findIndex(post => post._id === updatedPost._id);
                if (index !== -1) {
                    state.posts[index] = updatedPost;
                }
            });
    }
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
