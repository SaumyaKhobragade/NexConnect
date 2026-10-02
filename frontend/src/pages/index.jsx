import { useRouter } from "next/router";
import UserLayout from "../layout/UserLayout";
import Image from "next/image";

export default function Home() {
    const router = useRouter();

    return (
        <UserLayout>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-zinc-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12 py-12">
                    {/* Left Content */}
                    <div className="flex-1 flex flex-col items-start gap-6 max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 leading-[1.1] tracking-tight">
                            Connect with Friends without <span className="text-zinc-500">Exaggeration</span>
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-600 font-light">
                            A True social media platform, with stories no blufs!
                        </p>
                        <button 
                            onClick={() => router.push("/signup")} 
                            className="mt-4 bg-violet-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30 transition-all active:scale-95 flex items-center gap-2"
                        >
                            Join Now
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>

                    {/* Right Illustration */}
                    <div className="flex-1 w-full max-w-lg relative">
                        {/* Decorative background blur */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-violet-100/50 rounded-full blur-3xl -z-10"></div>
                        
                        <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px]">
                            <Image 
                                src="/images/hero.jpg" 
                                alt="People Connecting Illustration" 
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain drop-shadow-2xl rounded-3xl"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
