import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../config/redux/action/authAction";
import { useRouter } from "next/router";
import Link from "next/link";
import UserLayout from "../../layout/UserLayout";

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isLoading, isSuccess, isError, message } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (isSuccess) {
            router.push("/dashboard"); // Or wherever they should go after login
        }
    }, [isSuccess, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    return (
        <UserLayout>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-zinc-50 px-4">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-zinc-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Welcome back</h2>
                        <p className="text-zinc-500 mt-2 text-sm">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-zinc-700" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-zinc-700" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                required
                            />
                        </div>

                        {isError && (
                            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-zinc-900 text-white font-medium py-3.5 rounded-xl hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-600 mt-8">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-violet-600 font-medium hover:text-violet-700 hover:underline underline-offset-4 transition-all">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </UserLayout>
    );
}
