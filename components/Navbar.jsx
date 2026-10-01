'use client';

import { Search, ShoppingCart, Heart, User, LogOut, PackageCheck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);

    const cartCount = useSelector((state) => state?.cart?.total ?? 0);
    const wishlistCount = useSelector((state) => state?.wishlist?.items?.length ?? 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
        router.refresh();
    };

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0b0f17]/90 border-b border-slate-800/80 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 transition-all">

                    {/* Brand Logo */}
                    <Link href="/" className="relative text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center shrink-0">
                        <span className="text-emerald-400">go</span>cart
                        <span className="text-emerald-400 text-4xl leading-none">.</span>
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                            plus
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-5 lg:gap-7 text-slate-300 text-sm font-medium">
                        <Link 
                            href="/" 
                            className={`transition-colors hover:text-emerald-400 ${pathname === '/' ? 'text-emerald-400 font-semibold' : ''}`}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/shop" 
                            className={`transition-colors hover:text-emerald-400 ${pathname.startsWith('/shop') ? 'text-emerald-400 font-semibold' : ''}`}
                        >
                            Shop
                        </Link>

                        {/* Dedicated Returns & Refund Center Link */}
                        <Link 
                            href="/returns" 
                            className={`flex items-center gap-1.5 transition-colors hover:text-emerald-400 ${pathname.startsWith('/returns') ? 'text-emerald-400 font-semibold' : ''}`}
                        >
                            <RotateCcw size={14} className="text-emerald-400" />
                            <span>Returns</span>
                        </Link>

                        <Link 
                            href="/about" 
                            className={`transition-colors hover:text-emerald-400 ${pathname === '/about' ? 'text-emerald-400 font-semibold' : ''}`}
                        >
                            About
                        </Link>
                        <Link 
                            href="/contact" 
                            className={`transition-colors hover:text-emerald-400 ${pathname === '/contact' ? 'text-emerald-400 font-semibold' : ''}`}
                        >
                            Contact
                        </Link>

                        {/* Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="hidden xl:flex items-center w-64 lg:w-72 text-xs gap-2.5 bg-slate-900/90 border border-slate-700/60 focus-within:border-emerald-500/80 focus-within:ring-1 focus-within:ring-emerald-500/50 px-4 py-2.5 rounded-full transition-all duration-200"
                        >
                            <Search size={16} className="text-slate-400 shrink-0" />
                            <input
                                className="w-full bg-transparent outline-none text-slate-200 placeholder-slate-500 text-xs"
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>

                        {/* Wishlist Button */}
                        <Link
                            href="/wishlist"
                            className="relative flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150 px-2 py-1"
                            title="My Wishlist"
                        >
                            <Heart size={19} className="text-slate-300 hover:text-rose-400 transition-colors" />
                            <span className="font-medium hidden lg:inline">Wishlist</span>
                            {mounted && wishlistCount > 0 && (
                                <span className="absolute -top-1.5 -right-1 text-[9px] font-bold text-white bg-rose-500 size-4 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart Button */}
                        <Link
                            href="/cart"
                            className="relative flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150 px-2 py-1"
                            title="Shopping Cart"
                        >
                            <ShoppingCart size={19} className="text-slate-300 hover:text-emerald-400 transition-colors" />
                            <span className="font-medium hidden lg:inline">Cart</span>
                            {mounted && cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1 text-[9px] font-bold text-black bg-emerald-400 size-4 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Auth Section */}
                        {mounted && user ? (
                            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                                <Link
                                    href="/orders"
                                    className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-full transition"
                                    title="My Orders"
                                >
                                    <PackageCheck size={18} />
                                </Link>

                                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-200 shadow-inner">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                                        {user.name?.[0]?.toUpperCase() || <User size={12} />}
                                    </div>
                                    <span className="max-w-[110px] truncate">{user.name || "My Account"}</span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors duration-150"
                                    title="Logout"
                                >
                                    <LogOut size={17} />
                                </button>
                            </div>
                        ) : mounted ? (
                            <Link
                                href="/login"
                                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-full transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95"
                            >
                                Login
                            </Link>
                        ) : null}
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-3">
                        <Link 
                            href="/returns" 
                            className={`p-1.5 transition-colors ${pathname.startsWith('/returns') ? 'text-emerald-400' : 'text-slate-300 hover:text-emerald-400'}`} 
                            title="Returns Center"
                        >
                            <RotateCcw size={19} />
                        </Link>

                        <Link href="/wishlist" className="relative p-1.5 text-slate-300">
                            <Heart size={20} />
                            {mounted && wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[8px] font-bold text-white bg-rose-500 size-4 rounded-full flex items-center justify-center shadow-md">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/cart" className="relative p-1.5 text-slate-300">
                            <ShoppingCart size={20} />
                            {mounted && cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[8px] font-bold text-black bg-emerald-400 size-4 rounded-full flex items-center justify-center shadow-md">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {mounted && user ? (
                            <div className="flex items-center gap-1.5">
                                <Link href="/orders" className="p-1.5 text-slate-300 hover:text-emerald-400">
                                    <PackageCheck size={19} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium transition rounded-full hover:bg-rose-500/25"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : mounted ? (
                            <Link
                                href="/login"
                                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition rounded-full shadow-sm"
                            >
                                Login
                            </Link>
                        ) : null}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;