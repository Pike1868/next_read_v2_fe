import { RootState } from "@/store/rootReducer";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const user = useSelector((state: RootState) => state.user.user);

    return user ? <Outlet /> : <Navigate to="/user/sign-in" />;
};

export default PrivateRoute;
