import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ErrorPage from "./pages/Error";
import Featured from "./pages/Featured";
import HomePage from "./pages/Home";

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
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
