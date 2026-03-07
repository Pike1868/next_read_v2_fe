import { Card, CardContent } from "@/components/ui/card";
import {
    Search,
    Brain,
    Library,
    BookOpen,
    Users,
    BookMarked,
    UserPlus,
    Compass,
    Share2,
} from "lucide-react";

const features = [
    {
        icon: <Search className="w-8 h-8 text-green-600" />,
        title: "Book Discovery",
        description:
            "Search millions of books via Google Books and browse the latest NYT bestseller lists.",
    },
    {
        icon: <Brain className="w-8 h-8 text-green-600" />,
        title: "Reading Personality Quiz",
        description:
            "Take our quiz to discover your unique reading persona and get personalized recommendations.",
    },
    {
        icon: <Library className="w-8 h-8 text-green-600" />,
        title: "Personal Library",
        description:
            "Organize your books into shelves — currently reading, want to read, and finished.",
    },
    {
        icon: <BookOpen className="w-8 h-8 text-green-600" />,
        title: "Reading Progress",
        description:
            "Track pages read and monitor your reading habits over time with visual progress indicators.",
    },
    {
        icon: <Users className="w-8 h-8 text-green-600" />,
        title: "Public Profiles",
        description:
            "Share your bookshelf with friends and explore what others are reading.",
    },
    {
        icon: <BookMarked className="w-8 h-8 text-green-600" />,
        title: "Free Reading",
        description:
            "Read public domain classics directly in the app — no cost, no hassle.",
    },
];

const steps = [
    {
        icon: <UserPlus className="w-10 h-10 text-white" />,
        step: "1",
        title: "Sign Up",
        description: "Create your free account in seconds and set up your reading profile.",
    },
    {
        icon: <Compass className="w-10 h-10 text-white" />,
        step: "2",
        title: "Discover Books",
        description:
            "Search our vast catalog, browse bestsellers, or take the personality quiz for tailored picks.",
    },
    {
        icon: <Share2 className="w-10 h-10 text-white" />,
        step: "3",
        title: "Track & Share",
        description:
            "Add books to your library, log your progress, and share your profile with fellow readers.",
    },
];

export default function About() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            {/* Hero Banner */}
            <section className="relative w-full py-24 text-center bg-green-900">
                <div className="relative z-10 max-w-3xl px-6 mx-auto">
                    <h1 className="mb-4 text-5xl font-bold text-white">
                        About NextRead
                    </h1>
                    <p className="text-lg text-green-100">
                        Helping readers discover, track, and share the books
                        they love — one page at a time.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="w-full px-6 py-20 bg-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">
                        Our Mission
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-600">
                        NextRead is a platform built for both avid readers and
                        those just starting their reading journey. We combine
                        powerful book discovery through Google Books and NYT
                        bestseller lists with a unique reading personality quiz
                        to help you find your next favorite book. Build your
                        personal library, track your reading progress page by
                        page, and share your bookshelf with a public profile.
                        Whether you want to explore new genres or keep a
                        detailed reading log, NextRead has you covered.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="w-full px-6 py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
                        What You Can Do
                    </h2>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="transition-shadow duration-200 hover:shadow-lg"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-50">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="w-full px-6 py-20 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
                        How It Works
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {steps.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-green-700">
                                    {item.icon}
                                </div>
                                <span className="mb-1 text-sm font-semibold tracking-wide text-green-600 uppercase">
                                    Step {item.step}
                                </span>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
