import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CallToActionSection() {
    const navigate = useNavigate();

    return (
        <section className="w-full px-6 py-16 bg-green-900">
            <motion.h2
                className="mb-8 text-4xl font-bold text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                Get Started Today
            </motion.h2>
            <motion.p
                className="mb-8 text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                Join NextRead and start your reading journey now!
            </motion.p>
            <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Button
                    onClick={() => navigate("/user/sign-up")}
                    className="mt-6 bg-[#f5cb5c] text-black text-lg hover:bg-yellow-200 transition-all hover:scale-105"
                >
                    Sign Up Now
                </Button>
            </motion.div>
        </section>
    );
}
