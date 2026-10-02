import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../config/redux/action/authAction";
import { useRouter } from "next/router";
import UserLayout from "../../layout/UserLayout";

export default function AuthPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoading, isSuccess, isError, message } = useSelector(
        (state) => state.auth
    );

    const [activeTab, setActiveTab] = useState("login"); // 'login' or 'signup'

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [signupData, setSignupData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    // Reset error state when switching tabs (Optional, but good UX. We rely on activeTab check below)
    
    useEffect(() => {
        if (isSuccess) {
            router.push("/dashboard");
        }
    }, [isSuccess, router]);

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSignupChange = (e) => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(loginData));
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(signupData));
    };

    return (
        <UserLayout>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-zinc-50 p-4 md:p-8 overflow-hidden">
                <div className="flex flex-col md:flex-row w-full max-w-5xl h-[700px] md:h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-zinc-100">
                    
                    {/* Login Panel */}
                    <div 
                        onClick={() => setActiveTab("login")}
                        className={`transition-all duration-700 ease-in-out flex flex-col justify-center cursor-pointer relative group ${
                            activeTab === 'login' 
                                ? 'h-[60%] md:h-full w-full md:w-[60%] bg-white z-10 px-8 py-10 md:px-16' 
                                : 'h-[40%] md:h-full w-full md:w-[40%] bg-zinc-50 hover:bg-zinc-100 px-6'
                        }`}
                    >
                        {activeTab !== 'login' && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center text-3xl font-bold text-zinc-300 group-hover:text-zinc-400 transition-colors">
                                <span className="rotate-0 md:-rotate-90 whitespace-nowrap tracking-tight">Sign In</span>
                            </div>
                        )}
                        
                        <div className={`transition-all duration-500 w-full h-full flex flex-col justify-center ${activeTab === 'login' ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none absolute md:relative'}`}>
                            <div className="text-center md:text-left mb-8 mt-auto md:mt-0">
                                <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Welcome back</h2>
                                <p className="text-zinc-500 mt-3 text-base">Please enter your details to sign in.</p>
                            </div>

                            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 mb-auto md:mb-0">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-zinc-700" htmlFor="login-email">Email</label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                        required={activeTab === 'login'}
                                        onFocus={() => setActiveTab("login")}
                                        tabIndex={activeTab === 'login' ? 0 : -1}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-zinc-700" htmlFor="login-password">Password</label>
                                    <input
                                        type="password"
                                        id="login-password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                        required={activeTab === 'login'}
                                        onFocus={() => setActiveTab("login")}
                                        tabIndex={activeTab === 'login' ? 0 : -1}
                                    />
                                </div>

                                {isError && activeTab === 'login' && (
                                    <p className="text-red-500 text-sm bg-red-50 py-2.5 px-3 rounded-lg text-center font-medium">{message}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    tabIndex={activeTab === 'login' ? 0 : -1}
                                    className="w-full bg-violet-600 text-white font-semibold py-4 rounded-xl hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                >
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Signup Panel */}
                    <div 
                        onClick={() => setActiveTab("signup")}
                        className={`transition-all duration-700 ease-in-out flex flex-col justify-center cursor-pointer relative group ${
                            activeTab === 'signup' 
                                ? 'h-[60%] md:h-full w-full md:w-[60%] bg-slate-900 z-10 px-8 py-10 md:px-16 text-white' 
                                : 'h-[40%] md:h-full w-full md:w-[40%] bg-slate-800 hover:bg-slate-700 px-6'
                        }`}
                    >
                        {activeTab !== 'signup' && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center text-3xl font-bold text-slate-500 group-hover:text-slate-400 transition-colors">
                                <span className="rotate-0 md:rotate-90 whitespace-nowrap tracking-tight">Create Account</span>
                            </div>
                        )}
                        
                        <div className={`transition-all duration-500 w-full h-full flex flex-col justify-center ${activeTab === 'signup' ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none absolute md:relative'}`}>
                            <div className="text-center md:text-left mb-8 mt-auto md:mt-0">
                                <h2 className="text-4xl font-bold text-white tracking-tight">Join us today</h2>
                                <p className="text-zinc-400 mt-3 text-base">Start your journey with no bluffs.</p>
                            </div>

                            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-5 mb-auto md:mb-0">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300" htmlFor="signup-name">Full Name</label>
                                    <input
                                        type="text"
                                        id="signup-name"
                                        name="name"
                                        value={signupData.name}
                                        onChange={handleSignupChange}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                                        required={activeTab === 'signup'}
                                        onFocus={() => setActiveTab("signup")}
                                        tabIndex={activeTab === 'signup' ? 0 : -1}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300" htmlFor="signup-username">Username</label>
                                    <input
                                        type="text"
                                        id="signup-username"
                                        name="username"
                                        value={signupData.username}
                                        onChange={handleSignupChange}
                                        placeholder="Choose a username"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                                        required={activeTab === 'signup'}
                                        onFocus={() => setActiveTab("signup")}
                                        tabIndex={activeTab === 'signup' ? 0 : -1}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300" htmlFor="signup-email">Email</label>
                                    <input
                                        type="email"
                                        id="signup-email"
                                        name="email"
                                        value={signupData.email}
                                        onChange={handleSignupChange}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                                        required={activeTab === 'signup'}
                                        onFocus={() => setActiveTab("signup")}
                                        tabIndex={activeTab === 'signup' ? 0 : -1}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-300" htmlFor="signup-password">Password</label>
                                    <input
                                        type="password"
                                        id="signup-password"
                                        name="password"
                                        value={signupData.password}
                                        onChange={handleSignupChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                                        required={activeTab === 'signup'}
                                        onFocus={() => setActiveTab("signup")}
                                        tabIndex={activeTab === 'signup' ? 0 : -1}
                                    />
                                </div>

                                {isError && activeTab === 'signup' && (
                                    <p className="text-red-400 text-sm bg-red-900/20 py-2.5 px-3 rounded-lg text-center font-medium border border-red-900/30">{message}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    tabIndex={activeTab === 'signup' ? 0 : -1}
                                    className="w-full bg-white text-zinc-900 font-semibold py-4 rounded-xl hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                >
                                    {isLoading ? "Creating account..." : "Sign up"}
                                </button>
                            </form>
                        </div>
                    </div>
                    
                </div>
            </div>
        </UserLayout>
    );
}
