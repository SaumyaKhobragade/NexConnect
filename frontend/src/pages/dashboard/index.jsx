import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import UserLayout from "../../layout/UserLayout";
import { getAllPosts, createPost, deletePost, likePost, unlikePost, getComments, addComment } from "../../config/redux/action/postAction";
import { getAllProfiles } from "../../config/redux/action/authAction";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, loggedIn, allProfiles } = useSelector((state) => state.auth);
    const { posts, isLoading, comments, commentsLoading } = useSelector((state) => state.post || { posts: [], isLoading: false, comments: [], commentsLoading: false });
    
    const [postContent, setPostContent] = useState("");
    const [postMedia, setPostMedia] = useState(null);
    const [isCreateExpanded, setIsCreateExpanded] = useState(false);
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
    const [newCommentText, setNewCommentText] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!localStorage.getItem('token')) {
            router.push('/login');
        } else {
            dispatch(getAllPosts());
            dispatch(getAllProfiles());
        }
    }, [dispatch, router]);

    if (!isClient) return null; // Avoid SSR hydration mismatch
    
    // Completely block rendering if not logged in
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
        return null;
    }

    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!postContent.trim() && !postMedia) return;
        
        const formData = new FormData();
        formData.append("body", postContent);
        if (postMedia) {
            formData.append("media", postMedia);
        }

        dispatch(createPost(formData));
        setPostContent("");
        setPostMedia(null);
        setIsCreateExpanded(false);
    };

    const handleDeletePost = (postId) => {
        if (confirm("Are you sure you want to delete this post?")) {
            dispatch(deletePost(postId));
        }
    };

    return (
        <UserLayout>
            <div className="min-h-[calc(100vh-80px)] bg-zinc-50 flex justify-center py-8 px-4 md:px-0">
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[250px_1fr_250px] gap-8">
                    
                    {/* Left Sidebar */}
                    <div className="hidden md:flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-3 px-4 py-3 bg-zinc-100 rounded-xl font-medium text-zinc-900 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                Scroll
                            </button>
                            <Link href="/discover" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 rounded-xl font-medium text-zinc-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                Discover
                            </Link>
                            <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 rounded-xl font-medium text-zinc-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                My Connections
                            </button>
                        </div>
                    </div>

                    {/* Middle Feed */}
                    <div className="flex flex-col gap-6">
                        {/* Create Post Input */}
                        <div className={`bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm transition-all duration-300 ${isCreateExpanded ? 'ring-2 ring-indigo-500/20' : ''}`}>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden shrink-0 mt-1">
                                    {user?.profilePicture ? (
                                        <Image src={user.profilePicture.includes('http') ? user.profilePicture : `http://localhost:8000/uploads/${user.profilePicture}`} width={48} height={48} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">
                                            {user?.name?.[0] || "?"}
                                        </div>
                                    )}
                                </div>
                                <form onSubmit={handleCreatePost} className="flex-1 flex flex-col gap-3">
                                    <textarea 
                                        placeholder="What's on your mind?" 
                                        value={postContent}
                                        onChange={(e) => setPostContent(e.target.value)}
                                        onFocus={() => setIsCreateExpanded(true)}
                                        className={`w-full bg-transparent text-zinc-800 placeholder-zinc-400 focus:outline-none resize-none transition-all duration-300 ${isCreateExpanded ? 'min-h-[100px]' : 'min-h-[48px] pt-3'}`}
                                    />
                                    
                                    {isCreateExpanded && (
                                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center gap-2">
                                                <label className="cursor-pointer p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative group">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*,video/*" 
                                                        className="hidden" 
                                                        onChange={(e) => setPostMedia(e.target.files[0])}
                                                    />
                                                </label>
                                                {postMedia && (
                                                    <span className="text-xs text-indigo-600 font-medium truncate max-w-[150px]">{postMedia.name}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        setIsCreateExpanded(false);
                                                        setPostContent("");
                                                        setPostMedia(null);
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    type="submit" 
                                                    disabled={!postContent.trim() && !postMedia}
                                                    className="px-5 py-2 rounded-full bg-[#0a1e3f] text-white text-sm font-semibold hover:bg-[#071328] transition-all disabled:opacity-50"
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Posts List */}
                        <div className="flex flex-col gap-6">
                            {isLoading && (!posts || posts.length === 0) ? (
                                <div className="text-center text-zinc-500 py-10">Loading posts...</div>
                            ) : posts?.length > 0 ? (
                                posts.map((post) => {
                                    const isOwner = user && post.userId && post.userId._id === user._id;
                                    
                                    return (
                                        <div 
                                            key={post._id} 
                                            className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 relative group"
                                            onMouseEnter={() => setHoveredPostId(post._id)}
                                            onMouseLeave={() => setHoveredPostId(null)}
                                        >
                                            {/* Header */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <Link href={`/user/${post.userId?._id}`} className="flex items-center gap-4 group/avatar">
                                                    <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden shrink-0 flex items-center justify-center text-zinc-500 font-bold group-hover/avatar:ring-2 ring-indigo-500/50 transition-all">
                                                        {post.userId?.profilePicture ? (
                                                            <Image src={post.userId.profilePicture.includes('http') ? post.userId.profilePicture : `http://localhost:8000/uploads/${post.userId.profilePicture}`} width={48} height={48} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            post.userId?.name?.[0] || "?"
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-zinc-900 group-hover/avatar:text-indigo-600 transition-colors">{post.userId?.name || "Unknown"}</span>
                                                        <span className="text-xs text-zinc-500">@{post.userId?.username || "unknown"}</span>
                                                    </div>
                                                </Link>
                                                
                                                {/* Edit / Delete overlay (only if owner and hovered) */}
                                                {isOwner && hoveredPostId === post._id && (
                                                    <div className="ml-auto flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                                        <button 
                                                            className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                            onClick={() => alert('Edit mode not fully implemented here yet, but redux action is ready!')}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <button 
                                                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                            onClick={() => handleDeletePost(post._id)}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Body */}
                                            <div className="text-zinc-800 text-sm md:text-base leading-relaxed mb-4 whitespace-pre-wrap">
                                                {post.body}
                                            </div>

                                            {/* Optional Image */}
                                            {post.media && (
                                                <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mt-2 mb-4">
                                                    <Image 
                                                        src={post.media.includes('http') ? post.media : `http://localhost:8000/uploads/${post.media}`} 
                                                        alt="Post attachment" 
                                                        fill 
                                                        className="object-cover" 
                                                    />
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-6 pt-3 border-t border-zinc-100 mt-2">
                                                <button 
                                                    onClick={() => {
                                                        if (!user) return alert('Please login to like posts');
                                                        const hasLiked = post.likes?.includes(user._id);
                                                        if (hasLiked) {
                                                            dispatch(unlikePost(post._id));
                                                        } else {
                                                            dispatch(likePost(post._id));
                                                        }
                                                    }}
                                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.likes?.includes(user?._id) ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-800'}`}
                                                >
                                                    <svg className="w-5 h-5" fill={post.likes?.includes(user?._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                                    {post.likes?.length || 0} Likes
                                                </button>
                                                
                                                <button 
                                                    onClick={() => {
                                                        if (activeCommentsPostId === post._id) {
                                                            setActiveCommentsPostId(null);
                                                        } else {
                                                            setActiveCommentsPostId(post._id);
                                                            dispatch(getComments(post._id));
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                    {post.commentsCount || 0} Comments
                                                </button>

                                                <button 
                                                    onClick={() => {
                                                        if (navigator.share) {
                                                            navigator.share({
                                                                title: 'Pro Connect Post',
                                                                text: post.body,
                                                                url: window.location.href,
                                                            }).catch(err => console.error(err));
                                                        } else {
                                                            alert('Share copied to clipboard!');
                                                            navigator.clipboard.writeText(`${window.location.origin}/dashboard`);
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors ml-auto"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.632l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                                    Share
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center text-zinc-500 py-10">No posts yet. Be the first to post!</div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden md:flex flex-col gap-4">
                        <h3 className="font-semibold text-zinc-900 mb-2">Top Profiles</h3>
                        <div className="flex flex-col gap-3">
                            {allProfiles && allProfiles.length > 0 ? (
                                allProfiles.slice(0, 5).map(profile => (
                                    <Link href={`/user/${profile.userId?._id}`} key={profile._id} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                                            {profile.userId?.profilePicture ? (
                                                <Image src={profile.userId.profilePicture.includes('http') ? profile.userId.profilePicture : `http://localhost:8000/uploads/${profile.userId.profilePicture}`} width={40} height={40} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-sm">
                                                    {profile.userId?.name?.[0] || "?"}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-medium text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors truncate">{profile.userId?.name || "Unknown"}</span>
                                            {profile.currentPost && <span className="text-xs text-zinc-400 truncate max-w-[120px]">{profile.currentPost}</span>}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-sm text-zinc-500">No profiles found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Modal Overlay */}
            {activeCommentsPostId && (
                <div 
                    className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end md:items-center backdrop-blur-sm"
                    onClick={(e) => {
                        // Close if clicked on overlay directly
                        if (e.target === e.currentTarget) {
                            setActiveCommentsPostId(null);
                        }
                    }}
                >
                    <div className="bg-white w-full md:w-[600px] md:rounded-2xl rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
                            <h3 className="font-bold text-lg text-zinc-900">Comments</h3>
                            <button 
                                onClick={() => setActiveCommentsPostId(null)}
                                className="text-zinc-400 hover:text-zinc-800 transition-colors p-2 rounded-full hover:bg-zinc-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/50">
                            {commentsLoading ? (
                                <div className="text-center py-6 text-zinc-500 text-sm">Loading comments...</div>
                            ) : comments?.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment._id} className="flex gap-3">
                                        <Link href={`/user/${comment.userId?._id}`} className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden shrink-0 mt-1 hover:ring-2 ring-indigo-500/50 transition-all">
                                            {comment.userId?.profilePicture ? (
                                                <Image src={`http://localhost:8000/uploads/${comment.userId.profilePicture}`} width={32} height={32} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex justify-center items-center font-bold text-xs text-zinc-500">
                                                    {comment.userId?.name?.[0] || "?"}
                                                </div>
                                            )}
                                        </Link>
                                        <div className="bg-zinc-100/80 rounded-2xl p-3 px-4 flex-1">
                                            <Link href={`/user/${comment.userId?._id}`} className="font-semibold text-sm text-zinc-900 hover:text-indigo-600 transition-colors inline-block">{comment.userId?.name}</Link>
                                            <div className="text-sm text-zinc-800 mt-0.5 whitespace-pre-wrap leading-relaxed">{comment.body}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-zinc-500 text-sm">No comments yet. Start the conversation!</div>
                            )}
                        </div>

                        <div className="p-4 border-t border-zinc-100 bg-white md:rounded-b-2xl">
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!newCommentText.trim()) return;
                                    dispatch(addComment({ postId: activeCommentsPostId, body: newCommentText }));
                                    setNewCommentText("");
                                }}
                                className="flex gap-3 items-center bg-zinc-50 p-2 pl-4 rounded-full border border-zinc-200"
                            >
                                <input 
                                    type="text" 
                                    placeholder="Write a comment..." 
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder-zinc-400"
                                    autoFocus
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newCommentText.trim()}
                                    className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50 shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
