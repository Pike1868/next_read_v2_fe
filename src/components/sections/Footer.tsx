import { BookOpen, Github, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full border-t border-green-100 bg-gradient-to-b from-white to-green-50/60">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-3 group">
                            <BookOpen className="w-5 h-5 text-green-700 group-hover:rotate-12 transition-transform" />
                            <span className="text-lg font-bold text-green-900">
                                NextRead
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Your personal book discovery and tracking platform. Find your next favorite read.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Explore</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/featured" className="text-sm text-gray-500 hover:text-green-700 transition-colors">
                                    Bestsellers
                                </Link>
                            </li>
                            <li>
                                <Link to="/book/search" className="text-sm text-gray-500 hover:text-green-700 transition-colors">
                                    Search Books
                                </Link>
                            </li>
                            <li>
                                <Link to="/quiz" className="text-sm text-gray-500 hover:text-green-700 transition-colors">
                                    Reading Quiz
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Company</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-sm text-gray-500 hover:text-green-700 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm text-gray-500 hover:text-green-700 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Connect</h4>
                        <div className="flex gap-3">
                            <a
                                href="https://github.com/Pike1868/next_read_v2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-green-100 hover:text-green-700 transition-all"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 pt-6 border-t border-green-100 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} NextRead. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for book lovers
                    </p>
                </div>
            </div>
        </footer>
    );
}
