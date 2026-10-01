'use client';

import { Search, ShoppingCart, Heart, User, LogOut, PackageCheck, RotateCcw, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const EMPTY_ITEMS = [];

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState(null);

    const cartCount = useSelector((state) => state?.cart?.total ?? 0);
    const wishlistItems = useSelector((state) => state?.wishlist?.items ?? EMPTY_ITEMS);
    const wishlistCount = wishlistItems.length;

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
        router.push(`/catalog?search=${encodeURIComponent(search.trim())}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0b0f17]/95 border-b border-slate-800/80 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 transition-all gap-4">

                    {/* Brand Logo */}
                    <Link href="/" className="relative text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center shrink-0">
                        <span className="text-emerald-400">go</span>cart
                        <span className="text-emerald-400 text-3xl leading-none">.</span>
                        <span className="ml-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                            plus
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-6 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                        <Link 
                            href="/" 
                            className={`transition-colors hover:text-emerald-400 ${pathname === '/' ? 'text-emerald-400' : ''}`}
                        >
                            Home
                        </Link>

                        <Link 
                            href="/shop" 
                            className={`transition-colors hover:text-emerald-400 ${pathname === '/shop' ? 'text-emerald-400' : ''}`}
                        >
                            Shop
                        </Link>

                        <Link 
                            href="/catalog" 
                            className={`flex items-center gap-1.5 transition-colors hover:text-emerald-400 ${pathname.startsWith('/catalog') ? 'text-emerald-400' : ''}`}
                        >
                            <LayoutGrid size={14} className="text-emerald-400" />
                            <span>Catalog</span>
                        </Link>

                        <Link 
                            href="/returns" 
                            className={`flex items-center gap-1.5 transition-colors hover:text-emerald-400 ${pathname.startsWith('/returns') ? 'text-emerald-400' : ''}`}
                        >
                            <RotateCcw size={14} className="text-emerald-400" />
                            <span>Returns</span>
                        </Link>

                        <Link 
                            href="/about" 
                            className={`transition-colors hover:text-emerald-400 ${pathname === '/about' ? 'text-emerald-400' : ''}`}
                        >
                            About
                        </Link>
                    </nav>

                    {/* Global Quick Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center flex-1 max-w-sm text-xs bg-[#111827] border border-slate-800 focus-within:border-emerald-500/70 rounded-full px-3.5 py-2 transition-all shadow-inner"
                    >
                        <Search size={15} className="text-slate-500 shrink-0" />
                        <input
                            className="w-full bg-transparent outline-none text-slate-200 placeholder-slate-500 text-xs px-2.5"
                            type="text"
                            placeholder="Search products, brands and departments..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="size-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm transition active:scale-95 cursor-pointer"
                            title="Search"
                        >
                            <Search size={13} />
                        </button>
                    </form>

                    {/* Desktop Utility & Profile Controls */}
                    <div className="hidden sm:flex items-center gap-3">
                        {/* Wishlist Link */}
                        <Link
                            href="/wishlist"
                            className="relative flex items-center gap-1.5 text-slate-300 hover:text-rose-400 transition-colors px-2 py-1 text-xs font-semibold"
                            title="My Wishlist"
                        >
                            <Heart size={18} className="text-slate-300 hover:text-rose-400 transition-colors" />
                            <span className="hidden xl:inline">Wishlist</span>
                            {mounted && wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-0.5 text-[8px] font-bold text-white bg-rose-500 size-4 rounded-full flex items-center justify-center shadow-md shadow-rose-500/30">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart Link */}
                        <Link
                            href="/cart"
                            className="relative flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors px-2 py-1 text-xs font-semibold"
                            title="Shopping Cart"
                        >
                            <ShoppingCart size={18} className="text-slate-300 hover:text-emerald-400 transition-colors" />
                            <span className="hidden xl:inline">Cart</span>
                            {mounted && cartCount > 0 && (
                                <span className="absolute -top-1 -right-0.5 text-[8px] font-bold text-slate-950 bg-emerald-400 size-4 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30 font-mono">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Authentication Menu */}
                        {mounted && user ? (
                            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                                <Link
                                    href="/orders"
                                    className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 rounded-full transition"
                                    title="My Orders"
                                >
                                    <PackageCheck size={18} />
                                </Link>

                                <div className="flex items-center gap-2 bg-[#111827] border border-slate-800 px-3 py-1.5 rounded-full text-xs font-medium text-slate-200">
                                    <div className="size-5 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                                        {user.name?.[0]?.toUpperCase() || <User size={12} />}
                                    </div>
                                    <span className="max-w-[100px] truncate">{user.name || "Account"}</span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : mounted ? (
                            <Link
                                href="/login"
                                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-emerald-500/20 active:scale-95"
                            >
                                Login
                            </Link>
                        ) : null}
                    </div>

                    {/* Mobile Header Bar Controls */}
                    <div className="flex sm:hidden items-center gap-2">
                        <Link href="/catalog" className="p-2 text-slate-300 hover:text-emerald-400" title="Catalog">
                            <LayoutGrid size={18} />
                        </Link>
                        <Link href="/returns" className="p-2 text-slate-300 hover:text-emerald-400" title="Returns">
                            <RotateCcw size={18} />
                        </Link>
                        <Link href="/cart" className="relative p-2 text-slate-300">
                            <ShoppingCart size={19} />
                            {mounted && cartCount > 0 && (
                                <span className="absolute 0 top-0.5 right-0.5 text-[8px] font-bold text-slate-950 bg-emerald-400 size-3.5 rounded-full flex items-center justify-center font-mono">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>

                </div>

                {/* Mobile Search Row */}
                <div className="pb-3 md:hidden">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center w-full bg-[#111827] border border-slate-800 rounded-2xl px-3 py-2 text-xs shadow-inner"
                    >
                        <Search size={14} className="text-slate-500 shrink-0" />
                        <input
                            className="w-full bg-transparent outline-none text-slate-200 placeholder-slate-500 text-xs px-2.5"
                            type="text"
                            placeholder="Search products, brands and items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="size-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 cursor-pointer"
                        >
                            <Search size={11} />
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
};

export default Navbar;