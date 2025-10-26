import SavedBooksModal from "@/components/modals/SavedBooksModal"; // Import the modal component
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import { useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";

const HomeLayout = () => {
    const navigation = useNavigation();
    const isPageLoading = navigation.state === "loading";

    // State to manage modal visibility
    const [isModalOpen, setModalOpen] = useState(false);

    // Function to toggle the modal visibility
    const toggleModal = () => setModalOpen(!isModalOpen);

    return (
        <main className="relative flex flex-col min-h-screen">
            <Header onOpenSavedBooks={toggleModal} />{" "}
            {/* Pass toggle function to Header */}
            <div className="container flex-grow px-4 md:px-6 lg:px-8 py-4 md:py-6 mx-auto">
                {isPageLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-lg text-gray-600">Loading...</p>
                    </div>
                ) : (
                    <Outlet />
                )}
            </div>
            <Footer />
            {/* Conditionally render the modal */}
            {isModalOpen && <SavedBooksModal onClose={toggleModal} />}
        </main>
    );
};

export default HomeLayout;
