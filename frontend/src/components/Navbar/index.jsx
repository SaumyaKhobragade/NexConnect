import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

export default function Navbar() {
    const { user, loggedIn } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    
    useEffect(() => {
        setIsAuth(loggedIn || !!localStorage.getItem('token'));
    }, [loggedIn]);

    const userName = user?.name || "User";

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'auth/reset' }); // or create a dedicated logout action
        router.push('/login');
    };

    return (
        <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 hover:opacity-80 transition-opacity">
                        Pro Connect
                    </h1>
                </Link>
                
                <div className="flex items-center gap-6">
                    {isAuth ? (
                        <>
                            <span className="text-sm font-medium text-zinc-600">Hey, {userName}</span>
                            <Link href="/profile" className="text-sm font-bold text-zinc-900 hover:text-zinc-700">
                                Profile
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="text-sm font-bold text-zinc-900 hover:text-zinc-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                href="/login" 
                                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link 
                                href="/login" 
                                className="text-sm font-medium bg-zinc-900 text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                            >
                                Be a part
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
