import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import UserLayout from "../../layout/UserLayout";
import { getAllPosts, createPost, deletePost } from "../../config/redux/action/postAction";
import Image from "next/image";

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, loggedIn } = useSelector((state) => state.auth);
    const { posts, isLoading } = useSelector((state) => state.post || { posts: [], isLoading: false });
    
    const [postContent, setPostContent] = useState("");
    const [hoveredPostId, setHoveredPostId] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/login');
        } else {
            dispatch(getAllPosts());
        }
    }, [dispatch, router]);

    const handleCreatePost = (e) => {
        e.preventDefault();
        if (!postContent.trim()) return;
        
        dispatch(createPost({ body: postContent }));
        setPostContent("");
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
                            <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 rounded-xl font-medium text-zinc-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                Discover
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 rounded-xl font-medium text-zinc-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                My Connections
                            </button>
                        </div>
                    </div>

                    {/* Middle Feed */}
                    <div className="flex flex-col gap-6">
                        {/* Create Post Input */}
                        <div className="bg-rose-50/50 p-4 rounded-3xl border border-rose-100/50 flex gap-4 items-center shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                                {user?.profilePicture ? (
                                    <Image src={user.profilePicture.includes('http') ? user.profilePicture : `http://localhost:8000/uploads/${user.profilePicture}`} width={48} height={48} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">
                                        {user?.name?.[0] || "?"}
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleCreatePost} className="flex-1 flex gap-3 items-center">
                                <input 
                                    type="text" 
                                    placeholder="What's in your mind?" 
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    className="flex-1 bg-white border border-zinc-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200 transition-all placeholder-zinc-400"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!postContent.trim()}
                                    className="w-12 h-12 rounded-full bg-[#0a1e3f] text-white flex items-center justify-center hover:bg-[#071328] transition-all disabled:opacity-50 shrink-0 shadow-md"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </button>
                            </form>
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
                                                <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden shrink-0 flex items-center justify-center text-zinc-500 font-bold">
                                                    {post.userId?.profilePicture ? (
                                                        <Image src={post.userId.profilePicture.includes('http') ? post.userId.profilePicture : `http://localhost:8000/uploads/${post.userId.profilePicture}`} width={48} height={48} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        post.userId?.name?.[0] || "?"
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-900">{post.userId?.name || "Unknown"}</span>
                                                    <span className="text-xs text-zinc-500">@{post.userId?.username || "unknown"}</span>
                                                </div>
                                                
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
                                                <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mt-2">
                                                    <Image 
                                                        src={post.media.includes('http') ? post.media : `http://localhost:8000/uploads/${post.media}`} 
                                                        alt="Post attachment" 
                                                        fill 
                                                        className="object-cover" 
                                                    />
                                                </div>
                                            )}
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
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-zinc-200"></div>
                                <span className="font-medium text-sm text-zinc-700 group-hover:text-zinc-900">Rahul</span>
                            </div>
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-zinc-200"></div>
                                <span className="font-medium text-sm text-zinc-700 group-hover:text-zinc-900">Neha</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
