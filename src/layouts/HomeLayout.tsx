import SavedBooksModal from "@/components/modals/SavedBooksModal";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const HomeLayout = () => {
    const navigation = useNavigation();
    const location = useLocation();
    const isPageLoading = navigation.state === "loading";

    const [isModalOpen, setModalOpen] = useState(false);
    const toggleModal = () => setModalOpen(!isModalOpen);

    return (
        <main className="relative flex flex-col min-h-screen">
            <Header onOpenSavedBooks={toggleModal} />
            <div className="container flex-grow px-4 md:px-6 lg:px-8 py-4 md:py-6 mx-auto">
                {isPageLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="w-10 h-10 border-3 border-gray-200 border-t-green-700 rounded-full animate-spin" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
            <Footer />
            {isModalOpen && <SavedBooksModal onClose={toggleModal} />}
        </main>
    );
};

export default HomeLayout;
