import { BsBookmarkStarFill } from "react-icons/bs";
import { FaBookReader } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

export default function FeaturesSection() {
    return (
        <section className="w-full px-6 py-16 bg-white">
            <h2 className="mb-8 text-4xl font-bold text-center">Features</h2>
            <div className="flex flex-wrap justify-center space-x-4 text-white">
                <div className="w-full max-w-sm p-4 text-center transition-transform duration-300 transform bg-[#416788] rounded-lg shadow-md hover:scale-105">
                    <div className="flex justify-center">
                        <ImBooks size={32} />
                        <h3 className="mb-2 ml-4 text-xl font-semibold">
                            Discover New Books
                        </h3>
                    </div>
                    <p>
                        Explore a vast library of books across various genres
                        and authors.
                    </p>
                </div>
                <div className="w-full max-w-sm p-4 text-center transition-transform duration-300 transform bg-[#416788] rounded-lg shadow-md hover:scale-105">
                    <div className="flex justify-center">
                        <FaBookReader size={32} />
                        <h3 className="mb-2 ml-4 text-xl font-semibold">
                            Track Your Progress
                        </h3>
                    </div>
                    <p>
                        Keep track of the books you're currently reading and
                        those you've completed.
                    </p>
                </div>
                <div className="w-full max-w-sm p-4 text-center transition-transform duration-300 transform bg-[#416788] rounded-lg shadow-md hover:scale-105">
                    <div className="flex justify-center">
                        <BsBookmarkStarFill size={32} />
                        <h3 className="mb-2 ml-4 text-xl font-semibold">
                            Save Favorites
                        </h3>
                    </div>
                    <p>Create a personalized library of your favorite books.</p>
                </div>
            </div>
        </section>
    );
}
