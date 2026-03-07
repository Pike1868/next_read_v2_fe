import { BsBookmarkStarFill } from "react-icons/bs";
import { FaBookReader } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function FeaturesSection() {
    const features = [
        {
            icon: <ImBooks size={32} className="text-yellow-600" />,
            title: "Discover New Books",
            description:
                "Explore a vast library of books across various genres and authors.",
            imgSrc: "/discovernewbooks.jpg",
        },
        {
            icon: <FaBookReader size={32} className="text-yellow-600" />,
            title: "Track Your Progress",
            description:
                "Keep track of the books you're currently reading and those you've completed.",
            imgSrc: "/trackyourprogress.jpg",
        },
        {
            icon: <BsBookmarkStarFill size={32} className="text-yellow-600" />,
            title: "Save Favorites",
            description:
                "Create a personalized library of your favorite books.",
            imgSrc: "/savefavoritebooks.jpg",
        },
    ];

    return (
        <section className="w-full px-6 py-20 bg-white">
            <motion.h2
                className="mb-8 text-4xl font-bold text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
            >
                Features
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                        <Card
                            className="w-full max-w-sm p-0 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={feature.imgSrc}
                                alt={feature.title}
                                className="object-cover w-full h-48 rounded-t-lg"
                            />
                            <CardContent className="h-full p-4 text-center bg-[#14532D]">
                                <div className="flex justify-center mb-4">
                                    {feature.icon}
                                    <h3 className="ml-4 text-xl font-semibold text-white">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-white">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
