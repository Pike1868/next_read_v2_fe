import SavedBooksModal from "@/components/modals/SavedBooksModal";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import { useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";

const HomeLayout = () => {
    const navigation = useNavigation();
    const isPageLoading = navigation.state === "loading";

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <main className="relative flex flex-col min-h-screen">
            <Header onOpenSavedBooks={toggleModal} />
            <div className="container flex-grow px-4 mx-auto max-w-full md:max-w-[90%] lg:max-w-[1200px]">
                {isPageLoading ? <p>Loading...</p> : <Outlet />}
            </div>
            <Footer />
            <SavedBooksModal isOpen={isModalOpen} onClose={toggleModal} />
        </main>
    );
};

export default HomeLayout;
