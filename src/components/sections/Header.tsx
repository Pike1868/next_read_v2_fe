import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { logoutUser } from "@/features/user/userSlice";
import { setQuery, setSearchResults, setSorting, setStartIndex } from "@/features/search/searchSlice";
import { RootState } from "@/store/rootReducer";
import { isTokenExpired } from "@/util/jwtHelper";
import { FaUserAstronaut } from "react-icons/fa6";
import { BookOpen, Search, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ServerApi from "@/api/ServerAPI";

interface HeaderProps {
    onOpenSavedBooks?: () => void;
}

export default function Header({ onOpenSavedBooks }: HeaderProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleProfileClick = () => {
        if (user && !isTokenExpired(user.token)) {
            navigate("/user/profile");
        } else {
            dispatch(logoutUser());
            navigate("/user/sign-in");
            toast({
                description: "Session expired. Please sign in again.",
                variant: "destructive",
            });
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        dispatch(setQuery(searchQuery));
        dispatch(setStartIndex(0));
        dispatch(setSorting("none"));

        try {
            const results = await ServerApi.searchBooks(searchQuery, 0);
            dispatch(setSearchResults(results.data.books));
            navigate("/book/search");
            setSearchQuery("");
            setMobileMenuOpen(false);
        } catch (error) {
            console.error("Error searching books", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(e as React.FormEvent);
        }
    };

    return (
        <header className="bg-[#212529] shadow-lg w-full sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <img
                            src="/nextread-logo.png"
                            alt="NextRead Logo"
                            className="h-7 md:h-8 w-auto"
                        />
                        <Link to="/" className="text-xl md:text-2xl font-bold text-white hover:text-green-400 transition-colors">
                            NextRead
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <Input
                                type="text"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className="w-full pr-10 pl-4 py-2 rounded-full border-2 border-gray-600 focus:border-green-500 focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {/* Nav Links - Desktop */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/featured" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Featured
                        </Link>
                        <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                            Contact
                        </Link>
                    </nav>

                    {/* User Actions - Desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                <Link to="/user/library">
                                    <Button
                                        variant="outline"
                                        className="text-green-600 hover:bg-green-50 hover:text-green-700 border-green-600 transition-all"
                                        size="sm"
                                    >
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Library
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="text-green-600 hover:bg-green-50 hover:text-green-700 border-green-600 transition-all"
                                    onClick={handleProfileClick}
                                    size="sm"
                                >
                                    <span className="font-medium">{user.username}</span>
                                    <FaUserAstronaut className="ml-2" />
                                </Button>
                                <Button
                                    className="bg-green-700 hover:bg-green-600 text-white transition-all"
                                    onClick={handleLogout}
                                    size="sm"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/user/sign-up">
                                    <Button
                                        variant="outline"
                                        className="text-green-600 hover:bg-green-50 hover:text-green-700 border-green-600 transition-all"
                                        size="sm"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                                <Link to="/user/sign-in">
                                    <Button 
                                        className="bg-green-700 hover:bg-green-600 text-white transition-all"
                                        size="sm"
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white hover:text-green-400 transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>

                    {/* Search Icon - Mobile */}
                    <Link to="/book/search" className="md:hidden text-white hover:text-green-400 transition-colors">
                        <Search className="w-5 h-5" />
                    </Link>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-700 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Search books..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none bg-gray-700 text-white placeholder-gray-400 text-sm"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-green-700 hover:bg-green-600 text-white transition-all"
                            >
                                <Search className="w-4 h-4" />
                            </Button>
                        </form>

                        {/* Mobile Nav Links */}
                        <nav className="space-y-2">
                            <Link
                                to="/featured"
                                className="block text-gray-300 hover:text-white transition-colors py-2 text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Featured
                            </Link>
                            <Link
                                to="/about"
                                className="block text-gray-300 hover:text-white transition-colors py-2 text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className="block text-gray-300 hover:text-white transition-colors py-2 text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </nav>

                        {/* Mobile User Actions */}
                        <div className="space-y-2 border-t border-gray-700 pt-4">
                            {user ? (
                                <>
                                    <Link
                                        to="/user/library"
                                        className="block"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full text-green-600 hover:bg-green-50 border-green-600 transition-all justify-start"
                                            size="sm"
                                        >
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            My Library
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="w-full text-green-600 hover:bg-green-50 border-green-600 transition-all justify-start"
                                        onClick={() => {
                                            handleProfileClick();
                                            setMobileMenuOpen(false);
                                        }}
                                        size="sm"
                                    >
                                        <FaUserAstronaut className="mr-2" />
                                        {user.username}
                                    </Button>
                                    <Button
                                        className="w-full bg-green-700 hover:bg-green-600 text-white transition-all"
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        size="sm"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/user/sign-up"
                                        className="block"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full text-green-600 hover:bg-green-50 border-green-600 transition-all"
                                            size="sm"
                                        >
                                            Sign Up
                                        </Button>
                                    </Link>
                                    <Link
                                        to="/user/sign-in"
                                        className="block"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button 
                                            className="w-full bg-green-700 hover:bg-green-600 text-white transition-all"
                                            size="sm"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
