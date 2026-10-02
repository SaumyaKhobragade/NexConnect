import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 hover:opacity-80 transition-opacity">
                        Pro Connect
                    </h1>
                </Link>
                
                <div className="flex items-center gap-6">
                    <Link 
                        href="/login" 
                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                        Log in
                    </Link>
                    <Link 
                        href="/signup" 
                        className="text-sm font-medium bg-zinc-900 text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                    >
                        Be a part
                    </Link>
                </div>
            </div>
        </nav>
    );
}
