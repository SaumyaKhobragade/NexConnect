import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import UserLayout from "../../layout/UserLayout";
import { getAllProfiles, sendConnectionRequest } from "../../config/redux/action/authAction";
import Image from "next/image";
import Link from "next/link";

export default function Discover() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, allProfiles } = useSelector((state) => state.auth);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!localStorage.getItem('token')) {
            router.push('/login');
        } else {
            dispatch(getAllProfiles());
        }
    }, [dispatch, router]);

    if (!isClient) return null;
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) return null;

    const handleConnect = (userId) => {
        dispatch(sendConnectionRequest(userId));
    };

    // Filter out the current user from the list
    const discoverProfiles = allProfiles?.filter(profile => profile.userId?._id !== user?._id) || [];

    return (
        <UserLayout>
            <div className="min-h-[calc(100vh-80px)] bg-zinc-50 flex justify-center py-8 px-4 md:px-0">
                <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
                    
                    {/* Left Sidebar */}
                    <div className="hidden md:flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 rounded-xl font-medium text-zinc-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                Scroll
                            </Link>
                            <button className="flex items-center gap-3 px-4 py-3 bg-zinc-100 rounded-xl font-medium text-zinc-900 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                Discover
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-100 rounded-xl font-medium text-zinc-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                My Connections
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Discover Professionals</h2>
                            <p className="text-zinc-500 mb-8">Connect with people and grow your network.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {discoverProfiles.length > 0 ? (
                                    discoverProfiles.map(profile => (
                                        <div key={profile._id} className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex flex-col items-center text-center group hover:border-indigo-100 hover:shadow-md transition-all">
                                            <Link href={`/user/${profile.userId?._id}`} className="flex flex-col items-center">
                                                <div className="w-24 h-24 rounded-full bg-zinc-200 overflow-hidden mb-4 shadow-sm ring-4 ring-white">
                                                    {profile.userId?.profilePicture ? (
                                                        <Image src={profile.userId.profilePicture.includes('http') ? profile.userId.profilePicture : `http://localhost:8000/uploads/${profile.userId.profilePicture}`} width={96} height={96} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    ) : (
                                                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-2xl">
                                                            {profile.userId?.name?.[0] || "?"}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <h3 className="font-semibold text-lg text-zinc-900 group-hover:text-indigo-600 transition-colors">{profile.userId?.name || "Unknown"}</h3>
                                                <p className="text-sm text-zinc-500 mb-2">@{profile.userId?.username || "unknown"}</p>
                                            </Link>
                                            
                                            <div className="min-h-[40px] mb-4">
                                                {profile.currentPost ? (
                                                    <p className="text-sm font-medium text-zinc-700 bg-white px-3 py-1 rounded-full shadow-sm">{profile.currentPost}</p>
                                                ) : (
                                                    <p className="text-sm text-zinc-400 italic">No position added</p>
                                                )}
                                            </div>

                                            <button 
                                                onClick={() => handleConnect(profile.userId?._id)}
                                                className="mt-auto w-full py-2.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm hover:bg-indigo-600 hover:text-white transition-colors flex justify-center items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                Connect
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-1 md:col-span-2 text-center py-10 text-zinc-500">
                                        No other professionals found yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
