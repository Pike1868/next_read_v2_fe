import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/sections/Footer";
import Header from "../components/Header";

const HomeLayout = () => {
    const navigation = useNavigation();
    const isPageLoading = navigation.state === "loading";

    return (
        <>
            <Header />
           
            <div className="container px-4 mx-auto">
                {isPageLoading ? <p>Loading...</p> : <Outlet />}
            </div>
            <Footer />
        </>
    );
};

export default HomeLayout;
