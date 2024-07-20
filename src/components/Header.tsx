import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="bg-white shadow-md">
            <div className="container flex items-center justify-between px-4 py-2 mx-auto">
                <div className="flex items-center">
                    <img
                        src="/nextread-logo.png"
                        alt="NextRead Logo"
                        className="h-8 mr-2"
                    />
                    <Link to="/" className="text-2xl font-bold">
                        NextRead
                    </Link>
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="/featured" className="text-gray-700">
                                Featured
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="text-gray-700">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="text-gray-700">
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
                <div>
                    <a href="/signup" className="mr-4 text-blue-600">
                        Sign Up
                    </a>
                    <a href="/signin" className="text-blue-600">
                        Sign In
                    </a>
                </div>
            </div>
        </header>
    );
}
