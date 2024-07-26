import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import { Outlet, useNavigation } from "react-router-dom";

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
