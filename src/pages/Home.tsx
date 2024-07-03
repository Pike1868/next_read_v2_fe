import { Button } from "@/components/ui/button";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
            <h1 className="mb-12 text-4xl font-bold">NextRead</h1>
            <p className="px-32 text-lg">
                Welcome to Next Read, your platform for discovering and tracking
                your next favorite book! Whether you're an avid reader or just
                starting your reading journey, we've got you covered. Explore
                our vast library of books, save your favorites, and track your
                reading progress with ease.
            </p>
            <Button className="mt-6">Find Your Next Read</Button>
        </div>
    );
};

export default HomePage;
