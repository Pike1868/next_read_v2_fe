import Signin from "@/pages/Signin";
import Signup from "@/pages/Signup";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ErrorPage from "./pages/Error";
import Featured from "./pages/Featured";
import HomePage from "./pages/Home";
import Search from "./pages/Search";

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
            { path: "search", element: <Search /> },
            { path: "sign-up", element: <Signup /> },
            { path: "sign-in", element: <Signin /> },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
