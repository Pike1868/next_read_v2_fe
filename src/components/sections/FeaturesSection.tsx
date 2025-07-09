import { Card, CardContent } from "@/components/ui/card";
import { BsBookmarkStarFill } from "react-icons/bs";
import { FaBookReader } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

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
        <section className="w-full px-4 sm:px-6 py-12 sm:py-20 bg-white">
            <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="w-full p-0 overflow-hidden transition-transform duration-200 transform rounded-lg shadow-md hover:scale-105"
                    >
                        <img
                            src={feature.imgSrc}
                            alt={feature.title}
                            className="object-cover w-full h-40 sm:h-48 rounded-t-lg"
                        />
                        <CardContent className="h-full p-4 text-center bg-[#14532D]">
                            <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
                                {feature.icon}
                                <h3 className="mt-2 sm:mt-0 sm:ml-4 text-lg sm:text-xl font-semibold text-white">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-sm sm:text-base text-white">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
