import { BsBookmarkStarFill } from "react-icons/bs";
import { FaBookReader } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { Card, CardContent } from "./ui/card";

export default function FeaturesSection() {
    const features = [
        {
            icon: <ImBooks size={32} className="text-[#416788]" />,
            title: "Discover New Books",
            description:
                "Explore a vast library of books across various genres and authors.",
            imgSrc: "/discovernewbooks.jpg",
        },
        {
            icon: <FaBookReader size={32} className="text-[#416788]" />,
            title: "Track Your Progress",
            description:
                "Keep track of the books you're currently reading and those you've completed.",
            imgSrc: "/trackyourprogress.jpg",
        },
        {
            icon: <BsBookmarkStarFill size={32} className="text-[#416788]" />,
            title: "Save Favorites",
            description:
                "Create a personalized library of your favorite books.",
            imgSrc: "/savefavoritebooks.jpg",
        },
    ];

    return (
        <section className="w-full px-6 py-20 bg-white">
            <h2 className="mb-8 text-4xl font-bold text-center">Features</h2>
            <div className="flex flex-wrap justify-center gap-8">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="w-full max-w-sm p-0 overflow-hidden transition-transform duration-200 transform rounded-lg shadow-md hover:scale-105"
                    >
                        <img
                            src={feature.imgSrc}
                            alt={feature.title}
                            className="object-cover w-full h-48 rounded-t-lg"
                        />
                        <CardContent className="h-full p-4 text-center bg-white ">
                            <div className="flex justify-center mb-4">
                                {feature.icon}
                                <h3 className="ml-4 text-xl font-semibold text-[#416788]">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-gray-700">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
