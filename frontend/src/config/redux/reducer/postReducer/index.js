import { createSlice } from '@reduxjs/toolkit';
import { getAllPosts, createPost, deletePost, editPost, likePost, unlikePost, addComment, getComments } from '../../action/postAction';

const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    message: "",
    postId: "",
    comments: [],
    commentsLoading: false,
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
                    state.posts[index] = { ...state.posts[index], ...updatedPost };
                }
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const { postId, userId } = action.payload;
                const post = state.posts.find(p => p._id === postId);
                if (post) {
                    if (!post.likes) post.likes = [];
                    if (!post.likes.includes(userId)) {
                        post.likes.push(userId);
                    }
                }
            })
            .addCase(unlikePost.fulfilled, (state, action) => {
                const { postId, userId } = action.payload;
                const post = state.posts.find(p => p._id === postId);
                if (post && post.likes) {
                    post.likes = post.likes.filter(id => id !== userId);
                }
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const { postId, comment } = action.payload;
                const post = state.posts.find(p => p._id === postId);
                if (post) {
                    post.commentsCount = (post.commentsCount || 0) + 1;
                }
                // Prepend the new comment to the current comments array
                state.comments = [comment, ...state.comments];
            })
            .addCase(getComments.pending, (state) => {
                state.commentsLoading = true;
                state.comments = [];
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.commentsLoading = false;
                state.comments = action.payload || [];
            })
            .addCase(getComments.rejected, (state) => {
                state.commentsLoading = false;
                state.comments = [];
            });
    }
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
