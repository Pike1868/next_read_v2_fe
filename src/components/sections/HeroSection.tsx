import Searchbar from "@/components/books/Searchbar";

export default function HeroSection() {
    return (
        <section
            className="relative w-full py-20 sm:py-32 lg:py-40 text-center bg-center bg-cover"
            style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        >
            <div className="absolute inset-0 opacity-50 bg-green-950"></div>
            <div className="relative z-10 px-4">
                <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    NextRead
                </h1>
                <p className="mx-auto mb-6 sm:mb-8 text-sm sm:text-lg text-white max-w-2xl px-4">
                    Welcome to NextRead, your platform for discovering and
                    tracking your next favorite book! Whether you're an avid
                    reader or just starting your reading journey, we've got you
                    covered.
                </p>
                <div className="flex justify-center px-4">
                    <div className="w-full max-w-md sm:max-w-lg">
                        <Searchbar />
                    </div>
                </div>
            </div>
        </section>
    );
}
