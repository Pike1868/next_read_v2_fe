import Searchbar from "@/components/books/Searchbar";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section
            className="relative w-full py-40 text-center bg-center bg-cover"
            style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        >
            <div className="absolute inset-0 opacity-50 bg-green-950"></div>
            <div className="relative z-10">
                <motion.h1
                    className="mb-4 text-5xl font-bold text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    NextRead
                </motion.h1>
                <motion.p
                    className="m-auto mb-8 text-lg text-white max-w-prose"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                    Welcome to NextRead, your platform for discovering and
                    tracking your next favorite book! Whether you're an avid
                    reader or just starting your reading journey, we've got you
                    covered.
                </motion.p>
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Searchbar />
                </motion.div>
            </div>
        </section>
    );
}
