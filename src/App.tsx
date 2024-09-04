import PrivateRoute from "@/components/user/PrivateRoute";
import HomeLayout from "@/layouts/HomeLayout";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ErrorPage from "@/pages/Error";
import Featured from "@/pages/Featured";
import HomePage from "@/pages/Home";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "about", element: <About /> },
            { path: "featured", element: <Featured /> },
            { path: "contact", element: <Contact /> },
            { path: "book/search", element: <Search /> },
            { path: "user/sign-up", element: <Signup /> },
            { path: "user/sign-in", element: <Signin /> },
            {
                path: "user/profile",
                element: <PrivateRoute />,
                children: [{ path: "", element: <Profile /> }],
            },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
