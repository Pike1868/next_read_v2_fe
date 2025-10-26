import PrivateRoute from "@/components/user/PrivateRoute";
import HomeLayout from "@/layouts/HomeLayout";
import About from "@/pages/About";
import BookDetails from "@/pages/BookDetails";
import Contact from "@/pages/Contact";
import ErrorPage from "@/pages/Error";
import Featured from "@/pages/Featured";
import HomePage from "@/pages/Home";
import MyBooks from "@/pages/MyBooks";
import Profile from "@/pages/Profile";
import Quiz from "@/pages/Quiz";
import QuizResults from "@/pages/QuizResults";
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
                path: "quiz",
                element: <PrivateRoute />,
                children: [{ path: "", element: <Quiz /> }],
            },
            {
                path: "quiz-results",
                element: <PrivateRoute />,
                children: [{ path: "", element: <QuizResults /> }],
            },
            {
                path: "user/profile",
                element: <PrivateRoute />,
                children: [{ path: "", element: <Profile /> }],
            },
            {
                path: "user/library",
                element: <PrivateRoute />,
                children: [{ path: "", element: <MyBooks /> }],
            },
            { path: "book/:volume_id", element: <BookDetails /> },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
