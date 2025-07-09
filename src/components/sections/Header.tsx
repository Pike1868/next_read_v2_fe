import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { logoutUser } from "@/features/user/userSlice";
import { RootState } from "@/store/rootReducer";
import { isTokenExpired } from "@/util/jwtHelper";
import { Menu } from "lucide-react";
import { FaUserAstronaut } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
    onOpenSavedBooks?: () => void;
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
        <header className="bg-[#212529] h-auto min-h-16 shadow-md w-full">
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

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
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

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex space-x-4">
                    {user ? (
                        <>
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

                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-[250px] sm:w-[300px]"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex-1 py-4">
                                <nav className="mb-8">
                                    <h4 className="mb-2 text-lg font-medium">
                                        Navigation
                                    </h4>
                                    <ul className="space-y-2">
                                        <li>
                                            <SheetClose asChild>
                                                <Link
                                                    to="/"
                                                    className="block py-2 hover:underline"
                                                >
                                                    Home
                                                </Link>
                                            </SheetClose>
                                        </li>
                                        <li>
                                            <SheetClose asChild>
                                                <Link
                                                    to="/featured"
                                                    className="block py-2 hover:underline"
                                                >
                                                    Featured
                                                </Link>
                                            </SheetClose>
                                        </li>
                                        <li>
                                            <SheetClose asChild>
                                                <Link
                                                    to="/about"
                                                    className="block py-2 hover:underline"
                                                >
                                                    About
                                                </Link>
                                            </SheetClose>
                                        </li>
                                        <li>
                                            <SheetClose asChild>
                                                <Link
                                                    to="/contact"
                                                    className="block py-2 hover:underline"
                                                >
                                                    Contact
                                                </Link>
                                            </SheetClose>
                                        </li>
                                    </ul>
                                </nav>

                                {user && (
                                    <div className="mb-8">
                                        <h4 className="mb-2 text-lg font-medium">
                                            My Account
                                        </h4>
                                        <ul className="space-y-2">
                                            <li>
                                                <SheetClose asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="justify-start w-full p-2 hover:bg-gray-100"
                                                        onClick={
                                                            onOpenSavedBooks
                                                        }
                                                    >
                                                        My Books
                                                    </Button>
                                                </SheetClose>
                                            </li>
                                            <li>
                                                <SheetClose asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="justify-start w-full p-2 hover:bg-gray-100"
                                                        onClick={
                                                            handleProfileClick
                                                        }
                                                    >
                                                        Profile
                                                    </Button>
                                                </SheetClose>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t">
                                {user ? (
                                    <SheetClose asChild>
                                        <Button
                                            className="w-full bg-green-800"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </SheetClose>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <SheetClose asChild>
                                            <Link
                                                to="/user/sign-in"
                                                className="w-full"
                                            >
                                                <Button className="w-full bg-green-800">
                                                    Sign In
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                to="/user/sign-up"
                                                className="w-full"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
