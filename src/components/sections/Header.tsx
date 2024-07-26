import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="bg-[#212529] h-16 shadow-md">
            <div className="container flex items-center justify-between px-4 py-2 mx-auto">
                <div className="flex items-center">
                    <img
                        src="/nextread-logo.png"
                        alt="NextRead Logo"
                        className="h-8 mr-2"
                    />
                    <Link to="/" className="text-2xl font-bold text-white">
                        NextRead
                    </Link>
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/featured" className="text-white">
                                Featured
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-white">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-white">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="flex space-x-4">
                    <Link to="/signup">
                        <Button variant="outline" className="text-green-800">
                            Sign Up
                        </Button>
                    </Link>
                    <Link to="/signin">
                        <Button className="text-white bg-green-800">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
