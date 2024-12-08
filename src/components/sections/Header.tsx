import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { logoutUser } from "@/features/user/userSlice";
import { RootState } from "@/store/rootReducer";
import { isTokenExpired } from "@/util/jwtHelper";
import { FaUserAstronaut } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
    onOpenSavedBooks?: () => void; // Add this prop for opening the saved books modal
}

export default function Header({ onOpenSavedBooks }: HeaderProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user);

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

    return (
        <header className="bg-[#212529] h-16 shadow-md w-full">
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
                            {/* My Books button to open modal */}
                            <Button
                                variant="outline"
                                className="text-green-800"
                                onClick={onOpenSavedBooks}
                            >
                                My Books
                            </Button>
                            <Button
                                variant="outline"
                                className="text-green-800"
                                onClick={handleProfileClick}
                            >
                                <span className="font-normal tracking-wide">
                                    {user.username}
                                </span>
                                <FaUserAstronaut className="mb-1 ml-2" />
                            </Button>
                            <Button
                                className="text-white bg-green-800"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/user/sign-up">
                                <Button
                                    variant="outline"
                                    className="text-green-800"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                            <Link to="/user/sign-in">
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
