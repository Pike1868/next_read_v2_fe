import { Button } from "@/components/ui/button";
import { logoutUser } from "@/features/user/userSlice";
import { RootState } from "@/store/rootReducer";
import { FaUserAstronaut } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Header() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

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
                    {user ? (
                        <>
                            <Link to="/profile" className="text-white">
                                <Button
                                    variant="outline"
                                    className="text-green-800 "
                                >
                                    <span className="font-normal tracking-wide">
                                        {user.username}
                                    </span>
                                    <FaUserAstronaut className="mb-1 ml-2" />
                                </Button>
                            </Link>
                            <Button
                                className="text-white bg-green-800"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/sign-up">
                                <Button
                                    variant="outline"
                                    className="text-green-800"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                            <Link to="/sign-in">
                                <Button className="text-white bg-green-800">
                                    Sign In
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
