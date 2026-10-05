import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "../../../src/layout/UserLayout";
import { sendConnectionRequest } from "../../../src/config/redux/action/authAction";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function UserProfile({ profileData, recentPosts, error }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.user);

    // If user is trying to view their own profile, redirect to /profile
    if (typeof window !== 'undefined' && currentUser && profileData && currentUser._id === profileData.user._id) {
        router.push('/profile');
        return null;
    }

    const handleConnect = () => {
        if (!currentUser) return alert("Please login to connect");
        dispatch(sendConnectionRequest(profileData.user._id));
    };

    if (error || !profileData) {
        return (
            <UserLayout>
                <div className="min-h-[calc(100vh-80px)] bg-zinc-50 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-zinc-800 mb-2">Oops!</h2>
                    <p className="text-zinc-500">{error || "Profile could not be loaded."}</p>
                    <button onClick={() => router.push('/dashboard')} className="mt-6 px-6 py-2 bg-[#0a1e3f] text-white rounded-full font-medium hover:bg-[#071328] transition-colors">
                        Go Back
                    </button>
                </div>
            </UserLayout>
        );
    }

    const { user, profile } = profileData;

    return (
        <UserLayout>
            <div className="min-h-[calc(100vh-80px)] bg-zinc-50 flex justify-center py-8 px-4 md:px-0">
                <div className="max-w-4xl w-full flex flex-col gap-6">
                    
                    {/* Header Card */}
                    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden relative">
                        {/* Cover Placeholder */}
                        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        
                        <div className="px-8 pb-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
                                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                                    {/* Avatar */}
                                    <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md">
                                        <div className="w-full h-full rounded-full bg-zinc-200 overflow-hidden relative">
                                            {user?.profilePicture ? (
                                                <Image src={user.profilePicture.includes('http') ? user.profilePicture : `http://localhost:8000/uploads/${user.profilePicture}`} fill alt="Avatar" className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-4xl">
                                                    {user?.name?.[0] || "?"}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="text-center md:text-left mb-2">
                                        <h1 className="text-2xl font-bold text-zinc-900">{user?.name}</h1>
                                        <p className="text-zinc-500 font-medium">@{user?.username}</p>
                                        <p className="text-zinc-600 mt-1 font-medium">{profile?.currentPost || "No title available"}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <button 
                                        onClick={handleConnect}
                                        className="px-6 py-2.5 rounded-full bg-[#0a1e3f] text-white font-semibold hover:bg-[#071328] transition-all flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Connect
                                    </button>
                                    <a 
                                        href={`http://localhost:8000/api/users/${user?._id}/resume`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-6 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-50 transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Resume
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column: About & Experience */}
                        <div className="md:col-span-2 flex flex-col gap-6">
                            {/* About */}
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    About
                                </h3>
                                <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
                                    {profile?.bio || <span className="text-zinc-400 italic">This user hasn't added a bio yet.</span>}
                                </p>
                            </div>

                            {/* Experience */}
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    Experience
                                </h3>
                                {profile?.pastWork && profile.pastWork.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {profile.pastWork.map((work, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-zinc-900">{work.position}</h4>
                                                    <p className="text-sm font-medium text-zinc-600">{work.company}</p>
                                                    <p className="text-xs text-zinc-500 mt-1">{work.years} years</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-zinc-400 italic">No experience added.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Education & Activity */}
                        <div className="flex flex-col gap-6">
                            {/* Education */}
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                                    Education
                                </h3>
                                {profile?.education && profile.education.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {profile.education.map((edu, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-zinc-900 text-sm">{edu.school}</h4>
                                                    <p className="text-xs font-medium text-zinc-600">{edu.degree}</p>
                                                    <p className="text-xs text-zinc-500">{edu.fieldOfStudy}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-zinc-400 italic text-sm">No education added.</p>
                                )}
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    Recent Activity
                                </h3>
                                {recentPosts && recentPosts.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {recentPosts.slice(0, 3).map((post) => (
                                            <div key={post._id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                                <p className="text-sm text-zinc-800 line-clamp-2 leading-relaxed">{post.body}</p>
                                                {post.media && (
                                                    <div className="w-full h-24 mt-2 rounded-lg overflow-hidden relative">
                                                        <Image src={post.media.includes('http') ? post.media : `http://localhost:8000/uploads/${post.media}`} fill alt="attachment" className="object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-medium">
                                                    <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {post.likes?.length || 0}</span>
                                                    <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> {post.commentsCount || 0}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-zinc-400 italic text-sm">No recent posts.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;
    
    try {
        const [profileRes, postsRes] = await Promise.all([
            axios.get(`http://localhost:8000/api/users/${id}`),
            axios.get(`http://localhost:8000/api/posts?userId=${id}&limit=5`)
        ]);

        return {
            props: {
                profileData: profileRes.data,
                recentPosts: postsRes.data.posts || [],
                error: null
            }
        };
    } catch (err) {
        return {
            props: {
                profileData: null,
                recentPosts: [],
                error: err.response?.data?.message || "User not found"
            }
        };
    }
}
