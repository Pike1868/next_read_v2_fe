import Searchbar from "@/components/books/Searchbar";

export default function HeroSection() {
    return (
        <section
            className="relative w-full py-40 text-center bg-center bg-cover"
            style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        >
            <div className="absolute inset-0 opacity-50 bg-green-950"></div>
            <div className="relative z-10">
                <h1 className="mb-4 text-5xl font-bold text-white">NextRead</h1>
                <p className="m-auto mb-8 text-lg text-white max-w-prose">
                    Welcome to NextRead, your platform for discovering and
                    tracking your next favorite book! Whether you're an avid
                    reader or just starting your reading journey, we've got you
                    covered.
                </p>
                <div className="flex justify-center">
                <Searchbar />
                </div>
            </div>
        </section>
    );
}
